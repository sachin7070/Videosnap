const { validationResult } = require('express-validator');
const { detectPlatform } = require('../utils/platformDetector');
const { analyzeYouTube } = require('../services/youtubeService');
const { analyzeInstagram, analyzeFacebook, analyzeTwitter } = require('../services/genericService');
const { getCached, setCache } = require('../utils/cache');
const logger = require('../utils/logger');

async function analyzeVideo(req, res, next) {
  // Validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { url } = req.body;
  const platform = detectPlatform(url);

  if (platform === 'unknown') {
    return res.status(400).json({
      error: 'Unsupported platform. We support YouTube, Instagram, Facebook, and X/Twitter.',
    });
  }

  // Check cache
  const cacheKey = `meta:${url}`;
  const cached = getCached(cacheKey);
  if (cached) {
    logger.info(`Cache hit for ${url}`);
    return res.json({ ...cached, cached: true });
  }

  try {
    let metadata;

    switch (platform) {
      case 'youtube':
        metadata = await analyzeYouTube(url);
        break;
      case 'instagram':
        metadata = await analyzeInstagram(url);
        break;
      case 'facebook':
        metadata = await analyzeFacebook(url);
        break;
      case 'twitter':
        metadata = await analyzeTwitter(url);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported platform.' });
    }

    // Cache result
    setCache(cacheKey, metadata);

    res.json(metadata);
  } catch (err) {
    logger.error(`Analyze error for ${url}: ${err.message}`);
    next(err);
  }
}

module.exports = { analyzeVideo };
