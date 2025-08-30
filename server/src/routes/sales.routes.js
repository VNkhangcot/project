const express = require('express');
const router = express.Router();

// Import controllers
const salesController = require('../controllers/sales.controller');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateQuery, validateParams } = require('../middleware/validation.middleware');

/**
 * @swagger
 * tags:
 *   name: Sales Management
 *   description: Sales and order management endpoints
 */

// Order routes
router.get('/orders',
  authenticate,
  authorize(['manage_sales', 'view_orders']),
  validateQuery(),
  salesController.getOrders
);

router.post('/orders',
  authenticate,
  authorize(['manage_sales', 'create_orders']),
  salesController.createOrder
);

router.get('/orders/:id',
  authenticate,
  authorize(['manage_sales', 'view_orders']),
  validateParams(),
  salesController.getOrder
);

router.put('/orders/:id',
  authenticate,
  authorize(['manage_sales', 'update_orders']),
  validateParams(),
  salesController.updateOrder
);

// Customer routes
router.get('/customers',
  authenticate,
  authorize(['manage_sales', 'manage_customers']),
  validateQuery(),
  salesController.getCustomers
);

router.post('/customers',
  authenticate,
  authorize(['manage_sales', 'manage_customers']),
  salesController.createCustomer
);

router.get('/customers/:id',
  authenticate,
  authorize(['manage_sales', 'manage_customers']),
  validateParams(),
  salesController.getCustomer
);

router.put('/customers/:id',
  authenticate,
  authorize(['manage_sales', 'manage_customers']),
  validateParams(),
  salesController.updateCustomer
);

// Promotion routes
router.get('/promotions',
  authenticate,
  authorize(['manage_sales']),
  validateQuery(),
  salesController.getPromotions
);

router.get('/promotions/:id',
  authenticate,
  authorize(['manage_sales']),
  validateParams(),
  salesController.getPromotion
);

router.post('/promotions',
  authenticate,
  authorize(['manage_sales']),
  salesController.createPromotion
);

router.put('/promotions/:id',
  authenticate,
  authorize(['manage_sales']),
  validateParams(),
  salesController.updatePromotion
);

// Reports routes
router.get('/reports/revenue',
  authenticate,
  authorize(['manage_sales', 'view_reports']),
  validateQuery(),
  salesController.getRevenueReport
);

router.get('/reports/products',
  authenticate,
  authorize(['manage_sales', 'view_reports']),
  validateQuery(),
  salesController.getProductReport
);

router.get('/reports/customers',
  authenticate,
  authorize(['manage_sales', 'view_reports']),
  validateQuery(),
  salesController.getCustomerReport
);

// Stats route
router.get('/stats',
  authenticate,
  authorize(['manage_sales', 'view_analytics']),
  salesController.getSalesStats
);

module.exports = router;
