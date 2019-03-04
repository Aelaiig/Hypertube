const debugTranscode = require('debug')('player:transcode');
const torrentStream = require('torrent-stream');
const ffmpeg = require('fluent-ffmpeg');
const mime = require('mime-types');
const videoSettings = require('../videoSettings.json');

const CONFIG = {};
CONFIG.serverAddress = `${process.env.SERVERADDRESS}:${process.env.PORT}/`;
CONFIG.tempPath = process.env.TEMPPATH;


module.exports = {
  createNewEngine: (source) => {
    // TODO: Faire la difference entre le magnet et le .torrent
    const engine = torrentStream(source, {
      tmp: CONFIG.tempPath,
    });
    return engine;
  },
  // FIXME: Probleme si ffprobe prend plus longtemps que le telechargement du fichier
  ffmpegProbe: (documentId, file) => new Promise((resolve, reject) => {
    const jsonData = {};
    debugTranscode(`Starting ffprobe: ${file.name}`);
    ffmpeg(`${CONFIG.serverAddress}video/${documentId}/raw`).ffprobe(0, (err, data) => {
      if (err) {
        return reject(err.toString());
      }
      jsonData.video = {};
      jsonData.video.title = file.name;
      jsonData.video.duration = data.format.duration;
      jsonData.video.format = mime.lookup(file.name);
      jsonData.video.fileSize = data.format.size;
      jsonData.video.sources = [];
      Object.keys(videoSettings).forEach((el) => {
        (jsonData.video.sources).push({ type: 'video/webm', src: `${CONFIG.serverAddress}video/${documentId}/${el}.webm`, label: el });
      });
      if (jsonData.video.format === 'video/mp4' || jsonData.video.format === 'video/webm') (jsonData.video.sources).push({ type: jsonData.video.format, src: `${CONFIG.serverAddress}video/${documentId}/raw`, label: 'Original' });
      debugTranscode(`Metadata fetched: ${file.name}`);
      return resolve(jsonData);
    });
  }),
};
