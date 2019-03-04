const GoogleStrategy = require('passport-google-oauth20').Strategy;
const request = require('request');
const { User } = require('../models/User.js');
const validator = require('../helpers/validator.js');
const helpers = require('../helpers/helpers.js');

module.exports = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_BACK}${process.env.GOOGLE_REDIRECT}`,
},
async (accessToken, refreshToken, profile, cb) => {
  const email = profile.emails[0].value;
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
    firstname: profile.name.givenName,
    lastname: profile.name.familyName,
    email,
    authKey,
  });
  newUser.auth = false;
  return cb(null, newUser);
});