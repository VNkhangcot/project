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

// Report Generation
router.post('/generate',
  authenticate,
  authorize(['view_reports', 'create_reports']),
  reportsController.generateReport
);

router.post('/custom',
  authenticate,
  authorize(['create_reports']),
  reportsController.generateCustomReport
);

// Report Templates
router.get('/templates',
  authenticate,
  authorize(['view_reports']),
  reportsController.getReportTemplates
);

router.get('/templates/:id',
  authenticate,
  authorize(['view_reports']),
  validateParams(),
  reportsController.getReportTemplate
);

router.post('/templates',
  authenticate,
  authorize(['create_reports']),
  reportsController.createReportTemplate
);

router.put('/templates/:id',
  authenticate,
  authorize(['update_reports']),
  validateParams(),
  reportsController.updateReportTemplate
);

router.delete('/templates/:id',
  authenticate,
  authorize(['delete_reports']),
  validateParams(),
  reportsController.deleteReportTemplate
);

// Report History
router.get('/history',
  authenticate,
  authorize(['view_reports']),
  validateQuery(),
  reportsController.getReportHistory
);

router.get('/history/:id',
  authenticate,
  authorize(['view_reports']),
  validateParams(),
  reportsController.getReport
);

router.delete('/history/:id',
  authenticate,
  authorize(['delete_reports']),
  validateParams(),
  reportsController.deleteReport
);

// Reports Overview
router.get('/overview',
  authenticate,
  authorize(['view_reports']),
  reportsController.getReportsOverview
);

module.exports = router;
