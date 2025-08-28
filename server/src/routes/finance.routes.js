const express = require('express');
const router = express.Router();

// Import controllers
const financeController = require('../controllers/finance.controller');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateTransaction, validateQuery, validateParams } = require('../middleware/validation.middleware');

/**
 * @swagger
 * tags:
 *   name: Finance Management
 *   description: Financial management endpoints
 */

// Transaction routes
router.get('/transactions',
  authenticate,
  authorize(['manage_finance', 'view_transactions']),
  validateQuery(),
  financeController.getTransactions
);

router.post('/transactions',
  authenticate,
  authorize(['manage_finance', 'create_transactions']),
  validateTransaction('create'),
  financeController.createTransaction
);

router.get('/transactions/:id',
  authenticate,
  authorize(['manage_finance', 'view_transactions']),
  validateParams(),
  financeController.getTransaction
);

router.put('/transactions/:id',
  authenticate,
  authorize(['manage_finance', 'update_transactions']),
  validateParams(),
  validateTransaction('update'),
  financeController.updateTransaction
);

router.delete('/transactions/:id',
  authenticate,
  authorize(['manage_finance', 'delete_transactions']),
  validateParams(),
  financeController.deleteTransaction
);

module.exports = router;
