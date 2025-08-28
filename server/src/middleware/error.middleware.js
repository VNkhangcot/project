const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.message}`, {
    error: err,
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    },
    user: req.user ? req.user.email : 'Anonymous'
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return sendError(res, message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field} '${value}' already exists`;
    return sendError(res, message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message,
      value: val.value
    }));
    return sendError(res, 'Validation failed', 400, errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', 401);
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, 'File too large', 400);
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return sendError(res, 'Too many files', 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return sendError(res, 'Unexpected file field', 400);
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError') {
    return sendError(res, 'Database connection failed', 503);
  }

  if (err.name === 'MongoTimeoutError') {
    return sendError(res, 'Database operation timeout', 503);
  }

  // Rate limiting errors
  if (err.status === 429) {
    return sendError(res, 'Too many requests', 429);
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    return sendError(res, 'CORS policy violation', 403);
  }

  // Syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 'Invalid JSON format', 400);
  }

  // Custom application errors
  if (err.isOperational) {
    return sendError(res, err.message, err.statusCode || 500);
  }

  // Default error
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  const statusCode = err.statusCode || err.status || 500;
  
  return sendError(res, message, statusCode);
};

/**
 * Handle async errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom error class
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err);
  console.log('Shutting down the server due to Unhandled Promise rejection');
  process.exit(1);
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

module.exports = {
  errorHandler,
  asyncHandler,
  AppError
};
