const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// Mock data for development
const mockOrders = [
  {
    _id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0123456789',
      address: '123 Nguyễn Huệ, Q1, TP.HCM'
    },
    items: [
      {
        productId: '1',
        name: 'Laptop Dell XPS 13',
        quantity: 1,
        price: 25000000,
        total: 25000000
      },
      {
        productId: '2',
        name: 'Bàn làm việc gỗ',
        quantity: 1,
        price: 3000000,
        total: 3000000
      }
    ],
    subtotal: 28000000,
    tax: 2800000,
    discount: 1000000,
    total: 29800000,
    status: 'confirmed',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '123 Nguyễn Huệ',
      city: 'TP.HCM',
      district: 'Q1',
      zipCode: '70000'
    },
    notes: 'Giao hàng trong giờ hành chính',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20'
  },
  {
    _id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0987654321',
      address: '456 Lê Lợi, Q3, TP.HCM'
    },
    items: [
      {
        productId: '1',
        name: 'Laptop Dell XPS 13',
        quantity: 2,
        price: 25000000,
        total: 50000000
      }
    ],
    subtotal: 50000000,
    tax: 5000000,
    discount: 2000000,
    total: 53000000,
    status: 'processing',
    paymentStatus: 'pending',
    shippingAddress: {
      street: '456 Lê Lợi',
      city: 'TP.HCM',
      district: 'Q3',
      zipCode: '70000'
    },
    notes: '',
    orderDate: '2024-01-16',
    deliveryDate: '2024-01-22'
  }
];

const mockCustomers = [
  {
    _id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    address: {
      street: '123 Nguyễn Huệ',
      city: 'TP.HCM',
      district: 'Q1',
      zipCode: '70000'
    },
    type: 'individual',
    taxCode: '',
    creditLimit: 100000000,
    totalOrders: 5,
    totalSpent: 150000000,
    status: 'active',
    registrationDate: '2023-06-15',
    lastOrderDate: '2024-01-15'
  },
  {
    _id: '2',
    name: 'Công ty ABC',
    email: 'info@abc.com',
    phone: '0987654321',
    address: {
      street: '456 Lê Lợi',
      city: 'TP.HCM',
      district: 'Q3',
      zipCode: '70000'
    },
    type: 'business',
    taxCode: '0123456789',
    creditLimit: 500000000,
    totalOrders: 12,
    totalSpent: 800000000,
    status: 'active',
    registrationDate: '2023-03-10',
    lastOrderDate: '2024-01-16'
  }
];

const mockPromotions = [
  {
    _id: '1',
    name: 'Khuyến mãi Tết 2024',
    code: 'TET2024',
    description: 'Giảm giá 10% cho tất cả sản phẩm',
    type: 'percentage',
    value: 10,
    minOrderValue: 5000000,
    maxDiscount: 2000000,
    startDate: '2024-01-01',
    endDate: '2024-02-29',
    usageLimit: 1000,
    usedCount: 45,
    status: 'active'
  },
  {
    _id: '2',
    name: 'Mua 2 tặng 1',
    code: 'BUY2GET1',
    description: 'Mua 2 sản phẩm tặng 1 sản phẩm cùng loại',
    type: 'buy_x_get_y',
    value: 1,
    minOrderValue: 0,
    maxDiscount: 0,
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    usageLimit: 500,
    usedCount: 23,
    status: 'active'
  }
];

// Order Controllers
const getOrders = async (req, res) => {
  try {
    logger.info('Fetching orders');
    
    const { page = 1, limit = 10, status = '', paymentStatus = '', startDate = '', endDate = '' } = req.query;
    
    let filteredOrders = mockOrders;
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    if (paymentStatus) {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus);
    }
    
    if (startDate && endDate) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderDate >= startDate && order.orderDate <= endDate
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    return successResponse(res, {
      orders: paginatedOrders,
      total: filteredOrders.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredOrders.length / limit)
    }, 'Orders retrieved successfully');
  } catch (error) {
    logger.error('Error fetching orders:', error);
    return errorResponse(res, 'Failed to fetch orders', 500);
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = mockOrders.find(ord => ord._id === id);
    
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }
    
    return successResponse(res, { order }, 'Order retrieved successfully');
  } catch (error) {
    logger.error('Error fetching order:', error);
    return errorResponse(res, 'Failed to fetch order', 500);
  }
};

const createOrder = async (req, res) => {
  try {
    const { customer, items, tax, discount, shippingAddress, notes } = req.body;
    
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const total = subtotal + (tax || 0) - (discount || 0);
    
    const newOrder = {
      _id: (mockOrders.length + 1).toString(),
      orderNumber: `ORD-2024-${String(mockOrders.length + 1).padStart(3, '0')}`,
      customer,
      items: items.map(item => ({
        ...item,
        total: item.quantity * item.price
      })),
      subtotal,
      tax: tax || 0,
      discount: discount || 0,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: shippingAddress || customer.address,
      notes: notes || '',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    mockOrders.push(newOrder);
    
    logger.info(`Order created: ${newOrder.orderNumber}`);
    return successResponse(res, { order: newOrder }, 'Order created successfully', 201);
  } catch (error) {
    logger.error('Error creating order:', error);
    return errorResponse(res, 'Failed to create order', 500);
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const orderIndex = mockOrders.findIndex(ord => ord._id === id);
    if (orderIndex === -1) {
      return errorResponse(res, 'Order not found', 404);
    }
    
    // Recalculate totals if items are updated
    if (updates.items) {
      const subtotal = updates.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      updates.subtotal = subtotal;
      updates.total = subtotal + (updates.tax || mockOrders[orderIndex].tax || 0) - (updates.discount || mockOrders[orderIndex].discount || 0);
      updates.items = updates.items.map(item => ({
        ...item,
        total: item.quantity * item.price
      }));
    }
    
    mockOrders[orderIndex] = { ...mockOrders[orderIndex], ...updates };
    
    logger.info(`Order updated: ${id}`);
    return successResponse(res, { order: mockOrders[orderIndex] }, 'Order updated successfully');
  } catch (error) {
    logger.error('Error updating order:', error);
    return errorResponse(res, 'Failed to update order', 500);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderIndex = mockOrders.findIndex(ord => ord._id === id);
    if (orderIndex === -1) {
      return errorResponse(res, 'Order not found', 404);
    }
    
    // Only allow deletion of pending orders
    if (mockOrders[orderIndex].status !== 'pending') {
      return errorResponse(res, 'Cannot delete order that is not pending', 400);
    }
    
    mockOrders.splice(orderIndex, 1);
    
    logger.info(`Order deleted: ${id}`);
    return successResponse(res, null, 'Order deleted successfully');
  } catch (error) {
    logger.error('Error deleting order:', error);
    return errorResponse(res, 'Failed to delete order', 500);
  }
};

// Customer Controllers
const getCustomers = async (req, res) => {
  try {
    logger.info('Fetching customers');
    
    const { page = 1, limit = 10, search = '', type = '', status = '' } = req.query;
    
    let filteredCustomers = mockCustomers;
    
    if (search) {
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
      );
    }
    
    if (type) {
      filteredCustomers = filteredCustomers.filter(customer => customer.type === type);
    }
    
    if (status) {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    return successResponse(res, {
      customers: paginatedCustomers,
      total: filteredCustomers.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredCustomers.length / limit)
    }, 'Customers retrieved successfully');
  } catch (error) {
    logger.error('Error fetching customers:', error);
    return errorResponse(res, 'Failed to fetch customers', 500);
  }
};

const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = mockCustomers.find(cust => cust._id === id);
    
    if (!customer) {
      return errorResponse(res, 'Customer not found', 404);
    }
    
    // Get customer's order history
    const customerOrders = mockOrders.filter(order => 
      order.customer.email === customer.email
    );
    
    const customerData = {
      ...customer,
      orderHistory: customerOrders
    };
    
    return successResponse(res, { customer: customerData }, 'Customer retrieved successfully');
  } catch (error) {
    logger.error('Error fetching customer:', error);
    return errorResponse(res, 'Failed to fetch customer', 500);
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, type, taxCode, creditLimit } = req.body;
    
    const newCustomer = {
      _id: (mockCustomers.length + 1).toString(),
      name,
      email,
      phone,
      address,
      type: type || 'individual',
      taxCode: taxCode || '',
      creditLimit: creditLimit || 0,
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
      registrationDate: new Date().toISOString().split('T')[0],
      lastOrderDate: null
    };
    
    mockCustomers.push(newCustomer);
    
    logger.info(`Customer created: ${name}`);
    return successResponse(res, { customer: newCustomer }, 'Customer created successfully', 201);
  } catch (error) {
    logger.error('Error creating customer:', error);
    return errorResponse(res, 'Failed to create customer', 500);
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const customerIndex = mockCustomers.findIndex(cust => cust._id === id);
    if (customerIndex === -1) {
      return errorResponse(res, 'Customer not found', 404);
    }
    
    mockCustomers[customerIndex] = { ...mockCustomers[customerIndex], ...updates };
    
    logger.info(`Customer updated: ${id}`);
    return successResponse(res, { customer: mockCustomers[customerIndex] }, 'Customer updated successfully');
  } catch (error) {
    logger.error('Error updating customer:', error);
    return errorResponse(res, 'Failed to update customer', 500);
  }
};

// Promotion Controllers
const getPromotions = async (req, res) => {
  try {
    logger.info('Fetching promotions');
    
    const { page = 1, limit = 10, status = '', type = '' } = req.query;
    
    let filteredPromotions = mockPromotions;
    
    if (status) {
      filteredPromotions = filteredPromotions.filter(promo => promo.status === status);
    }
    
    if (type) {
      filteredPromotions = filteredPromotions.filter(promo => promo.type === type);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPromotions = filteredPromotions.slice(startIndex, endIndex);
    
    return successResponse(res, {
      promotions: paginatedPromotions,
      total: filteredPromotions.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredPromotions.length / limit)
    }, 'Promotions retrieved successfully');
  } catch (error) {
    logger.error('Error fetching promotions:', error);
    return errorResponse(res, 'Failed to fetch promotions', 500);
  }
};

const getPromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = mockPromotions.find(promo => promo._id === id);
    
    if (!promotion) {
      return errorResponse(res, 'Promotion not found', 404);
    }
    
    return successResponse(res, { promotion }, 'Promotion retrieved successfully');
  } catch (error) {
    logger.error('Error fetching promotion:', error);
    return errorResponse(res, 'Failed to fetch promotion', 500);
  }
};

const createPromotion = async (req, res) => {
  try {
    const { name, code, description, type, value, minOrderValue, maxDiscount, startDate, endDate, usageLimit } = req.body;
    
    const newPromotion = {
      _id: (mockPromotions.length + 1).toString(),
      name,
      code: code || `PROMO${Date.now()}`,
      description,
      type,
      value,
      minOrderValue: minOrderValue || 0,
      maxDiscount: maxDiscount || 0,
      startDate,
      endDate,
      usageLimit: usageLimit || 0,
      usedCount: 0,
      status: 'active'
    };
    
    mockPromotions.push(newPromotion);
    
    logger.info(`Promotion created: ${name}`);
    return successResponse(res, { promotion: newPromotion }, 'Promotion created successfully', 201);
  } catch (error) {
    logger.error('Error creating promotion:', error);
    return errorResponse(res, 'Failed to create promotion', 500);
  }
};

const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const promotionIndex = mockPromotions.findIndex(promo => promo._id === id);
    if (promotionIndex === -1) {
      return errorResponse(res, 'Promotion not found', 404);
    }
    
    mockPromotions[promotionIndex] = { ...mockPromotions[promotionIndex], ...updates };
    
    logger.info(`Promotion updated: ${id}`);
    return successResponse(res, { promotion: mockPromotions[promotionIndex] }, 'Promotion updated successfully');
  } catch (error) {
    logger.error('Error updating promotion:', error);
    return errorResponse(res, 'Failed to update promotion', 500);
  }
};

// Sales Reports
const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    let filteredOrders = mockOrders.filter(order => order.paymentStatus === 'paid');
    
    if (startDate && endDate) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderDate >= startDate && order.orderDate <= endDate
      );
    }
    
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Group by period
    const revenueByPeriod = filteredOrders.reduce((acc, order) => {
      const period = groupBy === 'month' 
        ? order.orderDate.substring(0, 7) 
        : order.orderDate;
      
      if (!acc[period]) {
        acc[period] = { period, revenue: 0, orders: 0 };
      }
      
      acc[period].revenue += order.total;
      acc[period].orders += 1;
      
      return acc;
    }, {});
    
    const report = {
      period: { startDate, endDate },
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue
      },
      revenueByPeriod: Object.values(revenueByPeriod),
      orders: filteredOrders
    };
    
    return successResponse(res, report, 'Revenue report generated successfully');
  } catch (error) {
    logger.error('Error generating revenue report:', error);
    return errorResponse(res, 'Failed to generate revenue report', 500);
  }
};

const getProductReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filteredOrders = mockOrders;
    
    if (startDate && endDate) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderDate >= startDate && order.orderDate <= endDate
      );
    }
    
    // Aggregate product sales
    const productSales = {};
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            name: item.name,
            totalQuantity: 0,
            totalRevenue: 0,
            orderCount: 0
          };
        }
        
        productSales[item.productId].totalQuantity += item.quantity;
        productSales[item.productId].totalRevenue += item.total;
        productSales[item.productId].orderCount += 1;
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);
    
    const report = {
      period: { startDate, endDate },
      topProducts,
      totalProductsSold: Object.keys(productSales).length,
      totalQuantitySold: Object.values(productSales).reduce((sum, prod) => sum + prod.totalQuantity, 0),
      totalRevenue: Object.values(productSales).reduce((sum, prod) => sum + prod.totalRevenue, 0)
    };
    
    return successResponse(res, report, 'Product report generated successfully');
  } catch (error) {
    logger.error('Error generating product report:', error);
    return errorResponse(res, 'Failed to generate product report', 500);
  }
};

const getCustomerReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filteredOrders = mockOrders;
    
    if (startDate && endDate) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderDate >= startDate && order.orderDate <= endDate
      );
    }
    
    // Aggregate customer data
    const customerData = {};
    
    filteredOrders.forEach(order => {
      const customerEmail = order.customer.email;
      
      if (!customerData[customerEmail]) {
        customerData[customerEmail] = {
          name: order.customer.name,
          email: customerEmail,
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0
        };
      }
      
      customerData[customerEmail].totalOrders += 1;
      customerData[customerEmail].totalSpent += order.total;
    });
    
    // Calculate average order value
    Object.values(customerData).forEach(customer => {
      customer.averageOrderValue = customer.totalSpent / customer.totalOrders;
    });
    
    const topCustomers = Object.values(customerData)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
    
    const report = {
      period: { startDate, endDate },
      topCustomers,
      totalCustomers: Object.keys(customerData).length,
      totalRevenue: Object.values(customerData).reduce((sum, cust) => sum + cust.totalSpent, 0),
      averageCustomerValue: Object.values(customerData).reduce((sum, cust) => sum + cust.totalSpent, 0) / Object.keys(customerData).length
    };
    
    return successResponse(res, report, 'Customer report generated successfully');
  } catch (error) {
    logger.error('Error generating customer report:', error);
    return errorResponse(res, 'Failed to generate customer report', 500);
  }
};

// Sales Stats
const getSalesStats = async (req, res) => {
  try {
    const totalOrders = mockOrders.length;
    const completedOrders = mockOrders.filter(order => order.status === 'delivered').length;
    const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;
    const processingOrders = mockOrders.filter(order => order.status === 'processing').length;
    
    const totalRevenue = mockOrders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0);
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const totalCustomers = mockCustomers.length;
    const activeCustomers = mockCustomers.filter(cust => cust.status === 'active').length;
    
    const totalPromotions = mockPromotions.length;
    const activePromotions = mockPromotions.filter(promo => promo.status === 'active').length;
    
    const stats = {
      orders: {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
        processing: processingOrders
      },
      revenue: {
        total: totalRevenue,
        averageOrderValue,
        monthlyGrowth: 15.5 // Mock data
      },
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        newThisMonth: 12 // Mock data
      },
      promotions: {
        total: totalPromotions,
        active: activePromotions
      },
      topProducts: [
        { name: 'Laptop Dell XPS 13', sales: 25, revenue: 625000000 },
        { name: 'Bàn làm việc gỗ', sales: 15, revenue: 45000000 }
      ],
      recentOrders: mockOrders
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 5)
    };
    
    return successResponse(res, stats, 'Sales statistics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching sales stats:', error);
    return errorResponse(res, 'Failed to fetch sales statistics', 500);
  }
};

module.exports = {
  // Orders
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  
  // Customers
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  
  // Promotions
  getPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  
  // Reports
  getRevenueReport,
  getProductReport,
  getCustomerReport,
  
  // Stats
  getSalesStats
};
