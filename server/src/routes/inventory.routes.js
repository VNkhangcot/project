const express = require('express');
const router = express.Router();

// Import controllers
const inventoryController = require('../controllers/inventory.controller');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateQuery, validateParams } = require('../middleware/validation.middleware');

/**
 * @swagger
 * tags:
 *   name: Inventory Management
 *   description: Inventory and product management endpoints
 */

// Product routes
router.get('/products',
  authenticate,
  authorize(['manage_inventory', 'view_products']),
  validateQuery(),
  inventoryController.getProducts
);

router.post('/products',
  authenticate,
  authorize(['manage_inventory', 'create_products']),
  inventoryController.createProduct
);

router.get('/products/:id',
  authenticate,
  authorize(['manage_inventory', 'view_products']),
  validateParams(),
  inventoryController.getProduct
);

router.put('/products/:id',
  authenticate,
  authorize(['manage_inventory', 'update_products']),
  validateParams(),
  inventoryController.updateProduct
);

router.delete('/products/:id',
  authenticate,
  authorize(['manage_inventory', 'delete_products']),
  validateParams(),
  inventoryController.deleteProduct
);

// Stock routes
router.get('/stock',
  authenticate,
  authorize(['manage_inventory', 'manage_stock']),
  validateQuery(),
  inventoryController.getStock
);

router.post('/stock/in',
  authenticate,
  authorize(['manage_inventory', 'manage_stock']),
  inventoryController.stockIn
);

router.post('/stock/out',
  authenticate,
  authorize(['manage_inventory', 'manage_stock']),
  inventoryController.stockOut
);

router.get('/stock/movements',
  authenticate,
  authorize(['manage_inventory', 'manage_stock']),
  validateQuery(),
  inventoryController.getStockMovements
);

router.get('/stock/report',
  authenticate,
  authorize(['manage_inventory', 'manage_stock']),
  validateQuery(),
  inventoryController.getStockReport
);

// Supplier routes
router.get('/suppliers',
  authenticate,
  authorize(['manage_inventory']),
  validateQuery(),
  inventoryController.getSuppliers
);

router.get('/suppliers/:id',
  authenticate,
  authorize(['manage_inventory']),
  validateParams(),
  inventoryController.getSupplier
);

router.post('/suppliers',
  authenticate,
  authorize(['manage_inventory']),
  inventoryController.createSupplier
);

router.put('/suppliers/:id',
  authenticate,
  authorize(['manage_inventory']),
  validateParams(),
  inventoryController.updateSupplier
);

// Stats route
router.get('/stats',
  authenticate,
  authorize(['manage_inventory', 'view_analytics']),
  inventoryController.getInventoryStats
);

module.exports = router;
