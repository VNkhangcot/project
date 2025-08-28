const { sendNotFound } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  
  logger.warn(`404 - ${message}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    user: req.user ? req.user.email : 'Anonymous'
  });

  return sendNotFound(res, message);
};

module.exports = notFound;
