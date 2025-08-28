const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enterprise Management API',
      version: '1.0.0',
      description: 'API Documentation cho Hệ thống Quản lý Doanh nghiệp',
      contact: {
        name: 'Enterprise Management Team',
        email: 'support@enterprise-management.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.enterprise-management.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              type: 'object'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              example: 'Nguyễn Văn A'
            },
            email: {
              type: 'string',
              example: 'user@example.com'
            },
            role: {
              type: 'string',
              example: 'admin'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              example: 'active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Enterprise: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              example: 'Công ty ABC'
            },
            code: {
              type: 'string',
              example: 'ABC001'
            },
            businessType: {
              type: 'string',
              example: 'Technology'
            },
            taxCode: {
              type: 'string',
              example: '0123456789'
            },
            address: {
              type: 'string',
              example: '123 Đường ABC, Quận 1, TP.HCM'
            },
            phone: {
              type: 'string',
              example: '0901234567'
            },
            email: {
              type: 'string',
              example: 'contact@abc.com'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'pending', 'suspended'],
              example: 'active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Xác thực và phân quyền'
      },
      {
        name: 'Dashboard',
        description: 'Thống kê tổng quan'
      },
      {
        name: 'HR Management',
        description: 'Quản lý nhân sự'
      },
      {
        name: 'Finance Management',
        description: 'Quản lý tài chính'
      },
      {
        name: 'Inventory Management',
        description: 'Quản lý kho hàng'
      },
      {
        name: 'Sales Management',
        description: 'Quản lý bán hàng'
      },
      {
        name: 'Reports',
        description: 'Báo cáo'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
