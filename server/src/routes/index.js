const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const hrRoutes = require('./hr.routes');
const financeRoutes = require('./finance.routes');
const inventoryRoutes = require('./inventory.routes');
const salesRoutes = require('./sales.routes');
const reportsRoutes = require('./reports.routes');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Success:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         message:
 *           type: string
 *           example: "An error occurred"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *               value:
 *                 type: string
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         email:
 *           type: string
 *           example: "user@example.com"
 *         role:
 *           $ref: '#/components/schemas/Role'
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *           example: "active"
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         emailVerified:
 *           type: boolean
 *           example: true
 *         preferences:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *               example: "vi"
 *             theme:
 *               type: string
 *               example: "light"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Role:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "admin"
 *         displayName:
 *           type: string
 *           example: "Administrator"
 *         description:
 *           type: string
 *           example: "System administrator role"
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["read", "write", "delete"]
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Enterprise:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "ABC Company Ltd"
 *         code:
 *           type: string
 *           example: "ABC001"
 *         businessType:
 *           type: string
 *           example: "Technology"
 *         taxCode:
 *           type: string
 *           example: "0123456789"
 *         status:
 *           type: string
 *           enum: [active, inactive, pending, suspended]
 *           example: "active"
 *         subscriptionPlan:
 *           type: string
 *           enum: [basic, premium, enterprise]
 *           example: "premium"
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.API_VERSION || '1.0.0'
  });
});

// API version info
router.get('/version', (req, res) => {
  res.json({
    status: 'success',
    data: {
      version: process.env.API_VERSION || '1.0.0',
      name: 'Enterprise Management API',
      description: 'API server for enterprise management system',
      author: 'Development Team',
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/hr', hrRoutes);
router.use('/finance', financeRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/sales', salesRoutes);
router.use('/reports', reportsRoutes);

module.exports = router;
