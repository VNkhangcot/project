const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Auth token storage
let authToken = null;

// Helper functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Test function
async function testEndpoint(method, endpoint, data = null, requiresAuth = false, description = '') {
  testResults.total++;
  
  try {
    const config = {
      method: method.toLowerCase(),
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (requiresAuth && authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    
    testResults.passed++;
    testResults.details.push({
      endpoint: `${method} ${endpoint}`,
      status: 'PASS',
      statusCode: response.status,
      description
    });
    
    logSuccess(`${method} ${endpoint} - ${response.status} - ${description}`);
    return response.data;
    
  } catch (error) {
    testResults.failed++;
    const statusCode = error.response?.status || 'ERROR';
    const errorMessage = error.response?.data?.message || error.message;
    
    testResults.details.push({
      endpoint: `${method} ${endpoint}`,
      status: 'FAIL',
      statusCode,
      error: errorMessage,
      description
    });
    
    logError(`${method} ${endpoint} - ${statusCode} - ${errorMessage} - ${description}`);
    return null;
  }
}

// Test system health
async function testSystemHealth() {
  log('\n' + '='.repeat(50), colors.bold);
  log('🏥 TESTING SYSTEM HEALTH', colors.bold);
  log('='.repeat(50), colors.bold);

  await testEndpoint('GET', '', null, false, 'API Root');
  
  // Test health endpoint (without /api prefix)
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    testResults.passed++;
    testResults.total++;
    logSuccess(`GET /health - ${response.status} - Health Check`);
  } catch (error) {
    testResults.failed++;
    testResults.total++;
    logError(`GET /health - ${error.response?.status || 'ERROR'} - Health Check`);
  }
}

// Test authentication
async function testAuthentication() {
  log('\n' + '='.repeat(50), colors.bold);
  log('🔐 TESTING AUTHENTICATION', colors.bold);
  log('='.repeat(50), colors.bold);

  // Test register
  const registerData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123!',
    confirmPassword: 'TestPass123!'
  };

  const registerResult = await testEndpoint('POST', '/auth/register', registerData, false, 'Register new user');
  
  // Test login with super admin account for better permissions
  const superAdminLoginData = {
    email: 'superadmin@system.com',
    password: 'SuperAdmin123!'
  };

  const superAdminLoginResult = await testEndpoint('POST', '/auth/login', superAdminLoginData, false, 'Super Admin login');
  
  if (superAdminLoginResult && superAdminLoginResult.data && superAdminLoginResult.data.tokens) {
    authToken = superAdminLoginResult.data.tokens.accessToken;
    logInfo(`Super Admin auth token obtained: ${authToken.substring(0, 20)}...`);
  } else if (superAdminLoginResult && superAdminLoginResult.tokens) {
    authToken = superAdminLoginResult.tokens.accessToken;
    logInfo(`Super Admin auth token obtained: ${authToken.substring(0, 20)}...`);
  }

  // Also test regular user login
  if (registerResult) {
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };

    await testEndpoint('POST', '/auth/login', loginData, false, 'User login');
  }

  // Test other auth endpoints
  await testEndpoint('GET', '/auth/profile', null, true, 'Get user profile');
  
  // Get refresh token from login response
  let refreshTokenData = null;
  if (superAdminLoginResult && superAdminLoginResult.data && superAdminLoginResult.data.tokens) {
    refreshTokenData = { refreshToken: superAdminLoginResult.data.tokens.refreshToken };
  } else if (superAdminLoginResult && superAdminLoginResult.tokens) {
    refreshTokenData = { refreshToken: superAdminLoginResult.tokens.refreshToken };
  }
  
  await testEndpoint('POST', '/auth/refresh-token', refreshTokenData, true, 'Refresh token');
  await testEndpoint('POST', '/auth/forgot-password', { email: 'test@example.com' }, false, 'Forgot password');
}

// Test dashboard
async function testDashboard() {
  log('\n' + '='.repeat(50), colors.bold);
  log('📊 TESTING DASHBOARD', colors.bold);
  log('='.repeat(50), colors.bold);

  await testEndpoint('GET', '/dashboard/stats', null, true, 'Dashboard statistics');
  await testEndpoint('GET', '/dashboard/analytics?period=month', null, true, 'Analytics data');
  await testEndpoint('GET', '/dashboard/recent-activities', null, true, 'Recent activities');
  await testEndpoint('GET', '/dashboard/server-metrics', null, true, 'Server metrics');
}

// Test HR module
async function testHR() {
  log('\n' + '='.repeat(50), colors.bold);
  log('👥 TESTING HR MANAGEMENT', colors.bold);
  log('='.repeat(50), colors.bold);

  // Departments
  await testEndpoint('GET', '/hr/departments', null, true, 'Get departments');
  
  const departmentData = {
    name: 'Test Department',
    description: 'Test department for API testing',
    budget: 100000000,
    enterprise: '507f1f77bcf86cd799439011' // Mã ID mẫu của doanh nghiệp
  };
  
  const newDept = await testEndpoint('POST', '/hr/departments', departmentData, true, 'Create department');
  
  // Employees
  await testEndpoint('GET', '/hr/employees', null, true, 'Get employees');
  
  const employeeData = {
    employeeId: 'EMP-' + Date.now(),
    personalInfo: {
      name: 'Test Employee',
      email: 'employee@test.com',
      phone: '0901234567',
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      dateOfBirth: '1990-01-01',
      idNumber: '123456789012'
    },
    workInfo: {
      position: 'Developer',
      department: '507f1f77bcf86cd799439011',
      startDate: '2023-01-01',
      salary: 20000000,
      contractType: 'full-time'
    },
    enterprise: '507f1f77bcf86cd799439011'
  };
  
  await testEndpoint('POST', '/hr/employees', employeeData, true, 'Create employee');
  
  // Attendance
  await testEndpoint('GET', '/hr/attendance', null, true, 'Get attendance records');
  await testEndpoint('POST', '/hr/attendance/checkin', { employeeId: 'test_id' }, true, 'Check-in');
  
  // Jobs
  await testEndpoint('GET', '/hr/jobs', null, true, 'Get job listings');
  await testEndpoint('GET', '/hr/applications', null, true, 'Get applications');
}

// Test Finance module
async function testFinance() {
  log('\n' + '='.repeat(50), colors.bold);
  log('💰 TESTING FINANCE MANAGEMENT', colors.bold);
  log('='.repeat(50), colors.bold);

  // Transactions
  await testEndpoint('GET', '/finance/transactions', null, true, 'Get transactions');
  
  const transactionData = {
    type: 'income',
    amount: 1000000,
    description: 'Test transaction',
    category: 'sales',
    date: new Date().toISOString().split('T')[0],
    enterprise: '507f1f77bcf86cd799439011'
  };
  
  await testEndpoint('POST', '/finance/transactions', transactionData, true, 'Create transaction');
  
  // Invoices
  await testEndpoint('GET', '/finance/invoices', null, true, 'Get invoices');
  
  const invoiceData = {
    invoiceNumber: `INV-${Date.now()}`,
    type: 'income',
    category: 'sales',
    amount: 100000,
    description: 'Test invoice',
    date: new Date().toISOString().split('T')[0],
    enterprise: '507f1f77bcf86cd799439011',
    customer: {
      name: 'Test Customer',
      email: 'customer@test.com'
    },
    items: [{
      name: 'Test Product',
      quantity: 1,
      price: 100000
    }],
    total: 100000
  };
  
  await testEndpoint('POST', '/finance/invoices', invoiceData, true, 'Create invoice');
  
  // Payroll
  await testEndpoint('GET', '/finance/payroll', null, true, 'Get payroll');
  
  // Reports
  await testEndpoint('GET', '/finance/reports/income-statement', null, true, 'Income statement');
  await testEndpoint('GET', '/finance/stats', null, true, 'Finance statistics');
}

// Test Inventory module
async function testInventory() {
  log('\n' + '='.repeat(50), colors.bold);
  log('📦 TESTING INVENTORY MANAGEMENT', colors.bold);
  log('='.repeat(50), colors.bold);

  // Products
  await testEndpoint('GET', '/inventory/products', null, true, 'Get products');
  
  const productData = {
    name: 'Test Product',
    sku: `SKU-${Date.now()}`,
    description: 'Test product for API testing',
    category: 'electronics',
    price: {
      cost: 500000,
      selling: 750000
    },
    stock: {
      current: 10,
      minimum: 5,
      maximum: 100
    }
  };
  
  const newProduct = await testEndpoint('POST', '/inventory/products', productData, true, 'Create product');
  
  // Stock
  await testEndpoint('GET', '/inventory/stock', null, true, 'Get stock status');
  await testEndpoint('GET', '/inventory/stock/movements', null, true, 'Get stock movements');
  
  if (newProduct && newProduct.data) {
    await testEndpoint('POST', '/inventory/stock/in', {
      productId: newProduct.data._id,
      quantity: 5,
      reason: 'Test stock in'
    }, true, 'Stock in');
  }
  
  // Suppliers
  await testEndpoint('GET', '/inventory/suppliers', null, true, 'Get suppliers');
  await testEndpoint('GET', '/inventory/stats', null, true, 'Inventory statistics');
}

// Test Sales module
async function testSales() {
  log('\n' + '='.repeat(50), colors.bold);
  log('🛒 TESTING SALES MANAGEMENT', colors.bold);
  log('='.repeat(50), colors.bold);

  // Orders
  await testEndpoint('GET', '/sales/orders', null, true, 'Get orders');
  
  const orderData = {
    customer: {
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '0987654321'
    },
    items: [{
      productId: 'test_product_id',
      quantity: 2,
      price: 750000
    }],
    total: 1500000
  };
  
  await testEndpoint('POST', '/sales/orders', orderData, true, 'Create order');
  
  // Customers
  await testEndpoint('GET', '/sales/customers', null, true, 'Get customers');
  
  const customerData = {
    name: 'Test Customer',
    email: 'newcustomer@test.com',
    phone: '0123456789',
    type: 'individual'
  };
  
  await testEndpoint('POST', '/sales/customers', customerData, true, 'Create customer');
  
  // Promotions
  await testEndpoint('GET', '/sales/promotions', null, true, 'Get promotions');
  
  // Reports
  await testEndpoint('GET', '/sales/reports/revenue', null, true, 'Revenue report');
  await testEndpoint('GET', '/sales/stats', null, true, 'Sales statistics');
}

// Test Reports module
async function testReports() {
  log('\n' + '='.repeat(50), colors.bold);
  log('📊 TESTING REPORTS MANAGEMENT', colors.bold);
  log('='.repeat(50), colors.bold);

  await testEndpoint('GET', '/reports/templates', null, true, 'Get report templates');
  await testEndpoint('GET', '/reports/history', null, true, 'Get report history');
  await testEndpoint('GET', '/reports/overview', null, true, 'Reports overview');
  
  const reportData = {
    type: 'revenue',
    parameters: {
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    format: 'json'
  };
  
  await testEndpoint('POST', '/reports/generate', reportData, true, 'Generate report');
}

// Print test summary
function printSummary() {
  log('\n' + '='.repeat(60), colors.bold);
  log('📋 TEST SUMMARY', colors.bold);
  log('='.repeat(60), colors.bold);
  
  log(`Total Tests: ${testResults.total}`);
  logSuccess(`Passed: ${testResults.passed}`);
  logError(`Failed: ${testResults.failed}`);
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  log(`Success Rate: ${successRate}%`);
  
  if (testResults.failed > 0) {
    log('\n' + '❌ FAILED TESTS:', colors.red);
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        log(`  ${test.endpoint} - ${test.statusCode} - ${test.error}`, colors.red);
      });
  }
  
  log('\n' + '✅ PASSED TESTS:', colors.green);
  testResults.details
    .filter(test => test.status === 'PASS')
    .forEach(test => {
      log(`  ${test.endpoint} - ${test.statusCode}`, colors.green);
    });
}

// Main test runner
async function runAllTests() {
  log('🚀 Starting API Endpoint Tests...', colors.bold);
  log(`Base URL: ${BASE_URL}`, colors.blue);
  
  try {
    await testSystemHealth();
    await testAuthentication();
    
    if (authToken) {
      await testDashboard();
      await testHR();
      await testFinance();
      await testInventory();
      await testSales();
      await testReports();
    } else {
      logWarning('Skipping authenticated tests - no auth token available');
    }
    
  } catch (error) {
    logError(`Test runner error: ${error.message}`);
  }
  
  printSummary();
}

// Export for use as module
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testEndpoint,
  testResults
};
