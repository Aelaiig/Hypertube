/* eslint no-underscore-dangle: 0 */
const debugTorrent = require('debug')('player:torrent');
const debugManager = require('debug')('player:manager');
const fs = require('fs');
const util = require('util');
const express = require('express');
const rimraf = require('rimraf');
const nameToImdb = require('./nameToImdb');
const { commonEmitter } = require('../events');
const torrentEngine = require('./torrentEngine');
const videoController = require('./videoController');
const dbManager = require('./dbManager');

const router = express.Router();
const cacheFilms = require('./cacheFilms');

const copyFile = util.promisify(fs.copyFile);
const mkdir = util.promisify(fs.mkdir);


commonEmitter.on('newrequest', (document) => {
  debugManager(`New request: ${document.filmId}`);
  const newDocument = document;
  const engine = torrentEngine.createNewEngine(document.torrent);


  engine.on('ready', async () => {
    const biggestFileIndex = ((eng) => {
      const max = eng.files.reduce((prev, cur) => ((prev.length > cur.length) ? prev : cur));
      // TODO2: Faire la difference entre films et Series
      return eng.files.indexOf(max);
    })(engine);
    (engine.files).forEach((el, i) => {
      if (i === biggestFileIndex) {
        el.select();
        debugTorrent(`File chosen: ${el.name} | ${el.length}`);
      } else el.deselect();
    });
    newDocument.file = engine.files[biggestFileIndex];
    newDocument.state = 'downloading';
    newDocument.fileInfo = {
      completePath: `${engine.path}/${newDocument.file.path}`,
      path: `${engine.path}/${newDocument.engine.torrent.name}`,
      fileName: newDocument.file.name,
    };
    try {
      const jsonData = await torrentEngine.ffmpegProbe(document.hash, newDocument.file);
      newDocument.fileInfo.size = jsonData.video.fileSize;
      newDocument.jsonData = jsonData;
    } catch (err) {
      debugManager(err);
      newDocument.state = 'error';
      newDocument.error = 'Problem with ffprobe, maybe the file is corrupted. Please try another source.';
      engine.destroy(() => {
        delete newDocument.engine;
        delete newDocument.file;
        debugManager('Engine destroyed');
      });
    }
    try {
      newDocument.jsonData.imdbid = await nameToImdb(newDocument.name, newDocument.year);
    } catch (err) {
      debugManager('Error while getting IMDB info. Continue');
      debugManager(err);
    }
  });


  engine.once('idle', async () => {
    try {
      debugTorrent(`Finish Downloading ${newDocument.fileInfo.fileName}`);
      debugManager('Create folder');
      await mkdir(`${process.env.STORAGE}/${newDocument.filmId}/${newDocument.hash}`, { recursive: true });
      debugManager('Start copying');
      await copyFile(newDocument.fileInfo.completePath, `${process.env.STORAGE}/${newDocument.filmId}/${newDocument.hash}/${newDocument.fileInfo.fileName}`);
      newDocument.torrentActive = false;
      debugManager('Finish copying');
      newDocument.lastUpdate = Date.now();
      rimraf(`${process.env.TEMPPATH}/torrent-stream/${newDocument.hash}`, (err) => {
        if (err) throw Error('Error deleting');
      });
    } catch (err) {
      debugManager('Error copying');
      return debugManager(err);
    }
    try {
      engine.destroy(async () => {
        delete newDocument.engine;
        delete newDocument.file;
        delete newDocument.jsonData.torrentEngine;
        delete newDocument.jsonData.progressBar;
        delete newDocument.torrent;
        newDocument.state = 'downloaded';
        newDocument.fileInfo.completePath = `${process.env.STORAGE}/${newDocument.filmId}/${newDocument.hash}/${newDocument.fileInfo.fileName}`;
        newDocument.fileInfo.path = `${process.env.STORAGE}/${newDocument.filmId}/${newDocument.hash}`;
        debugManager('Engine destroyed');
        try {
          await dbManager.putFilm(newDocument);
          debugManager(`Done putting film in DB: ${newDocument.hash}`);
        } catch (err) {
          console.log('Error putting film in DB');
          console.log(err);
        }
      });
    } catch (err) {
      debugManager('Error destroying engine');
    }
    return true;
  });
  newDocument.lastUpdate = Date.now();
  newDocument.state = 'starting';
  newDocument.engine = engine;
  newDocument.torrentActive = true;
  cacheFilms.list.push(newDocument);
});

commonEmitter.on('newrequestdb', (document) => {
  debugManager(`New request (already in DB): ${document.filmId}`);
  cacheFilms.list.push(document);
});

router.use('/:id', (req, res, next) => {
  const document = cacheFilms.list.filter(e => e.hash.toString() === req.params.id);
  if (!document[0]) {
    debugManager('ID invalid or too old');
    return res.send({ err: 'ID invalid or too old' });
  }
  if (document[0].state !== 'error') document[0].lastUpdate = Date.now();
  [req.document] = document;
  return next();
}, videoController);

module.exports = router;
