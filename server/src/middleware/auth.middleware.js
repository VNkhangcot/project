const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyAccessToken } = require('../config/jwt');
const { sendUnauthorized, sendForbidden, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.logAuthError('Missing or invalid token format', 'No token provided', req.ip);
      return sendUnauthorized(res, 'Access token is required');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Find user in database
    const user = await User.findById(decoded.userId)
      .populate('role', 'name permissions')
      .select('-password');

    if (!user) {
      logger.logAuthError('User not found', `User ID: ${decoded.userId}`, req.ip);
      return sendUnauthorized(res, 'User not found');
    }

    if (user.status !== 'active') {
      logger.logAuthError('Inactive user access attempt', `User: ${user.email}`, req.ip);
      return sendUnauthorized(res, 'Account is not active');
    }

    // Add user to request object
    req.user = user;
    req.userId = user._id;
    
    logger.logAuth('Token verified', user.email, req.ip);
    next();

  } catch (error) {
    logger.logAuthError('Token verification failed', error.message, req.ip);
    
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'Token has expired');
    }
    
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorized(res, 'Invalid token');
    }
    
    return sendUnauthorized(res, 'Authentication failed');
  }
};

/**
 * Check if user has required permissions
 * @param {Array|String} requiredPermissions - Required permissions
 */
const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendUnauthorized(res, 'Authentication required');
      }

      const userPermissions = req.user.role?.permissions || [];
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

      // Check if user has all required permissions
      const hasPermission = permissions.every(permission => 
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        logger.logAuthError(
          'Insufficient permissions', 
          `User: ${req.user.email}, Required: ${permissions.join(', ')}, Has: ${userPermissions.join(', ')}`, 
          req.ip
        );
        return sendForbidden(res, 'Insufficient permissions');
      }

      logger.logAuth('Permission granted', `User: ${req.user.email}, Permissions: ${permissions.join(', ')}`, req.ip);
      next();

    } catch (error) {
      logger.error('Authorization error:', error);
      return sendForbidden(res, 'Authorization failed');
    }
  };
};

/**
 * Check if user has specific role
 * @param {Array|String} requiredRoles - Required roles
 */
const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendUnauthorized(res, 'Authentication required');
      }

      const userRole = req.user.role?.name;
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      if (!roles.includes(userRole)) {
        logger.logAuthError(
          'Insufficient role', 
          `User: ${req.user.email}, Required: ${roles.join(', ')}, Has: ${userRole}`, 
          req.ip
        );
        return sendForbidden(res, 'Insufficient role privileges');
      }

      logger.logAuth('Role check passed', `User: ${req.user.email}, Role: ${userRole}`, req.ip);
      next();

    } catch (error) {
      logger.error('Role check error:', error);
      return sendForbidden(res, 'Role verification failed');
    }
  };
};

/**
 * Check if user belongs to specific enterprise
 * @param {String} enterpriseParam - Parameter name containing enterprise ID
 */
const requireEnterpriseAccess = (enterpriseParam = 'enterpriseId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendUnauthorized(res, 'Authentication required');
      }

      const enterpriseId = req.params[enterpriseParam] || req.body[enterpriseParam] || req.query[enterpriseParam];
      
      if (!enterpriseId) {
        return sendForbidden(res, 'Enterprise ID is required');
      }

      // Super admin can access all enterprises
      if (req.user.role?.name === 'super_admin') {
        return next();
      }

      // Check if user belongs to the enterprise
      const userEnterprises = req.user.enterprises || [];
      const hasAccess = userEnterprises.some(enterprise => 
        enterprise.toString() === enterpriseId.toString()
      );

      if (!hasAccess) {
        logger.logAuthError(
          'Enterprise access denied', 
          `User: ${req.user.email}, Enterprise: ${enterpriseId}`, 
          req.ip
        );
        return sendForbidden(res, 'Access to this enterprise is not allowed');
      }

      logger.logAuth('Enterprise access granted', `User: ${req.user.email}, Enterprise: ${enterpriseId}`, req.ip);
      next();

    } catch (error) {
      logger.error('Enterprise access check error:', error);
      return sendForbidden(res, 'Enterprise access verification failed');
    }
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    
    const user = await User.findById(decoded.userId)
      .populate('role', 'name permissions')
      .select('-password');

    if (user && user.status === 'active') {
      req.user = user;
      req.userId = user._id;
    }

    next();

  } catch (error) {
    // Continue without authentication on error
    next();
  }
};

/**
 * Rate limiting for authentication endpoints
 */
const authRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const userAttempts = attempts.get(key);
    
    if (now > userAttempts.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userAttempts.count >= maxAttempts) {
      logger.logAuthError('Rate limit exceeded', `IP: ${key}`, req.ip);
      return sendError(res, 'Too many authentication attempts. Please try again later.', 429);
    }

    userAttempts.count++;
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  requireRole,
  requireEnterpriseAccess,
  optionalAuth,
  authRateLimit
};
