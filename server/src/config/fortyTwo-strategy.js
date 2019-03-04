const OAuth2Strategy = require('passport-oauth2').Strategy;
const request = require('request');

const { User } = require('../models/User.js');
const validator = require('../helpers/validator.js');
const helpers = require('../helpers/helpers.js');

async function getId(accessToken) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const options = {
      url: 'https://api.intra.42.fr/oauth/token/info',
      headers,
    };
    function callback(error, response, body) {
      if (!error && response.statusCode === 200) {
        let tokenInfos = body.split(',');
        tokenInfos = tokenInfos[0].split(':');
        resolve(tokenInfos[1]);
      }
    }
    request(options, callback);
  });
}

async function getInfo(accessToken, userId) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const options = {
      url: `https://api.intra.42.fr/v2/users/${userId}`,
      headers,
    };
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
    }
    request(options, callback);
  });
}

async function serializeUserInfos(userInfos) {
  const UserInfos = userInfos.split(',');
  const strategyId = UserInfos[0].split(':');
  const email = UserInfos[1].split(':');
  const login = UserInfos[2].split(':');
  const firstname = UserInfos[3].split(':');
  const lastname = UserInfos[4].split(':');
  const avatar = await helpers.randomAvatar();
  const userInfosSerialized = {
    strategy: 'fortyTwo',
    strategyId: strategyId[1],
    email: email[1].replace(/"/g, ''),
    login: login[1].replace(/"/g, ''),
    firstname: firstname[1].replace(/"/g, ''),
    lastname: lastname[1].replace(/"/g, ''),
    avatar,
  };
  return userInfosSerialized;
}

module.exports = new OAuth2Strategy({
  authorizationURL: process.env.FORTYTWO_AUTHORIZATION_URL,
  tokenURL: process.env.FORTYTWO_TOKEN_URL,
  clientID: process.env.FORTYTWO_CLIENT_ID,
  clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_BACK}${process.env.FORTYTWO_REDIRECT}`,
},
async (accessToken, refreshToken, profile, cb) => {
  if (accessToken) {
    const userId = await getId(accessToken);
    console.log('userId', userId);
    if (userId) {
      let userInfos = await getInfo(accessToken, userId);
      userInfos = await serializeUserInfos(userInfos);
      const user = await User.find({ strategy: userInfos.strategy, strategyId: userInfos.strategyId });
      if (!user[0]) {
        const errorMessage = await validator.checkDbSignupOmniauth(userInfos.email);
        const authKey = await helpers.generateAuthKey();
        const newUser = await User.create({
          strategy: userInfos.strategy,
          strategyId: userInfos.strategyId,
          login: userInfos.login,
          firstname: userInfos.firstname,
          lastname: userInfos.lastname,
          email: userInfos.email,
          picture: userInfos.avatar,
          authKey,
        });
        newUser.auth = true;
        if (errorMessage) {
          newUser.error = errorMessage;
          newUser.auth = false;
        }
        return cb(null, newUser);
      }
      const connection = { auth: true, authKey: user[0].authKey };
      return cb(null, connection);
    }
  }
});
