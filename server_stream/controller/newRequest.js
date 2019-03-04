/* eslint no-underscore-dangle: 0 */

const validator = require('validator');
const fetch = require('node-fetch');
const parseTorrent = require('parse-torrent');
const { commonEmitter } = require('../events');
const cacheFilms = require('./cacheFilms');
const dbManager = require('./dbManager');

module.exports = async (req, res) => {
  const filmInput = {};
  const Film = {};
  filmInput.torrent = req.body.torrent;
  filmInput.filmId = req.body.filmId;
  try {
    if (!filmInput.torrent || validator.isEmpty(filmInput.torrent)
    || !(validator.isURL(filmInput.torrent) || validator.isMagnetURI(filmInput.torrent))) {
      throw new Error('Torrent URL or Magnet not valid or missing');
    }
    if (!filmInput.filmId || validator.isEmpty(filmInput.filmId)
    || !validator.isNumeric(filmInput.filmId)) {
      throw new Error('Film ID not valid or missing');
    }
    if (validator.isURL(filmInput.torrent)) {
      const test = await fetch(filmInput.torrent);
      filmInput.torrent = (await test.buffer());
    }
  } catch (err) {
    return res.status(400).send({ err: err.message });
  }
  Film.torrent = filmInput.torrent;
  Film.filmId = filmInput.filmId;
  Film.hash = parseTorrent(Film.torrent).infoHash;
  Film.name = req.body.name;
  Film.year = req.body.year;
  const test = cacheFilms.list.filter(e => e.hash.toString() === Film.hash)[0];
  try {
    const testElem = await dbManager.checkHashAndUpdate(Film.hash);
    if (testElem) {
      const alreadyExistingFilm = {};
      alreadyExistingFilm.torrent = testElem.torrent;
      alreadyExistingFilm.filmId = testElem.filmId;
      alreadyExistingFilm.hash = testElem.hash;
      alreadyExistingFilm.state = 'downloaded';
      alreadyExistingFilm.fileInfo = {
        completePath: testElem.completePath,
        path: testElem.path,
      };
      alreadyExistingFilm.jsonData = JSON.parse(testElem.jsonData);
      alreadyExistingFilm.lastUpdate = Date.now();
      res.send(alreadyExistingFilm.hash);
      return commonEmitter.emit('newrequestdb', alreadyExistingFilm);
    }
  } catch (err) {
    console.log(err);
  }

  if (!test) {
    res.send(Film.hash);
    return commonEmitter.emit('newrequest', Film);
  }
  return res.send(test.hash);
};
