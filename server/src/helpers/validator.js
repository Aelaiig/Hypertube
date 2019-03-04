const { UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User.js');
const helpers = require('./helpers.js');

module.exports = {
  checkDbSignup: async (login, email, picture) => {
    const isLoginTaken = await User.findOne({ login });
    const isEmailTaken = await User.findOne({ email });
    if (isLoginTaken) throw new ForbiddenError('This login is already taken.');
    if (isEmailTaken) throw new ForbiddenError('This email is already taken.');
    if (picture === '') throw new ForbiddenError('Please choose a picture.');
  },
  checkDbSignupOmniauth: async (email) => {
    const isEmailTaken = await User.findOne({ email });
    if (isEmailTaken) return ('This email is already taken.');
  },
  checkDbSignupOmniauth2: async (authKey, login, email, picture) => {
    const isAuthKeyValid = await User.find({ authKey });
    const isLoginTaken = await User.findOne({ login, authKey: { $ne: authKey } });
    const isEmailTaken = await User.findOne({ email, authKey: { $ne: authKey } });
    if (!isAuthKeyValid[0]) throw new ForbiddenError('Invalid account.');
    if (isLoginTaken) throw new ForbiddenError('This login is already taken.');
    if (isEmailTaken) throw new ForbiddenError('This email is already taken.');
    if (picture === '') throw new ForbiddenError('Please choose a picture.');
  },
  checkSignIn: async (login, password) => {
    const user = await User.findOne({ login });
    if (user && bcrypt.compareSync(password, user.password)) {
      return helpers.generateToken(user);
    }
    throw new AuthenticationError('Invalid login or password');
  },
  IsValidAuthKey: async (authKey) => {
    const user = await User.findOne({ authKey });
    if (user !== null && user.strategy !== 'locale') {
      const newAuthKey = await helpers.generateAuthKey();
      const newUser = await User.updateOne({ authKey }, { $set: { authKey: newAuthKey } });
      return user;
    }
    return false;
  },
  IsValidAuthKey2: async (authKey) => {
    console.log('authKey', authKey);
    const user = await User.findOne({ authKey });
    if (user !== null && user.strategy === 'locale') {
      return true;
    }
    return false;
  },
  verifyToken: async (resolve, root, args, context, info) => {
    const { authorization } = context.response.req.headers;
    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      jwt.verify(token, process.env.JWT_SECRET);
    } else throw new AuthenticationError('Invalid Token');
    const result = await resolve(root, args, context, info);
    return result;
  },
  emailExist: async (email) => {
    const user = await User.findOne({ email });
    if (user) {
      if (user.strategy !== 'locale') {
        throw new UserInputError(`Your account need a ${user.strategy} authentication`);
      }
      return user;
    }
    throw new UserInputError('Unknow email');
  },
};
