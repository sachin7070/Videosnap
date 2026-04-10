const logger = require('../utils/logger');

/**
 * Optional API key middleware.
 * If API_KEY is set in .env, require it via x-api-key header.
 */
function optionalApiKey(req, res, next) {
  const requiredKey = process.env.API_KEY;
  if (!requiredKey) return next(); // No key configured → open

  const provided = req.headers['x-api-key'];
  if (!provided || provided !== requiredKey) {
    return res.status(401).json({ error: 'Invalid or missing API key.' });
  }
  next();
}

module.exports = { optionalApiKey };
