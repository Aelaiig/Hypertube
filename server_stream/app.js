/* eslint no-underscore-dangle: 0 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const rimraf = require('rimraf');

console.log('VERSION 1.0');

mongoose.connect('mongodb://database:27017/Hypertube24', { useNewUrlParser: true }).then(() => {
  console.log('Server-stream connected to Database');
}).catch((err) => {
  console.log('Server-stream not Connected to Database ERROR!', err);
});
console.error = () => null;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', (callback) => {
  console.log('Server-stream connection Succeeded');
});

const app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const newRequest = require('./controller/newRequest');
const newRequestHash = require('./controller/newRequestHash');
const torrentController = require('./controller/torrentController');
const cacheFilms = require('./controller/cacheFilms');
const getSources = require('./controller/getSources');
const FilmModel = require('./models/film');


app.post('/request', newRequest);
app.post('/requesthash', newRequestHash);
app.use('/video', torrentController);
app.get('/sources/:id', getSources);

app.get('/test', (req, res) => {
  cacheFilms.list.forEach((el) => {
    console.log(el.hash);
    // console.log(el.lastUpdate);
    console.log(el.filmId);
    console.log(el.state);
    console.log('-----------------------');
  });
  res.send('Yeah');
});

async function deleteAfter30Days() {
  const dayToDelete = new Date();
  dayToDelete.setDate(dayToDelete.getDate() - 30);
  console.log(`Deleting films - After: ${dayToDelete}`);
  const test = await FilmModel.find({ lastSeen: { $lte: dayToDelete } });
  for (let i = 0; i < test.length; i += 1) {
    console.log(test[i].filmId);
    rimraf(`${process.env.STORAGE}/${test[i].filmId}`, (err) => {
      if (err) throw Error('Error deleting');
      else console.log(`Deleting ${test[i].filmId} from disk`);
    });
    console.log(`Successfuly deleted ${process.env.STORAGE}/${test[i].filmId}`);
    FilmModel.deleteOne({ filmId: test[i].filmId }, (err) => {
      if (err) console.log(`Error deleting ${test[i].filmId}`);
      else console.log(`Deleting ${test[i].filmId} from DB`);
    });
  }
}

function interval() {
  const stayInCache = 14400000; // 4Hours
  const timeNow = Date.now();
  const newCache = cacheFilms.list.filter((value) => {
    const timeDifference = timeNow - value.lastUpdate;
    // console.log(`td:${timeDifference}|${timeDifference < stayInCache}`);
    if (value.state === 'downloading') return true;
    return timeDifference < stayInCache;
  });
  cacheFilms.list = newCache;
  deleteAfter30Days();
}

setInterval(interval, 100000); //300000


module.exports = app;
