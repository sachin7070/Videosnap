const rateLimit = require('express-rate-limit');

function createRateLimiter(options = {}) {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: options.message || 'Too many requests. Please try again later.',
    },
    skip: (req) => {
      // Skip rate limit for health checks
      return req.path === '/health';
    },
  });
}

module.exports = { createRateLimiter };
