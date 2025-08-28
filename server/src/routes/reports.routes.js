const express = require('express');
const router = express.Router();

// Import controllers
const reportsController = require('../controllers/reports.controller');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateQuery, validateParams } = require('../middleware/validation.middleware');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report generation and management endpoints
 */

// Report routes
router.get('/generate',
  authenticate,
  authorize(['view_reports', 'create_reports']),
  validateQuery(),
  reportsController.generateReport
);

router.get('/templates',
  authenticate,
  authorize(['view_reports']),
  reportsController.getReportTemplates
);

router.get('/history',
  authenticate,
  authorize(['view_reports']),
  validateQuery(),
  reportsController.getReportHistory
);

router.post('/custom',
  authenticate,
  authorize(['create_reports']),
  reportsController.createCustomReport
);

module.exports = router;
