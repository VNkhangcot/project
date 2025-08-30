const express = require('express');
const router = express.Router();

// Import controllers
const hrController = require('../controllers/hr.controller');

// Import middleware
const { authenticate, authorize, requireEnterpriseAccess } = require('../middleware/auth.middleware');
const { validateEmployee, validateDepartment, validateQuery, validateParams } = require('../middleware/validation.middleware');

/**
 * @swagger
 * tags:
 *   name: HR Management
 *   description: Human Resources management endpoints
 */

// Department routes
router.get('/departments',
  authenticate,
  authorize(['manage_hr', 'view_employees']),
  validateQuery(),
  hrController.getDepartments
);

router.post('/departments',
  authenticate,
  authorize(['manage_hr']),
  validateDepartment('create'),
  hrController.createDepartment
);

router.get('/departments/:id',
  authenticate,
  authorize(['manage_hr', 'view_employees']),
  validateParams(),
  hrController.getDepartment
);

router.put('/departments/:id',
  authenticate,
  authorize(['manage_hr']),
  validateParams(),
  validateDepartment('update'),
  hrController.updateDepartment
);

router.delete('/departments/:id',
  authenticate,
  authorize(['manage_hr']),
  validateParams(),
  hrController.deleteDepartment
);

// Employee routes
router.get('/employees',
  authenticate,
  authorize(['manage_hr', 'view_employees']),
  validateQuery(),
  hrController.getEmployees
);

router.post('/employees',
  authenticate,
  authorize(['manage_hr', 'create_employees']),
  validateEmployee('create'),
  hrController.createEmployee
);

router.get('/employees/:id',
  authenticate,
  authorize(['manage_hr', 'view_employees']),
  validateParams(),
  hrController.getEmployee
);

router.put('/employees/:id',
  authenticate,
  authorize(['manage_hr', 'update_employees']),
  validateParams(),
  validateEmployee('update'),
  hrController.updateEmployee
);

router.delete('/employees/:id',
  authenticate,
  authorize(['manage_hr', 'delete_employees']),
  validateParams(),
  hrController.deleteEmployee
);

// Attendance routes
router.get('/attendance',
  authenticate,
  authorize(['manage_hr', 'view_attendance']),
  validateQuery(),
  hrController.getAttendance
);

router.post('/attendance/checkin',
  authenticate,
  authorize(['manage_attendance']),
  hrController.checkIn
);

router.post('/attendance/checkout',
  authenticate,
  authorize(['manage_attendance']),
  hrController.checkOut
);

// Job listings routes
router.get('/jobs',
  authenticate,
  authorize(['manage_hr', 'view_jobs']),
  hrController.getJobs
);

router.post('/jobs',
  authenticate,
  authorize(['manage_hr', 'create_jobs']),
  validateEmployee('create'),
  hrController.createJob
);

router.get('/jobs/:id',
  authenticate,
  authorize(['manage_hr', 'view_jobs']),
  validateParams(),
  hrController.getJob
);

router.put('/jobs/:id',
  authenticate,
  authorize(['manage_hr', 'update_jobs']),
  validateParams(),
  validateEmployee('update'),
  hrController.updateJob
);

router.delete('/jobs/:id',
  authenticate,
  authorize(['manage_hr', 'delete_jobs']),
  validateParams(),
  hrController.deleteJob
);

// Job applications routes
router.get('/applications',
  authenticate,
  authorize(['manage_hr', 'view_applications']),
  hrController.getApplications
);

router.post('/applications',
  authenticate,
  authorize(['manage_hr', 'create_applications']),
  validateEmployee('create'),
  hrController.createApplication
);

router.get('/applications/:id',
  authenticate,
  authorize(['manage_hr', 'view_applications']),
  validateParams(),
  hrController.getApplication
);

router.put('/applications/:id',
  authenticate,
  authorize(['manage_hr', 'update_applications']),
  validateParams(),
  validateEmployee('update'),
  hrController.updateApplication
);

module.exports = router;
