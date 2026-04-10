const NodeCache = require('node-cache');

// Cache metadata for 10 minutes to reduce repeated yt-dlp calls
const metaCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

function getCached(key) {
  return metaCache.get(key);
}

function setCache(key, value) {
  metaCache.set(key, value);
}

function deleteCache(key) {
  metaCache.del(key);
}

module.exports = { getCached, setCache, deleteCache };
