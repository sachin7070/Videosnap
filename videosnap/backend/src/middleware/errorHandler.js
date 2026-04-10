const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Don't expose internal errors to client in production
  const clientMessage = process.env.NODE_ENV === 'production' && status === 500
    ? 'An internal error occurred. Please try again.'
    : message;

  if (!res.headersSent) {
    res.status(status).json({ error: clientMessage });
  }
}

module.exports = { errorHandler };
