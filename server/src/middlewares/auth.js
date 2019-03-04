const Validator = require('../helpers/validator.js');

const middlewares = {
  Query: {
    miniMovies: Validator.verifyToken,
    movieInfo: Validator.verifyToken,
    oneMovie: Validator.verifyToken,
    getComments: Validator.verifyToken,
    getUserInfo: Validator.verifyToken,
  },
  Mutation: {
    submitComment: Validator.verifyToken,
    changeGeneral: Validator.verifyToken,
    changePassword: Validator.verifyToken,
    changeEmail: Validator.verifyToken,
  },
};

module.exports = [middlewares];
