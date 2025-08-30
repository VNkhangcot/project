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

// Invoice routes
router.get('/invoices',
  authenticate,
  authorize(['manage_finance', 'view_transactions']),
  financeController.getInvoices
);

router.post('/invoices',
  authenticate,
  authorize(['manage_finance', 'create_transactions']),
  validateTransaction('create'),
  financeController.createInvoice
);

router.get('/invoices/:id',
  authenticate,
  authorize(['manage_finance', 'view_transactions']),
  validateParams(),
  financeController.getInvoice
);

router.put('/invoices/:id',
  authenticate,
  authorize(['manage_finance', 'update_transactions']),
  validateParams(),
  validateTransaction('update'),
  financeController.updateInvoice
);

router.delete('/invoices/:id',
  authenticate,
  authorize(['manage_finance', 'delete_transactions']),
  validateParams(),
  financeController.deleteInvoice
);

// Payroll routes
router.get('/payroll',
  authenticate,
  authorize(['manage_finance', 'manage_payroll']),
  financeController.getPayroll
);

// Finance stats
router.get('/stats',
  authenticate,
  authorize(['manage_finance', 'view_analytics']),
  financeController.getStats
);

// Payroll detail routes
router.get('/payroll/:id',
  authenticate,
  authorize(['manage_finance', 'manage_payroll']),
  validateParams(),
  financeController.getPayrollRecord
);

router.post('/payroll',
  authenticate,
  authorize(['manage_finance', 'manage_payroll']),
  validateTransaction('create'),
  financeController.createPayroll
);

router.put('/payroll/:id',
  authenticate,
  authorize(['manage_finance', 'manage_payroll']),
  validateParams(),
  validateTransaction('update'),
  financeController.updatePayroll
);

// Finance reports
router.get('/reports/income-statement',
  authenticate,
  authorize(['manage_finance', 'view_financial_reports']),
  financeController.getIncomeStatement
);

router.get('/reports/balance-sheet',
  authenticate,
  authorize(['manage_finance', 'view_financial_reports']),
  financeController.getBalanceSheet
);

router.get('/reports/cash-flow',
  authenticate,
  authorize(['manage_finance', 'view_financial_reports']),
  financeController.getCashFlow
);

module.exports = router;
