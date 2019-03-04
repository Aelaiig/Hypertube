const validator = require('validator');
const dbManager = require('./dbManager');
const cacheFilms = require('./cacheFilms');

module.exports = async (req, res) => {
  const json = [];

  if (!validator.isNumeric(req.params.id)) {
    return res.send({ err: 'Problem with ID' });
  }
  const result = await dbManager.getAllbyId(req.params.id);
  result.forEach((el) => {
    const newDoc = {
      file: el.completePath.split('/').slice(-1)[0],
      hash: el.hash,
      size: el.size,
      state: 'downloaded',
    };
    json.push(newDoc);
  });
  cacheFilms.list.forEach((el) => {
    if (req.params.id === el.filmId && el.state !== 'downloaded' && el.state !== 'error') {
      let fileSize = 0;
      if (el.fileInfo) {
        if (el.fileInfo.size) fileSize = el.fileInfo.size;
        const newDoc = {
          file: el.fileInfo.fileName,
          hash: el.hash,
          state: 'downloading',
          size: fileSize,
        };
        json.push(newDoc);
      }
    }
  });
  return res.send(json);
};
