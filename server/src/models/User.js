const mongoose = require('mongoose');

const { Schema } = mongoose;

function buildModel(name, schema) {
  return mongoose.model(name, new Schema(schema, { timestamps: true }));
}

module.exports.User = buildModel('User', {
  strategy: {
    type: String,
    default: 'locale',
  },
  strategyId: {
    type: String,
    default: '',
  },
  login: {
    type: String,
    default: '',
  },
  firstname: {
    type: String,
    default: '',
  },
  lastname: {
    type: String,
    default: '',
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  picture: {
    type: String,
  },
  authKey: {
    type: String,
  },
  newEmail: {
    type: String,
    default: '',
  },
  newEmailToken: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'english',
  },
  movies: {
    type: [String],
    default: []
  }
});
