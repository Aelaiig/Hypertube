// https://stackoverflow.com/a/37155794
const events = require('events');

const em = new events.EventEmitter();
module.exports.commonEmitter = em;
