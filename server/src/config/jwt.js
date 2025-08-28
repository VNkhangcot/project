const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

/**
 * Generate access token
 * @param {Object} payload - Token payload
 * @returns {String} JWT token
 */
const generateAccessToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
      issuer: 'enterprise-management-api',
      audience: 'enterprise-management-client'
    });
  } catch (error) {
    logger.error('Error generating access token:', error);
    throw new Error('Token generation failed');
  }
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRE,
      issuer: 'enterprise-management-api',
      audience: 'enterprise-management-client'
    });
  } catch (error) {
    logger.error('Error generating refresh token:', error);
    throw new Error('Refresh token generation failed');
  }
};

/**
 * Verify access token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'enterprise-management-api',
      audience: 'enterprise-management-client'
    });
  } catch (error) {
    logger.error('Error verifying access token:', error);
    throw new Error('Invalid or expired token');
  }
};

/**
 * Verify refresh token
 * @param {String} token - JWT refresh token
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'enterprise-management-api',
      audience: 'enterprise-management-client'
    });
  } catch (error) {
    logger.error('Error verifying refresh token:', error);
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} payload - Token payload
 * @returns {Object} Token pair
 */
const generateTokenPair = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRE
  };
};

/**
 * Decode token without verification (for debugging)
 * @param {String} token - JWT token
 * @returns {Object} Decoded token
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    logger.error('Error decoding token:', error);
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  decodeToken,
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRE
};
