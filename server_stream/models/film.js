const mongoose = require('mongoose');

module.exports = mongoose.model('Films', {
  filmId: Number,
  hash: String,
  torrent: String,
  lastSeen: { type: Date, default: Date.now },
  completePath: String,
  path: String,
  file: String,
  size: Number,
  jsonData: String,
});
