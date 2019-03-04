/* eslint no-underscore-dangle: 0 */
const debugTranscode = require('debug')('player:transcode');
const ffmpeg = require('fluent-ffmpeg');
const pump = require('pump');
const fs = require('fs');

const express = require('express');
const videoSettings = require('../videoSettings.json');

const router = express.Router();

router.get('/raw', (req, res) => {
  // Source: https://medium.com/@daspinola/video-stream-with-node-js-and-html5-320b3191a6b6
  const { range } = req.headers;
  let file;
  let fileSize;
  if (req.document.state === 'downloading') {
    ({ file } = req.document);
    if (file === undefined) return;
    fileSize = file.length;
  } else {
    file = req.document.fileInfo.completePath;
    const stat = fs.statSync(file);
    fileSize = stat.size;
  }
  let readableStream;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    if (req.document.state === 'downloading') readableStream = file.createReadStream({ start, end });
    else readableStream = fs.createReadStream(file, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'application/octet-stream',
    };
    res.writeHead(206, head);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'application/octet-stream',
    };
    res.writeHead(200, head);
    // readableStream = file.createReadStream();
    if (req.document.state === 'downloading') readableStream = file.createReadStream();
    else readableStream = fs.createReadStream(file);
  }
  // readableStream.pipe(res);
  pump(readableStream, res);
});

router.get('/:quality.webm', (req, res) => {
  let seek = false;
  const { quality } = req.params;
  const params = videoSettings[quality];

  if (!params) {
    return res.status(404).send('Wrong player quality');
  }
  if (typeof req.query.seek !== 'undefined' && req.query.seek != null) {
    seek = parseFloat(req.query.seek);
  }
  try {
    res.contentType('webm');
    const command = ffmpeg(`http://localhost:${process.env.PORT}/video/${req.document.hash}/raw`)
      .format('webm')
      .size(params.video.size)
      .videoCodec(params.video.codec)
      .videoBitrate(params.video.bitrate)
      .audioCodec(params.audio.codec)
      .audioBitrate(params.audio.bitrate)
      .audioChannels(2)
      .on('end', () => { debugTranscode('The End'); })
      .outputOptions([
        '-deadline realtime',
        '-error-resilient 1',
      ])
      .on('error', (err, stdout, stderr) => {
        if (err.message !== 'Output stream closed') {
          debugTranscode(`Error: ${err.message}`);
          debugTranscode(`stdout: ${stdout}`);
          debugTranscode(`stderr: ${stderr}`);
        } else {
          debugTranscode('Client closed');
        }
        command.kill();
      });
    if (seek) {
      // debugTranscode(`Seek: ${seek}`);
      command.seekInput(seek);
    }
    return pump(command, res);
  } catch (err) {
    return res.status(500).send(`Error: ${err.toString()}`);
  }
});

const progressbar = (buffer) => {
  const progress = [];
  let counter = 0;
  let downloaded = true;

  for (let i = 0; i < buffer.length; i += 1) {
    const p = buffer[i];
    if ((downloaded && p > 0) || (!downloaded && p === 0)) counter += 1;
    else {
      progress.push(counter);
      counter = 1;
      downloaded = !downloaded;
    }
  }
  progress.push(counter);
  return (progress);
};

router.get('/meta.json', (req, res) => {
  const { engine, jsonData, file } = req.document;
  if (req.document.state === 'error') {
    return res.send({
      err: req.document.error,
    });
  }
  if (!jsonData) {
    return res.send({});
  }
  if (req.document.state === 'downloading') {
    const progress = progressbar(engine.bitfield.buffer);
    if (progress.length !== 2) {
      if (progress[0] === 0) {
        progress.shift();
        progress.shift();
      }
      if (!(progress.length % 2) && progress.length > 2) {
        progress.pop();
      }
    }
    let fileLength = 0;
    progress.forEach((el) => {
      fileLength += el;
    });
    if (progress.length === 1) {
      jsonData.progressBar = { progress, fileLength: progress[0] };
    } else {
      jsonData.progressBar = { progress, fileLength };
    }
    jsonData.torrentEngine = {
      speed: {
        download: engine.swarm.downloadSpeed(),
        upload: engine.swarm.uploadSpeed(),
      },
      peers: {
        total: engine.swarm.wires.length,
        unchocked: engine.swarm.wires.reduce((prev, wire) => prev + !wire.peerChoking, 0),
      },
    };
    if (file) jsonData.fileLength = file.length;
  }
  jsonData.state = req.document.state;
  return res.send(jsonData);
});


module.exports = router;
