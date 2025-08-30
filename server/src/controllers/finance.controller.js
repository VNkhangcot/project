const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// Mock data for development
const mockTransactions = [
  {
    _id: '1',
    type: 'income',
    category: 'Sales',
    amount: 50000000,
    currency: 'VND',
    description: 'Doanh thu bán hàng tháng 1',
    date: '2024-01-15',
    status: 'completed'
  },
  {
    _id: '2',
    type: 'expense',
    category: 'Salary',
    amount: 30000000,
    currency: 'VND',
    description: 'Lương nhân viên tháng 1',
    date: '2024-01-10',
    status: 'completed'
  }
];

const mockInvoices = [
  {
    _id: '1',
    invoiceNumber: 'INV-2024-001',
    type: 'sales',
    customer: {
      name: 'Công ty ABC',
      email: 'abc@company.com',
      phone: '0123456789'
    },
    items: [
      { name: 'Sản phẩm A', quantity: 10, price: 100000, total: 1000000 },
      { name: 'Sản phẩm B', quantity: 5, price: 200000, total: 1000000 }
    ],
    subtotal: 2000000,
    tax: 200000,
    total: 2200000,
    currency: 'VND',
    dueDate: '2024-02-15',
    status: 'paid'
  },
  {
    _id: '2',
    invoiceNumber: 'INV-2024-002',
    type: 'purchase',
    customer: {
      name: 'Nhà cung cấp XYZ',
      email: 'xyz@supplier.com',
      phone: '0987654321'
    },
    items: [
      { name: 'Nguyên liệu A', quantity: 100, price: 50000, total: 5000000 }
    ],
    subtotal: 5000000,
    tax: 500000,
    total: 5500000,
    currency: 'VND',
    dueDate: '2024-02-20',
    status: 'pending'
  }
];

const mockPayroll = [
  {
    _id: '1',
    employee: 'Nguyễn Văn A',
    employeeId: 'EMP001',
    period: { month: 1, year: 2024 },
    basicSalary: 15000000,
    allowances: [
      { type: 'Transport', amount: 1000000 },
      { type: 'Meal', amount: 500000 }
    ],
    deductions: [
      { type: 'Insurance', amount: 800000 },
      { type: 'Tax', amount: 1200000 }
    ],
    overtime: { hours: 10, rate: 200000, total: 2000000 },
    netSalary: 16500000,
    status: 'paid'
  },
  {
    _id: '2',
    employee: 'Trần Thị B',
    employeeId: 'EMP002',
    period: { month: 1, year: 2024 },
    basicSalary: 18000000,
    allowances: [
      { type: 'Transport', amount: 1000000 },
      { type: 'Position', amount: 2000000 }
    ],
    deductions: [
      { type: 'Insurance', amount: 900000 },
      { type: 'Tax', amount: 1500000 }
    ],
    overtime: { hours: 5, rate: 250000, total: 1250000 },
    netSalary: 19850000,
    status: 'approved'
  }
];

// Transaction Controllers
const getTransactions = async (req, res) => {
  try {
    logger.info('Fetching transactions');
    
    const { page = 1, limit = 10, type = '', category = '', startDate = '', endDate = '' } = req.query;
    
    let filteredTransactions = mockTransactions;
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(trans => trans.type === type);
    }
    
    if (category) {
      filteredTransactions = filteredTransactions.filter(trans => 
        trans.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (startDate && endDate) {
      filteredTransactions = filteredTransactions.filter(trans => 
        trans.date >= startDate && trans.date <= endDate
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    return successResponse(res, {
      transactions: paginatedTransactions,
      total: filteredTransactions.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredTransactions.length / limit)
    }, 'Transactions retrieved successfully');
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    return errorResponse(res, 'Failed to fetch transactions', 500);
  }
};

const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = mockTransactions.find(trans => trans._id === id);
    
    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }
    
    return successResponse(res, { transaction }, 'Transaction retrieved successfully');
  } catch (error) {
    logger.error('Error fetching transaction:', error);
    return errorResponse(res, 'Failed to fetch transaction', 500);
  }
};

const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, currency, description, date } = req.body;
    
    const newTransaction = {
      _id: (mockTransactions.length + 1).toString(),
      type,
      category,
      amount,
      currency: currency || 'VND',
      description,
      date: date || new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    
    mockTransactions.push(newTransaction);
    
    logger.info(`Transaction created: ${type} - ${amount}`);
    return successResponse(res, { transaction: newTransaction }, 'Transaction created successfully', 201);
  } catch (error) {
    logger.error('Error creating transaction:', error);
    return errorResponse(res, 'Failed to create transaction', 500);
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const transactionIndex = mockTransactions.findIndex(trans => trans._id === id);
    if (transactionIndex === -1) {
      return errorResponse(res, 'Transaction not found', 404);
    }
    
    mockTransactions[transactionIndex] = { ...mockTransactions[transactionIndex], ...updates };
    
    logger.info(`Transaction updated: ${id}`);
    return successResponse(res, { transaction: mockTransactions[transactionIndex] }, 'Transaction updated successfully');
  } catch (error) {
    logger.error('Error updating transaction:', error);
    return errorResponse(res, 'Failed to update transaction', 500);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transactionIndex = mockTransactions.findIndex(trans => trans._id === id);
    if (transactionIndex === -1) {
      return errorResponse(res, 'Transaction not found', 404);
    }
    
    mockTransactions.splice(transactionIndex, 1);
    
    logger.info(`Transaction deleted: ${id}`);
    return successResponse(res, null, 'Transaction deleted successfully');
  } catch (error) {
    logger.error('Error deleting transaction:', error);
    return errorResponse(res, 'Failed to delete transaction', 500);
  }
};

// Invoice Controllers
const getInvoices = async (req, res) => {
  try {
    logger.info('Fetching invoices');
    
    const { page = 1, limit = 10, type = '', status = '' } = req.query;
    
    let filteredInvoices = mockInvoices;
    
    if (type) {
      filteredInvoices = filteredInvoices.filter(inv => inv.type === type);
    }
    
    if (status) {
      filteredInvoices = filteredInvoices.filter(inv => inv.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);
    
    return successResponse(res, {
      invoices: paginatedInvoices,
      total: filteredInvoices.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredInvoices.length / limit)
    }, 'Invoices retrieved successfully');
  } catch (error) {
    logger.error('Error fetching invoices:', error);
    return errorResponse(res, 'Failed to fetch invoices', 500);
  }
};

const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = mockInvoices.find(inv => inv._id === id);
    
    if (!invoice) {
      return errorResponse(res, 'Invoice not found', 404);
    }
    
    return successResponse(res, { invoice }, 'Invoice retrieved successfully');
  } catch (error) {
    logger.error('Error fetching invoice:', error);
    return errorResponse(res, 'Failed to fetch invoice', 500);
  }
};

const createInvoice = async (req, res) => {
  try {
    const { type, customer, items = [], tax, dueDate } = req.body;
    
    // Kiểm tra nếu items không tồn tại hoặc không phải là mảng
    if (!Array.isArray(items)) {
      return errorResponse(res, 'Items must be an array', 400);
    }
    
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const total = subtotal + (tax || 0);
    
    const newInvoice = {
      _id: (mockInvoices.length + 1).toString(),
      invoiceNumber: `INV-2024-${String(mockInvoices.length + 1).padStart(3, '0')}`,
      type,
      customer,
      items: items.map(item => ({
        ...item,
        total: item.quantity * item.price
      })),
      subtotal,
      tax: tax || 0,
      total,
      currency: 'VND',
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft'
    };
    
    mockInvoices.push(newInvoice);
    
    logger.info(`Invoice created: ${newInvoice.invoiceNumber}`);
    return successResponse(res, { invoice: newInvoice }, 'Invoice created successfully', 201);
  } catch (error) {
    logger.error('Error creating invoice:', error);
    return errorResponse(res, 'Failed to create invoice', 500);
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const invoiceIndex = mockInvoices.findIndex(inv => inv._id === id);
    if (invoiceIndex === -1) {
      return errorResponse(res, 'Invoice not found', 404);
    }
    
    // Recalculate totals if items are updated
    if (updates.items) {
      const subtotal = updates.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      updates.subtotal = subtotal;
      updates.total = subtotal + (updates.tax || mockInvoices[invoiceIndex].tax || 0);
      updates.items = updates.items.map(item => ({
        ...item,
        total: item.quantity * item.price
      }));
    }
    
    mockInvoices[invoiceIndex] = { ...mockInvoices[invoiceIndex], ...updates };
    
    logger.info(`Invoice updated: ${id}`);
    return successResponse(res, { invoice: mockInvoices[invoiceIndex] }, 'Invoice updated successfully');
  } catch (error) {
    logger.error('Error updating invoice:', error);
    return errorResponse(res, 'Failed to update invoice', 500);
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoiceIndex = mockInvoices.findIndex(inv => inv._id === id);
    if (invoiceIndex === -1) {
      return errorResponse(res, 'Invoice not found', 404);
    }
    
    mockInvoices.splice(invoiceIndex, 1);
    
    logger.info(`Invoice deleted: ${id}`);
    return successResponse(res, null, 'Invoice deleted successfully');
  } catch (error) {
    logger.error('Error deleting invoice:', error);
    return errorResponse(res, 'Failed to delete invoice', 500);
  }
};

// Payroll Controllers
const getPayroll = async (req, res) => {
  try {
    logger.info('Fetching payroll records');
    
    const { page = 1, limit = 10, month = '', year = '', status = '' } = req.query;
    
    let filteredPayroll = mockPayroll;
    
    if (month && year) {
      filteredPayroll = filteredPayroll.filter(pay => 
        pay.period.month === parseInt(month) && pay.period.year === parseInt(year)
      );
    }
    
    if (status) {
      filteredPayroll = filteredPayroll.filter(pay => pay.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPayroll = filteredPayroll.slice(startIndex, endIndex);
    
    return successResponse(res, {
      payroll: paginatedPayroll,
      total: filteredPayroll.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredPayroll.length / limit)
    }, 'Payroll records retrieved successfully');
  } catch (error) {
    logger.error('Error fetching payroll:', error);
    return errorResponse(res, 'Failed to fetch payroll records', 500);
  }
};

const getPayrollRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const payrollRecord = mockPayroll.find(pay => pay._id === id);
    
    if (!payrollRecord) {
      return errorResponse(res, 'Payroll record not found', 404);
    }
    
    return successResponse(res, { payroll: payrollRecord }, 'Payroll record retrieved successfully');
  } catch (error) {
    logger.error('Error fetching payroll record:', error);
    return errorResponse(res, 'Failed to fetch payroll record', 500);
  }
};

const createPayroll = async (req, res) => {
  try {
    const { employee, employeeId, period, basicSalary, allowances, deductions, overtime } = req.body;
    
    const totalAllowances = allowances.reduce((sum, allow) => sum + allow.amount, 0);
    const totalDeductions = deductions.reduce((sum, deduct) => sum + deduct.amount, 0);
    const overtimeTotal = overtime ? overtime.hours * overtime.rate : 0;
    
    const netSalary = basicSalary + totalAllowances + overtimeTotal - totalDeductions;
    
    const newPayroll = {
      _id: (mockPayroll.length + 1).toString(),
      employee,
      employeeId,
      period,
      basicSalary,
      allowances,
      deductions,
      overtime: overtime ? { ...overtime, total: overtimeTotal } : { hours: 0, rate: 0, total: 0 },
      netSalary,
      status: 'draft'
    };
    
    mockPayroll.push(newPayroll);
    
    logger.info(`Payroll created for employee: ${employee}`);
    return successResponse(res, { payroll: newPayroll }, 'Payroll record created successfully', 201);
  } catch (error) {
    logger.error('Error creating payroll:', error);
    return errorResponse(res, 'Failed to create payroll record', 500);
  }
};

const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const payrollIndex = mockPayroll.findIndex(pay => pay._id === id);
    if (payrollIndex === -1) {
      return errorResponse(res, 'Payroll record not found', 404);
    }
    
    // Recalculate net salary if financial data is updated
    const currentPayroll = mockPayroll[payrollIndex];
    const basicSalary = updates.basicSalary || currentPayroll.basicSalary;
    const allowances = updates.allowances || currentPayroll.allowances;
    const deductions = updates.deductions || currentPayroll.deductions;
    const overtime = updates.overtime || currentPayroll.overtime;
    
    const totalAllowances = allowances.reduce((sum, allow) => sum + allow.amount, 0);
    const totalDeductions = deductions.reduce((sum, deduct) => sum + deduct.amount, 0);
    const overtimeTotal = overtime.hours * overtime.rate;
    
    updates.netSalary = basicSalary + totalAllowances + overtimeTotal - totalDeductions;
    if (updates.overtime) {
      updates.overtime.total = overtimeTotal;
    }
    
    mockPayroll[payrollIndex] = { ...mockPayroll[payrollIndex], ...updates };
    
    logger.info(`Payroll updated: ${id}`);
    return successResponse(res, { payroll: mockPayroll[payrollIndex] }, 'Payroll record updated successfully');
  } catch (error) {
    logger.error('Error updating payroll:', error);
    return errorResponse(res, 'Failed to update payroll record', 500);
  }
};

// Financial Reports
const getIncomeStatement = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filteredTransactions = mockTransactions;
    if (startDate && endDate) {
      filteredTransactions = mockTransactions.filter(trans => 
        trans.date >= startDate && trans.date <= endDate
      );
    }
    
    const income = filteredTransactions
      .filter(trans => trans.type === 'income')
      .reduce((sum, trans) => sum + trans.amount, 0);
    
    const expenses = filteredTransactions
      .filter(trans => trans.type === 'expense')
      .reduce((sum, trans) => sum + trans.amount, 0);
    
    const netIncome = income - expenses;
    
    const incomeStatement = {
      period: { startDate, endDate },
      revenue: income,
      expenses: expenses,
      netIncome: netIncome,
      profitMargin: income > 0 ? ((netIncome / income) * 100).toFixed(2) : 0,
      transactions: filteredTransactions
    };
    
    return successResponse(res, incomeStatement, 'Income statement generated successfully');
  } catch (error) {
    logger.error('Error generating income statement:', error);
    return errorResponse(res, 'Failed to generate income statement', 500);
  }
};

const getBalanceSheet = async (req, res) => {
  try {
    const totalAssets = mockTransactions
      .filter(trans => trans.type === 'income')
      .reduce((sum, trans) => sum + trans.amount, 0);
    
    const totalLiabilities = mockTransactions
      .filter(trans => trans.type === 'expense')
      .reduce((sum, trans) => sum + trans.amount, 0);
    
    const equity = totalAssets - totalLiabilities;
    
    const balanceSheet = {
      date: new Date().toISOString().split('T')[0],
      assets: {
        current: totalAssets * 0.7,
        fixed: totalAssets * 0.3,
        total: totalAssets
      },
      liabilities: {
        current: totalLiabilities * 0.6,
        longTerm: totalLiabilities * 0.4,
        total: totalLiabilities
      },
      equity: {
        retainedEarnings: equity * 0.8,
        capital: equity * 0.2,
        total: equity
      }
    };
    
    return successResponse(res, balanceSheet, 'Balance sheet generated successfully');
  } catch (error) {
    logger.error('Error generating balance sheet:', error);
    return errorResponse(res, 'Failed to generate balance sheet', 500);
  }
};

const getCashFlow = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filteredTransactions = mockTransactions;
    if (startDate && endDate) {
      filteredTransactions = mockTransactions.filter(trans => 
        trans.date >= startDate && trans.date <= endDate
      );
    }
    
    const operatingCashFlow = filteredTransactions
      .filter(trans => ['Sales', 'Salary', 'Rent', 'Utilities'].includes(trans.category))
      .reduce((sum, trans) => sum + (trans.type === 'income' ? trans.amount : -trans.amount), 0);
    
    const investingCashFlow = filteredTransactions
      .filter(trans => ['Equipment', 'Investment'].includes(trans.category))
      .reduce((sum, trans) => sum + (trans.type === 'income' ? trans.amount : -trans.amount), 0);
    
    const financingCashFlow = filteredTransactions
      .filter(trans => ['Loan', 'Capital'].includes(trans.category))
      .reduce((sum, trans) => sum + (trans.type === 'income' ? trans.amount : -trans.amount), 0);
    
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    
    const cashFlow = {
      period: { startDate, endDate },
      operating: operatingCashFlow,
      investing: investingCashFlow,
      financing: financingCashFlow,
      netCashFlow: netCashFlow,
      transactions: filteredTransactions
    };
    
    return successResponse(res, cashFlow, 'Cash flow statement generated successfully');
  } catch (error) {
    logger.error('Error generating cash flow statement:', error);
    return errorResponse(res, 'Failed to generate cash flow statement', 500);
  }
};

// Finance Stats
const getFinanceStats = async (req, res) => {
  try {
    const totalIncome = mockTransactions
      .filter(trans => trans.type === 'income')
      .reduce((sum, trans) => sum + trans.amount, 0);
    
    const totalExpenses = mockTransactions
      .filter(trans => trans.type === 'expense')
      .reduce((sum, trans) => sum + trans.amount, 0);
    
    const totalInvoices = mockInvoices.length;
    const paidInvoices = mockInvoices.filter(inv => inv.status === 'paid').length;
    const pendingInvoices = mockInvoices.filter(inv => inv.status === 'pending').length;
    
    const totalPayroll = mockPayroll.reduce((sum, pay) => sum + pay.netSalary, 0);
    
    const stats = {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      totalPayroll,
      averageInvoiceValue: totalInvoices > 0 ? mockInvoices.reduce((sum, inv) => sum + inv.total, 0) / totalInvoices : 0,
      monthlyTrend: [
        { month: 'Jan', income: totalIncome * 0.8, expenses: totalExpenses * 0.7 },
        { month: 'Feb', income: totalIncome * 0.9, expenses: totalExpenses * 0.8 },
        { month: 'Mar', income: totalIncome, expenses: totalExpenses }
      ]
    };
    
    return successResponse(res, stats, 'Finance statistics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching finance stats:', error);
    return errorResponse(res, 'Failed to fetch finance statistics', 500);
  }
};

module.exports = {
  // Transactions
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  
  // Invoices
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  
  // Payroll
  getPayroll,
  getPayrollRecord,
  createPayroll,
  updatePayroll,
  
  // Reports
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
  
  // Stats
  getFinanceStats,
  getStats: getFinanceStats // Alias for route compatibility
};
