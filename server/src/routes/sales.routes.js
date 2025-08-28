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

module.exports = router;
