const express = require('express');
const router = express.Router();

// Import controllers
const dashboardController = require('../controllers/dashboard.controller');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateQuery } = require('../middleware/validation.middleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistics and analytics endpoints
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                       example: 150
 *                     activeUsers:
 *                       type: number
 *                       example: 120
 *                     totalEnterprises:
 *                       type: number
 *                       example: 25
 *                     totalRevenue:
 *                       type: number
 *                       example: 1500000
 */
router.get('/stats',
  authenticate,
  authorize(['view_analytics']),
  dashboardController.getStats
);

/**
 * @swagger
 * /api/dashboard/analytics:
 *   get:
 *     summary: Get analytics data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [today, week, month, year, last7days, last30days]
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */
router.get('/analytics',
  authenticate,
  authorize(['view_analytics']),
  validateQuery(),
  dashboardController.getAnalytics
);

/**
 * @swagger
 * /api/dashboard/recent-activities:
 *   get:
 *     summary: Get recent activities
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of activities to retrieve
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
 */
router.get('/recent-activities',
  authenticate,
  dashboardController.getRecentActivities
);

module.exports = router;
