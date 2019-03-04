const { UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server');
const axios = require('axios');

const { GraphQLScalarType } = require('graphql');
const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');
const fs = require('fs');
const http = require('http');
const movieDB = require('moviedb-scrapper-hypertube');
const OS = require('opensubtitles-api');
const torrentFinder = require('torrentfinder-hypertube');
const sendMail = require('./helpers/sendMail.js');
const jwt = require('jsonwebtoken');
const { User } = require('./models/User.js');
const { Movie } = require('./models/Movie.js');
// const { Torrent } = require('./models/Torrent.js');
const validator = require('./helpers/validator.js');
const helpers = require('./helpers/helpers.js');



function checkId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new UserInputError('Incorrect ID.');
  }
  return true;
}

function getToken(context) {
  return jwt.verify(context.response.req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
}

const opensubtitles = new OS({
  useragent: 'Popcorn Time NodeJS',
  ssl: false,
});

const resolvers = {
  Query: {
    test(_, args, context) {
      return 'Hello World!!';
    },
    async getComments(_, { movieId }, context) {
      try {
        const movie = await Movie.findOne({ id: movieId });
        if (!movie) {
          return [];
        }
        const { comments } = movie;
        let users = [];
        for (let i = 0; i < comments.length; i += 1) {
          users.push(User.findById(comments[i].id, 'login picture -_id'));
        }
        users = await Promise.all(users);
        const retComments = [];
        for (let j = 0; j < comments.length; j += 1) {
          const { _id, ...pureComment } = comments[j].toObject();
          const userInfos = users[j] ? users[j].toObject() : { login: 'Deleted account', picture: '/avatar/avatar1.png' };
          retComments.push({
            ...pureComment,
            ...userInfos,
          });
        }
        const ret = {
          movieId,
          comments: retComments,
        };
        return ret;
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async getUserInfo(_, { id }) {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new UserInputError('Incorrect ID.');
        }
        const user = await User.findById(id, 'login firstname lastname picture -_id');
        if (!user) {
          throw new UserInputError('User not found.');
        }
        return user;
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async miniMovies(_, { nbPage }, context) {
      try {
        const userInfos = getToken(context);
        const nbPgMovies = await movieDB.getNbPagesPopulars('movie');
        const pelisUser = await User.findById(userInfos.id, 'movies');
        if (nbPage <= nbPgMovies) {
          let movies = await movieDB.getPopulars('movie', nbPage);
          if (nbPage === 1 && movies) {
            movies = movies.concat(await movieDB.getPopulars('movie', 2));
          }
          movies.forEach((elem) => {
            if (pelisUser && pelisUser.movies.indexOf(elem.id) > -1) {
              elem.see = true;
            } else {
              elem.see = false;
            }
          });
          return movies;
        }
        return [];
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async signIn(_, { login, password }) {
      try {
        const token = await validator.checkSignIn(login, password);
        return token;
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async askToken(_, args, context) {
      const user = await validator.IsValidAuthKey(args.authKey);
      if (user !== false) {
        return helpers.generateToken(user);
      }
      return false;
    },
    async movieInfo(_, { movieId }) {
      const downloadedMovies = await axios.get('http://server-stream:3000/sources/' + movieId).then(response => {
        var dbTorrents = [];
        response.data.forEach(elem => {
          dbTorrents.push({title: elem.file, quality: "Local", hash: elem.hash, ratio: 3});
        });
        return dbTorrents;
      }).catch(error => {
        console.log(error);
      });
      const dbMovie = await Movie.findOne({ id: movieId });
      if (dbMovie !== null && (Date.now() - dbMovie.lastScrappingUpdate) < 86400000) {
        dbMovie.torrentsInfo = [...downloadedMovies, ...dbMovie.torrentsInfo];
        return dbMovie;
      }
      const movieInfo = await movieDB.getMovieInfoById(movieId, 'en-US');
      if (movieInfo) {
        movieInfo.id = movieId;
        const torrents = await torrentFinder.search(movieInfo);
        if (dbMovie !== null) {
          await Movie.updateOne({ id: movieId }, { ...movieInfo, lastScrappingUpdate: Date.now() });
        } else {
          movieInfo.torrentsInfo = [...torrents];
          Movie.create(movieInfo);
        }
        movieInfo.torrentsInfo = [...downloadedMovies, ...torrents];
      }
      return movieInfo;
    },
    async hash(_, { torrent, tipo, movieId, name, year }) {
      var hash = '';
      if (tipo === 'hash')
      {
        hash = await axios.post('http://server-stream:3000/requesthash', {hash: torrent}).then(resp => {
          if (resp.data.err)
            return null;
          return resp.data;
        });
      } else if (tipo === 'dlLink') {
        hash = await axios.post('http://server-stream:3000/request', {
          filmId: movieId,
          torrent: torrent,
          name: name,
          year: year}).then(resp => {
            // console.log(resp.data);
            return resp.data
          });
      }
      return hash;

    },
    async oneMovie(_, { movieTitle }) {
      const oneMovie = await movieDB.getOnePageMedia(movieTitle, 1, 'movie');
      const dos = await movieDB.getOnePageMedia(movieTitle, 2, 'movie');
      const tres = await movieDB.getOnePageMedia(movieTitle, 3, 'movie');

      const pelis = [
        ...oneMovie,
        ...dos,
        ...tres,
      ];
      return pelis;
    },
    getBackgrounds(_, args, context) {
      const dir = './../client/public/background/';
      return new Promise((resolve, error) => fs.readdir(dir, (err, files) => {
        resolve(`/background/${files[Math.floor(Math.random() * Math.floor(files.length))]}`);
      }));
    },
    getAvatars(_, args, context) {
      const avatars = [];
      const dir = './../client/public/avatar/';
      return new Promise((resolve, error) => fs.readdir(dir, (err, files) => {
        files.forEach((file) => {
          avatars.push(`/avatar/${file}`);
        });
        resolve(avatars);
      }));
    },
    async selectedAvatar(_, args, context) {
      const avatar = await helpers.randomAvatar();
      return avatar;
    },
    async confirmNewEmail(_, { newEmailToken }) {
      try {
        const document = await User.findOne({ newEmailToken });
        if (!document) {
          throw new UserInputError('Your token might be corrupted, please try changing your email once again.');
        }
        await User.updateOne({ newEmailToken }, { email: document.newEmail, newEmail: '', newEmailToken: '' });
      } catch (err) {
        return helpers.errorHandler(err);
      }
      return 'New email validated succesfully.';
    },
    async sendResetPassword(_, { email }, context) {
      const user = await validator.emailExist(email);
      sendMail(user.email, 'Please reset your password',
        `Please follow this link in order to confirm your new email address :
        ${process.env.SERVER_CLIENT}/resetPassword/${user.authKey}`);
      return 'Check your email to reset your password';
    },
  },
  Mutation: {
    async signUp(_, {login, firstname, lastname, email, password, picture }) {
      try {
        const authKey = await helpers.generateAuthKey();
        const errorMessage = await validator.checkDbSignup(login, email, picture);
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          login,
          firstname,
          lastname,
          email,
          password: hashPassword,
          picture,
          authKey,
        });
        return user;
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async signUpOmniauth(_, { authKey, login, firstname, lastname, email, picture }) {
      const errorMessage = await validator.checkDbSignupOmniauth2(authKey, login, email, picture);
      const updateUser = await User.updateOne({ authKey }, { $set: { 
        login,
        firstname,
        lastname,
        email,
        picture,
      }});
      const user = await User.findOne({ authKey });
      return helpers.generateToken(user);
    },
    async submitComment(_, { movieId, comment }, context) {
      try {
        const userInfos = getToken(context);
        const com = {
          id: userInfos.id,
          comment,
        };
        const doc = await Movie.updateOne({ id: movieId }, { $push: { comments: com } });
        if (doc.nModified < 1) {
          throw new UserInputError('Movie not found');
        }
        return movieId;
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    // TODO: VALIDATORS
    async changeGeneral(_, { id, key, value }, context) {
      try {
        const userInfos = getToken(context);
        if ((key === 'login' || key === 'firstname' || key === 'lastname') && (value.length < 1 || value.match(/[\s\n\t]/g))) {
          throw new UserInputError(`${key} must be at least one character long and only alphabetical`);
        }
        if (key === 'picture' && !value.match(/\/avatar\/avatar[1-8]\.png/)) {
          throw new UserInputError('Not valid avatar name.');
        }
        if (key === 'login') {
          const checkUser = await User.findOne({ login: value });
          if (checkUser) {
            if (checkUser.id.toString() === id) {
              throw new UserInputError('You already use this username.');
            } else {
              throw new ForbiddenError('This username has already been taken.');
            }
          }
        }
        const doc = await User.updateOne({ _id: id }, { [key]: value });
        if (doc.nModified < 1) {
          throw new UserInputError('No user corresponding to this ID.');
        }
        userInfos[key] = value;
        return {
          newToken: helpers.generateToken(userInfos),
          message: `${key} updated successfully.`,
        };
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async changePassword(_, { id, password, newPassword }, context) {
      try {
        const userToken = getToken(context);
        if (!helpers.validatePassword(newPassword)) throw new UserInputError('Password must contain more than 8 characters, lowercase, uppercase, numbers, and special characters. All without space');
        const user = await User.findById(userToken.id, 'password -_id');
        if (!user) throw new UserInputError('User doesn\'t exist.');
        const { password: dbPw } = user;
        if (!await bcrypt.compare(password, dbPw)) throw new AuthenticationError('Incorrect password.');
        await User.updateOne({ _id: id }, { password: await bcrypt.hash(newPassword, 10) });
        return 'Password modified successfully';
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async changeEmail(_, { id, password, newEmail }) {
      try {
        if (!helpers.validateEmail(newEmail)) throw new UserInputError('Please enter a valid email address');
        const user = await User.findById(id, 'email password strategy -_id');
        if (!user) throw new UserInputError('No user corresponding to this ID.');
        if (newEmail === user.email) throw new UserInputError('You already use this email');
        const checkEmail = await User.find({ email: newEmail });
        if (checkEmail.length > 0) throw new ForbiddenError('Email already in use.');
        if (user.strategy === 'locale' && !await bcrypt.compare(password, user.password)) throw new AuthenticationError('Incorrect Password');
        const newEmailToken = Math.random().toString(36).substr(2)
          + Math.random().toString(36).substr(2);
        await User.updateOne({ _id: id }, { newEmail, newEmailToken });
        sendMail(newEmail,
          'Please confirm your new email address',
          `Please follow this link in order to confirm your new email address : 
          ${process.env.SERVER_CLIENT}/confirmNewEmail/${newEmailToken}`);
        return `You received an email on your new email address, 
          you must confirm it before it will be taken into account`;
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async resetPassword(_, args, context) {
      try {
        console.log('args.authKey', args.authKey);
        const isvalid = await validator.IsValidAuthKey2(args.authKey);
        if (isvalid !== false) {
          await User.updateOne({ authKey: args.authKey }, { password: await bcrypt.hash(args.password, 10) });
          return true;
        }
        throw new AuthenticationError('Invalid authentification');
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async movieSee(_, { movieId }, context) {
      const userToken = getToken(context);
      const userId = userToken.id;
      const usuario = await User.findById(userId);
      if (usuario && usuario.movies.indexOf(movieId) === -1) {
        await User.updateOne({ _id: userId }, { $push:{ movies: movieId }});
      }
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue: value => moment(value).toDate(), // value from the client
    serialize: value => value.getTime(), // value sent to the client
    parseLiteral: ast => ast,
  }),
};

module.exports = resolvers;
