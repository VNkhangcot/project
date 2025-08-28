const Joi = require('joi');
const { sendValidationError, formatValidationErrors } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Validate request data using Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, params, query)
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errors = formatValidationErrors(error);
      logger.warn(`Validation failed for ${property}:`, errors);
      return sendValidationError(res, errors, `Invalid ${property} data`);
    }

    // Replace request data with validated and sanitized data
    req[property] = value;
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // MongoDB ObjectId validation
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),

  // Email validation
  email: Joi.string().email().lowercase().trim(),

  // Password validation
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain at least 8 characters with uppercase, lowercase, number and special character'),

  // Phone number validation (Vietnamese format)
  phone: Joi.string()
    .pattern(/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/)
    .message('Invalid Vietnamese phone number format'),

  // Date validation
  date: Joi.date().iso(),

  // Pagination validation
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  },

  // Sort validation
  sort: {
    sortBy: Joi.string().default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }
};

/**
 * Authentication validation schemas
 */
const authSchemas = {
  login: Joi.object({
    email: schemas.email.required(),
    password: Joi.string().required(),
    rememberMe: Joi.boolean().default(false)
  }),

  register: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: schemas.email.required(),
    password: schemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({ 'any.only': 'Passwords do not match' }),
    role: schemas.objectId.optional()
  }),

  forgotPassword: Joi.object({
    email: schemas.email.required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: schemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({ 'any.only': 'Passwords do not match' })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: schemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({ 'any.only': 'Passwords do not match' })
  }),

  updateProfile: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    phone: schemas.phone,
    avatar: Joi.string().uri(),
    preferences: Joi.object({
      language: Joi.string().valid('vi', 'en').default('vi'),
      theme: Joi.string().valid('light', 'dark', 'system').default('light'),
      notifications: Joi.object({
        email: Joi.boolean().default(true),
        push: Joi.boolean().default(true),
        sms: Joi.boolean().default(false)
      })
    })
  })
};

/**
 * Enterprise validation schemas
 */
const enterpriseSchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(2).max(200).required(),
    code: Joi.string().trim().min(2).max(50).required(),
    businessType: Joi.string().required(),
    taxCode: Joi.string().trim().min(10).max(20).required(),
    address: Joi.string().trim().min(10).max(500).required(),
    phone: schemas.phone.required(),
    email: schemas.email.required(),
    website: Joi.string().uri().optional(),
    contactPerson: Joi.object({
      name: Joi.string().trim().min(2).max(100).required(),
      position: Joi.string().trim().min(2).max(100).required(),
      phone: schemas.phone.required(),
      email: schemas.email.required()
    }).required()
  }),

  update: Joi.object({
    name: Joi.string().trim().min(2).max(200),
    businessType: Joi.string(),
    taxCode: Joi.string().trim().min(10).max(20),
    address: Joi.string().trim().min(10).max(500),
    phone: schemas.phone,
    email: schemas.email,
    website: Joi.string().uri().allow(''),
    contactPerson: Joi.object({
      name: Joi.string().trim().min(2).max(100),
      position: Joi.string().trim().min(2).max(100),
      phone: schemas.phone,
      email: schemas.email
    }),
    status: Joi.string().valid('active', 'inactive', 'pending', 'suspended')
  }),

  query: Joi.object({
    ...schemas.pagination,
    ...schemas.sort,
    search: Joi.string().trim().max(100),
    status: Joi.string().valid('active', 'inactive', 'pending', 'suspended'),
    businessType: Joi.string()
  })
};

/**
 * Employee validation schemas
 */
const employeeSchemas = {
  create: Joi.object({
    employeeId: Joi.string().trim().min(3).max(20).required(),
    personalInfo: Joi.object({
      name: Joi.string().trim().min(2).max(100).required(),
      email: schemas.email.required(),
      phone: schemas.phone.required(),
      address: Joi.string().trim().min(10).max(500).required(),
      dateOfBirth: schemas.date.required(),
      idNumber: Joi.string().trim().min(9).max(20).required()
    }).required(),
    workInfo: Joi.object({
      position: Joi.string().trim().min(2).max(100).required(),
      department: schemas.objectId.required(),
      startDate: schemas.date.required(),
      salary: Joi.number().positive().required(),
      contractType: Joi.string().valid('full-time', 'part-time', 'contract', 'intern').required(),
      status: Joi.string().valid('active', 'inactive', 'terminated').default('active')
    }).required(),
    enterprise: schemas.objectId.required()
  }),

  update: Joi.object({
    personalInfo: Joi.object({
      name: Joi.string().trim().min(2).max(100),
      email: schemas.email,
      phone: schemas.phone,
      address: Joi.string().trim().min(10).max(500),
      dateOfBirth: schemas.date,
      idNumber: Joi.string().trim().min(9).max(20)
    }),
    workInfo: Joi.object({
      position: Joi.string().trim().min(2).max(100),
      department: schemas.objectId,
      salary: Joi.number().positive(),
      contractType: Joi.string().valid('full-time', 'part-time', 'contract', 'intern'),
      status: Joi.string().valid('active', 'inactive', 'terminated')
    })
  })
};

/**
 * Department validation schemas
 */
const departmentSchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().max(500),
    manager: schemas.objectId,
    budget: Joi.number().positive(),
    enterprise: schemas.objectId.required()
  }),

  update: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    description: Joi.string().trim().max(500),
    manager: schemas.objectId,
    budget: Joi.number().positive(),
    status: Joi.string().valid('active', 'inactive')
  })
};

/**
 * Financial transaction validation schemas
 */
const transactionSchemas = {
  create: Joi.object({
    type: Joi.string().valid('income', 'expense').required(),
    category: Joi.string().trim().min(2).max(100).required(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().valid('VND', 'USD', 'EUR').default('VND'),
    description: Joi.string().trim().max(500).required(),
    date: schemas.date.required(),
    enterprise: schemas.objectId.required(),
    employee: schemas.objectId,
    invoice: schemas.objectId
  }),

  update: Joi.object({
    type: Joi.string().valid('income', 'expense'),
    category: Joi.string().trim().min(2).max(100),
    amount: Joi.number().positive(),
    currency: Joi.string().valid('VND', 'USD', 'EUR'),
    description: Joi.string().trim().max(500),
    date: schemas.date,
    status: Joi.string().valid('pending', 'approved', 'rejected')
  })
};

/**
 * Query parameter validation
 */
const querySchemas = {
  list: Joi.object({
    ...schemas.pagination,
    ...schemas.sort,
    search: Joi.string().trim().max(100),
    status: Joi.string(),
    startDate: schemas.date,
    endDate: schemas.date
  }),

  params: Joi.object({
    id: schemas.objectId.required()
  })
};

/**
 * Middleware factory functions
 */
const validateAuth = (schemaName) => validate(authSchemas[schemaName]);
const validateEnterprise = (schemaName) => validate(enterpriseSchemas[schemaName]);
const validateEmployee = (schemaName) => validate(employeeSchemas[schemaName]);
const validateDepartment = (schemaName) => validate(departmentSchemas[schemaName]);
const validateTransaction = (schemaName) => validate(transactionSchemas[schemaName]);
const validateQuery = (schemaName = 'list') => validate(querySchemas[schemaName], 'query');
const validateParams = () => validate(querySchemas.params, 'params');

module.exports = {
  validate,
  schemas,
  authSchemas,
  enterpriseSchemas,
  employeeSchemas,
  departmentSchemas,
  transactionSchemas,
  querySchemas,
  validateAuth,
  validateEnterprise,
  validateEmployee,
  validateDepartment,
  validateTransaction,
  validateQuery,
  validateParams
};
