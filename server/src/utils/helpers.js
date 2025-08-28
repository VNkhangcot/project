const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const moment = require('moment');

/**
 * Hash password using bcrypt
 * @param {String} password - Plain text password
 * @returns {String} Hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 * @param {String} password - Plain text password
 * @param {String} hash - Hashed password
 * @returns {Boolean} Match result
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate random string
 * @param {Number} length - String length
 * @returns {String} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate random number
 * @param {Number} min - Minimum value
 * @param {Number} max - Maximum value
 * @returns {Number} Random number
 */
const generateRandomNumber = (min = 1000, max = 9999) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate unique code with prefix
 * @param {String} prefix - Code prefix
 * @param {Number} length - Number length
 * @returns {String} Unique code
 */
const generateUniqueCode = (prefix = 'ENT', length = 6) => {
  const timestamp = Date.now().toString().slice(-4);
  const random = generateRandomNumber(10, 99);
  const padding = '0'.repeat(Math.max(0, length - timestamp.length - random.toString().length));
  return `${prefix}${padding}${timestamp}${random}`;
};

/**
 * Sanitize string for database
 * @param {String} str - Input string
 * @returns {String} Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate email format
 * @param {String} email - Email address
 * @returns {Boolean} Valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Vietnamese format)
 * @param {String} phone - Phone number
 * @returns {Boolean} Valid phone
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format currency (Vietnamese Dong)
 * @param {Number} amount - Amount to format
 * @returns {String} Formatted currency
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format date to Vietnamese format
 * @param {Date|String} date - Date to format
 * @param {String} format - Date format
 * @returns {String} Formatted date
 */
const formatDate = (date, format = 'DD/MM/YYYY') => {
  return moment(date).format(format);
};

/**
 * Calculate age from date of birth
 * @param {Date|String} dateOfBirth - Date of birth
 * @returns {Number} Age in years
 */
const calculateAge = (dateOfBirth) => {
  return moment().diff(moment(dateOfBirth), 'years');
};

/**
 * Get date range for period
 * @param {String} period - Period type (today, week, month, year)
 * @returns {Object} Start and end dates
 */
const getDateRange = (period) => {
  const now = moment();
  let startDate, endDate;

  switch (period) {
    case 'today':
      startDate = now.clone().startOf('day');
      endDate = now.clone().endOf('day');
      break;
    case 'week':
      startDate = now.clone().startOf('week');
      endDate = now.clone().endOf('week');
      break;
    case 'month':
      startDate = now.clone().startOf('month');
      endDate = now.clone().endOf('month');
      break;
    case 'year':
      startDate = now.clone().startOf('year');
      endDate = now.clone().endOf('year');
      break;
    case 'last7days':
      startDate = now.clone().subtract(7, 'days').startOf('day');
      endDate = now.clone().endOf('day');
      break;
    case 'last30days':
      startDate = now.clone().subtract(30, 'days').startOf('day');
      endDate = now.clone().endOf('day');
      break;
    default:
      startDate = now.clone().startOf('month');
      endDate = now.clone().endOf('month');
  }

  return {
    startDate: startDate.toDate(),
    endDate: endDate.toDate()
  };
};

/**
 * Paginate query results
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Object} Pagination options
 */
const getPaginationOptions = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip
  };
};

/**
 * Build MongoDB sort object
 * @param {String} sortBy - Field to sort by
 * @param {String} sortOrder - Sort order (asc, desc)
 * @returns {Object} Sort object
 */
const buildSortObject = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const order = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
  return { [sortBy]: order };
};

/**
 * Build MongoDB filter object
 * @param {Object} filters - Filter parameters
 * @returns {Object} MongoDB filter object
 */
const buildFilterObject = (filters = {}) => {
  const filter = {};

  // Text search
  if (filters.search) {
    filter.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } },
      { code: { $regex: filters.search, $options: 'i' } }
    ];
  }

  // Status filter
  if (filters.status) {
    filter.status = filters.status;
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    filter.createdAt = {};
    if (filters.startDate) {
      filter.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      filter.createdAt.$lte = new Date(filters.endDate);
    }
  }

  return filter;
};

/**
 * Remove sensitive fields from object
 * @param {Object} obj - Object to clean
 * @param {Array} fields - Fields to remove
 * @returns {Object} Cleaned object
 */
const removeSensitiveFields = (obj, fields = ['password', '__v']) => {
  const cleaned = { ...obj };
  fields.forEach(field => {
    delete cleaned[field];
  });
  return cleaned;
};

/**
 * Convert string to slug
 * @param {String} str - String to convert
 * @returns {String} Slug
 */
const createSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {Boolean} Is empty
 */
const isEmpty = (obj) => {
  return obj === null || obj === undefined || 
         (typeof obj === 'object' && Object.keys(obj).length === 0) ||
         (typeof obj === 'string' && obj.trim().length === 0);
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Generate file name with timestamp
 * @param {String} originalName - Original file name
 * @returns {String} New file name
 */
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const random = generateRandomString(8);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${random}.${extension}`;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomString,
  generateRandomNumber,
  generateUniqueCode,
  sanitizeString,
  isValidEmail,
  isValidPhone,
  formatCurrency,
  formatDate,
  calculateAge,
  getDateRange,
  getPaginationOptions,
  buildSortObject,
  buildFilterObject,
  removeSensitiveFields,
  createSlug,
  isEmpty,
  deepClone,
  generateFileName
};
