const { UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
  generateAuthKey: async () => {
    let authKey = Math.random().toString(36).replace('0.', '');
    authKey = bcrypt.hashSync(authKey, 10);
    authKey = authKey.replace(/\//g, '');
    return authKey;
  },
  generateToken: async ({ id, login, email, firstname, lastname, language, picture, strategy }) => {
    return jwt.sign({
      id,
      login,
      email,
      firstname,
      lastname,
      language,
      picture,
      strategy,
    }, process.env.JWT_SECRET);
  },
  randomAvatar: async () => {
    const dir = './../client/public/avatar/';
    return new Promise((resolve, error) => fs.readdir(dir, (err, files) => {
      resolve(`/avatar/${files[Math.floor(Math.random() * Math.floor(files.length))]}`);
    }));
  },
  validateEmail: (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  validatePassword: (password) => {
    if ((password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/)) == null) {
      return false;
    }
    return true;
  },
  errorHandler: (err) => {
    if (err instanceof UserInputError) {
      return Error(`User error : ${err.message}`);
    }
    if (err instanceof AuthenticationError) {
      return Error(`Authentication error : ${err.message}`);
    }
    if (err instanceof ForbiddenError) {
      return Error(`Authorization error : ${err.message}`);
    }
    return Error('Internal server error.');
  },
};
