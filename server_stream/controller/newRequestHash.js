const debugManager = require('debug')('player:manager');
const { commonEmitter } = require('../events');
const dbManager = require('./dbManager');
const cacheFilms = require('./cacheFilms');

module.exports = async (req, res) => {
  const { hash } = req.body;
  let film = {};
  try {
    const filmCache = cacheFilms.list.find(el => el.hash === hash);
    if (filmCache) return res.send(hash);
    const filmDb = await dbManager.checkHashAndUpdate(hash);
    if (!filmDb) {
      return res.send({ err: 'No film with this hash. Please start the video again' });
    }
    film = {
      filmId: filmDb.filmId,
      hash: filmDb.hash,
      state: 'downloaded',
      fileInfo: {
        completePath: filmDb.completePath,
        path: filmDb.path,
      },
      lastUpdate: Date.now(),
      jsonData: JSON.parse(filmDb.jsonData),
    };
  } catch (err) {
    debugManager('Problem getting data from DDB');
    debugManager(err);
    return res.send({ err: 'There was a problem with server, please contact an admin' });
  }
  res.send(hash);
  return commonEmitter.emit('newrequestdb', film);
};
