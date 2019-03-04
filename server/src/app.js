require('dotenv').load();
require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga'); // sort of a framework for GraphQL server which is built on top Apollo
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const resolvers = require('./resolvers');
const auth = require('./middlewares/auth.js');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
  console.log('Server connected to Database');
}).catch((err) => {
  console.log('Server not Connected to Database ERROR!', err);
});
console.error = () => null;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Server connection error'));

db.once('open', (callback) => {
  console.log('Connection Succeeded');
});

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  middlewares: auth,
  context: (req) => {
    const { response } = req;
    const { user } = req.request;
    return { response, user };
  },
});

server.use(cors());
server.express.use(cors());

const options = {
  port: process.env.PORT || 5500,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
};

const githubStrategy = require('./config/github-strategy');
const fortyTwoStrategy = require('./config/fortyTwo-strategy');
const googleStrategy = require('./config/google-strategy');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(githubStrategy);
passport.use(fortyTwoStrategy);
passport.use(googleStrategy);
server.use(passport.initialize());

server.use('/play', (req, res) => {
  var torrentsList = []
  req.query.torrentsList.forEach(elem => {
    torrentsList.push(JSON.parse(elem));
  });
  console.log(torrentsList[req.query.torrentIndex]);
  res.send(req.query);
});

server.use('/auth42/connect', passport.authenticate('oauth2'), () => {
});

server.use('/auth42/callback', passport.authenticate('oauth2', { failureRedirect: `${process.env.SERVER_CLIENT}/signin` }),
  (req, res) => {
    console.log('42 res', req.user.auth);
    if (req.user.auth === true) {
      res.status(200).redirect(`${process.env.SERVER_CLIENT}?authKey=${req.user.authKey}`);
    } else if (req.user.error) {
      res.status(200).redirect(`${process.env.SERVER_CLIENT}/signupOmniauth?authKey=${req.user.authKey}&login=${req.user.login}&firstname=${req.user.firstname}&lastname=${req.user.lastname}&email=${req.user.email}`);
    }
  });

server.use('/auth/connect', passport.authenticate('github'), () => {
});

server.use('/auth/callback', passport.authenticate('github', { failureRedirect: `${process.env.SERVER_CLIENT}/signin` }),
  (req, res) => {
    if (req.user.auth === true) {
      res.status(200).redirect(`${process.env.SERVER_CLIENT}?authKey=${req.user.authKey}`);
    } else if (req.user.auth === 'error') {
      res.status(200).redirect(`${process.env.SERVER_CLIENT}/signin?error=${req.user.error}`);
    } else {
      res.status(200).redirect(`${process.env.SERVER_CLIENT}/signupOmniauth?authKey=${req.user.authKey}&login=${req.user.login}&email=${req.user.email}`);
    }
  });

server.use('/authGoogle/connect', passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email'] }), () => {
});

server.use('/authGoogle/callback', passport.authenticate('google', { failureRedirect: `${process.env.SERVER_CLIENT}/signin` }),
  (req, res) => {
    if (req.user.auth === true) {
      res.status(200).redirect(`${process.env.SERVER_CLIENT}?authKey=${req.user.authKey}`);
    } else {
      res.status(200).redirect(`${process.env.SERVER_CLIENT}/signupOmniauth?authKey=${req.user.authKey}&firstname=${req.user.firstname}&lastname=${req.user.lastname}&email=${req.user.email}`);
    }
  });

server.start(options, ({ port }) => console.log(`Server is running on port ${port}`));
