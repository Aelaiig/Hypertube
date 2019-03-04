const nameToImdb = require('name-to-imdb');

module.exports = (name, year) => new Promise((resolve, reject) => {
  nameToImdb({
    name,
    year,
    type: 'movie',
  }, (err, res, inf) => {
    if (err) return reject(err);
    return resolve(res);
  });
});
