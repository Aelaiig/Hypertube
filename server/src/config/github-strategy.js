const GitHubStrategy = require('passport-github').Strategy;
const { User } = require('../models/User.js');
const helpers = require('../helpers/helpers.js');
// const debug = require('debug')('github');

module.exports = new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_BACK}${process.env.GITHUB_REDIRECT}`,
  scope: 'user:email',
},
async (accessToken, refreshToken, profile, cb) => {
  const user = await User.find({ strategyId: profile.id, strategy: profile.provider });
  if (user[0] && user[0].login !== '' && user[0].firstname !== '' && user[0].lastname !== '' && user[0].email !== '' && user[0].picture !== '') {
    const connection = { auth: true, authKey: user[0].authKey };
    return cb(null, connection);
  } if (user[0]) {
    return cb(null, user[0]);
  }
  const authKey = await helpers.generateAuthKey();
  const newUser = await User.create({
    strategy: profile.provider,
    strategyId: profile.id,
    login: profile.username,
    email: profile.emails[0].value,
    authKey,
  });
  newUser.auth = false;
  return cb(null, newUser);
});