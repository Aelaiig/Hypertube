/* eslint no-underscore-dangle: 0 */
const FilmModel = require('../models/film');

module.exports = {
  putFilm: async (document) => {
    const jsonData = JSON.stringify(document.jsonData);
    try {
      const film = new FilmModel({
        filmId: document.filmId,
        hash: document.hash,
        completePath: document.fileInfo.completePath,
        path: document.fileInfo.path,
        file: document.fileInfo.fileName,
        size: document.fileInfo.size,
        jsonData,
      });
      film.save();
    } catch (err) {
      throw (err);
    }
  },
  checkHashAndUpdate: hash => FilmModel.findOneAndUpdate({ hash }, { lastSeen: Date.now() }),
  getAllbyId: id => FilmModel.find({ filmId: id }),
};
