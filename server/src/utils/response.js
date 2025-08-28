/**
 * Standardized API response utility
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code
 * @param {Object} meta - Additional metadata
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = {}) => {
  const response = {
    status: 'success',
    message,
    ...(data && { data }),
    ...meta
  };

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 * @param {Array} errors - Validation errors array
 * @param {Object} meta - Additional metadata
 */
const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = [], meta = {}) => {
  const response = {
    status: 'error',
    message,
    ...(errors.length > 0 && { errors }),
    ...meta
  };

  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors
 * @param {String} message - Error message
 */
const sendValidationError = (res, errors = [], message = 'Validation failed') => {
  return sendError(res, message, 400, errors);
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, message, 401);
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
const sendForbidden = (res, message = 'Access forbidden') => {
  return sendError(res, message, 403);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404);
};

/**
 * Send conflict response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
const sendConflict = (res, message = 'Resource conflict') => {
  return sendError(res, message, 409);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Response data array
 * @param {Object} pagination - Pagination info
 * @param {String} message - Success message
 */
const sendPaginated = (res, data, pagination, message = 'Success') => {
  const response = {
    status: 'success',
    message,
    data,
    pagination: {
      currentPage: pagination.page,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      totalItems: pagination.total,
      itemsPerPage: pagination.limit,
      hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrevPage: pagination.page > 1
    }
  };

  return res.status(200).json(response);
};

/**
 * Send created response
 * @param {Object} res - Express response object
 * @param {Object} data - Created resource data
 * @param {String} message - Success message
 */
const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Send updated response
 * @param {Object} res - Express response object
 * @param {Object} data - Updated resource data
 * @param {String} message - Success message
 */
const sendUpdated = (res, data, message = 'Resource updated successfully') => {
  return sendSuccess(res, data, message, 200);
};

/**
 * Send deleted response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 */
const sendDeleted = (res, message = 'Resource deleted successfully') => {
  return sendSuccess(res, null, message, 200);
};

/**
 * Send no content response
 * @param {Object} res - Express response object
 */
const sendNoContent = (res) => {
  return res.status(204).send();
};

/**
 * Handle async route errors
 * @param {Function} fn - Async route handler
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Format validation errors from Joi or express-validator
 * @param {Object} error - Validation error object
 * @returns {Array} Formatted errors array
 */
const formatValidationErrors = (error) => {
  if (error.details) {
    // Joi validation errors
    return error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));
  }
  
  if (Array.isArray(error)) {
    // express-validator errors
    return error.map(err => ({
      field: err.param || err.path,
      message: err.msg,
      value: err.value
    }));
  }
  
  return [];
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendConflict,
  sendPaginated,
  sendCreated,
  sendUpdated,
  sendDeleted,
  sendNoContent,
  asyncHandler,
  formatValidationErrors
};
