const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// Mock data for development
const mockProducts = [
  {
    _id: '1',
    name: 'Laptop Dell XPS 13',
    sku: 'DELL-XPS-13-001',
    description: 'Laptop cao cấp cho doanh nhân',
    category: 'Electronics',
    unit: 'piece',
    price: {
      cost: 20000000,
      selling: 25000000
    },
    stock: {
      current: 15,
      minimum: 5,
      maximum: 50
    },
    supplier: {
      name: 'Dell Vietnam',
      contact: 'dell@vietnam.com',
      phone: '0123456789'
    },
    status: 'active'
  },
  {
    _id: '2',
    name: 'Bàn làm việc gỗ',
    sku: 'DESK-WOOD-001',
    description: 'Bàn làm việc gỗ tự nhiên',
    category: 'Furniture',
    unit: 'piece',
    price: {
      cost: 2000000,
      selling: 3000000
    },
    stock: {
      current: 8,
      minimum: 3,
      maximum: 20
    },
    supplier: {
      name: 'Nội thất Hoàng Gia',
      contact: 'info@hoanggia.com',
      phone: '0987654321'
    },
    status: 'active'
  }
];

const mockStockMovements = [
  {
    _id: '1',
    product: 'Laptop Dell XPS 13',
    productId: '1',
    type: 'in',
    quantity: 10,
    reason: 'Purchase from supplier',
    reference: 'PO-2024-001',
    date: '2024-01-15',
    employee: 'Nguyễn Văn A'
  },
  {
    _id: '2',
    product: 'Laptop Dell XPS 13',
    productId: '1',
    type: 'out',
    quantity: 2,
    reason: 'Sale to customer',
    reference: 'SO-2024-001',
    date: '2024-01-16',
    employee: 'Trần Thị B'
  },
  {
    _id: '3',
    product: 'Bàn làm việc gỗ',
    productId: '2',
    type: 'in',
    quantity: 5,
    reason: 'Purchase from supplier',
    reference: 'PO-2024-002',
    date: '2024-01-14',
    employee: 'Nguyễn Văn A'
  }
];

const mockSuppliers = [
  {
    _id: '1',
    name: 'Dell Vietnam',
    code: 'DELL-VN',
    contact: {
      email: 'dell@vietnam.com',
      phone: '0123456789',
      address: '123 Nguyễn Huệ, Q1, TP.HCM'
    },
    products: ['Laptop Dell XPS 13', 'Laptop Dell Inspiron'],
    status: 'active',
    rating: 4.5
  },
  {
    _id: '2',
    name: 'Nội thất Hoàng Gia',
    code: 'HGIA-NT',
    contact: {
      email: 'info@hoanggia.com',
      phone: '0987654321',
      address: '456 Lê Lợi, Q3, TP.HCM'
    },
    products: ['Bàn làm việc gỗ', 'Ghế văn phòng'],
    status: 'active',
    rating: 4.2
  }
];

// Product Controllers
const getProducts = async (req, res) => {
  try {
    logger.info('Fetching products');
    
    const { page = 1, limit = 10, search = '', category = '', status = '' } = req.query;
    
    let filteredProducts = mockProducts;
    
    if (search) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    if (status) {
      filteredProducts = filteredProducts.filter(product => product.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return successResponse(res, {
      products: paginatedProducts,
      total: filteredProducts.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredProducts.length / limit)
    }, 'Products retrieved successfully');
  } catch (error) {
    logger.error('Error fetching products:', error);
    return errorResponse(res, 'Failed to fetch products', 500);
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = mockProducts.find(prod => prod._id === id);
    
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }
    
    return successResponse(res, { product }, 'Product retrieved successfully');
  } catch (error) {
    logger.error('Error fetching product:', error);
    return errorResponse(res, 'Failed to fetch product', 500);
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, description, category, unit, price, stock, supplier } = req.body;
    
    const newProduct = {
      _id: (mockProducts.length + 1).toString(),
      name,
      sku: sku || `SKU-${Date.now()}`,
      description,
      category,
      unit: unit || 'piece',
      price: {
        cost: price.cost || 0,
        selling: price.selling || 0
      },
      stock: {
        current: stock.current || 0,
        minimum: stock.minimum || 0,
        maximum: stock.maximum || 100
      },
      supplier: supplier || {},
      status: 'active'
    };
    
    mockProducts.push(newProduct);
    
    logger.info(`Product created: ${name}`);
    return successResponse(res, { product: newProduct }, 'Product created successfully', 201);
  } catch (error) {
    logger.error('Error creating product:', error);
    return errorResponse(res, 'Failed to create product', 500);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const productIndex = mockProducts.findIndex(prod => prod._id === id);
    if (productIndex === -1) {
      return errorResponse(res, 'Product not found', 404);
    }
    
    mockProducts[productIndex] = { ...mockProducts[productIndex], ...updates };
    
    logger.info(`Product updated: ${id}`);
    return successResponse(res, { product: mockProducts[productIndex] }, 'Product updated successfully');
  } catch (error) {
    logger.error('Error updating product:', error);
    return errorResponse(res, 'Failed to update product', 500);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const productIndex = mockProducts.findIndex(prod => prod._id === id);
    if (productIndex === -1) {
      return errorResponse(res, 'Product not found', 404);
    }
    
    mockProducts.splice(productIndex, 1);
    
    logger.info(`Product deleted: ${id}`);
    return successResponse(res, null, 'Product deleted successfully');
  } catch (error) {
    logger.error('Error deleting product:', error);
    return errorResponse(res, 'Failed to delete product', 500);
  }
};

// Stock Controllers
const getStock = async (req, res) => {
  try {
    logger.info('Fetching stock levels');
    
    const { lowStock = false } = req.query;
    
    let stockData = mockProducts.map(product => ({
      _id: product._id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      currentStock: product.stock.current,
      minimumStock: product.stock.minimum,
      maximumStock: product.stock.maximum,
      status: product.stock.current <= product.stock.minimum ? 'low' : 'normal',
      value: product.stock.current * product.price.cost
    }));
    
    if (lowStock === 'true') {
      stockData = stockData.filter(item => item.status === 'low');
    }
    
    const totalValue = stockData.reduce((sum, item) => sum + item.value, 0);
    const lowStockItems = stockData.filter(item => item.status === 'low').length;
    
    return successResponse(res, {
      stock: stockData,
      summary: {
        totalItems: stockData.length,
        totalValue,
        lowStockItems
      }
    }, 'Stock levels retrieved successfully');
  } catch (error) {
    logger.error('Error fetching stock:', error);
    return errorResponse(res, 'Failed to fetch stock levels', 500);
  }
};

const stockIn = async (req, res) => {
  try {
    const { productId, quantity, reason, reference } = req.body;
    
    // Nếu productId không tồn tại hoặc không hợp lệ, tạo sản phẩm mới
    let productIndex = mockProducts.findIndex(prod => prod._id === productId);
    
    if (productIndex === -1) {
      // Tạo sản phẩm mới nếu không tìm thấy
      const newProduct = {
        _id: (mockProducts.length + 1).toString(),
        name: `Product ${mockProducts.length + 1}`,
        sku: `SKU-${Date.now()}`,
        description: 'Auto-created product',
        category: 'Other',
        unit: 'piece',
        price: {
          cost: 0,
          selling: 0
        },
        stock: {
          current: 0,
          minimum: 0,
          maximum: 100
        },
        supplier: {},
        status: 'active'
      };
      
      mockProducts.push(newProduct);
      productIndex = mockProducts.length - 1;
      logger.info(`Auto-created product: ${newProduct.name}`);
    }
    
    // Update product stock
    mockProducts[productIndex].stock.current += quantity;
    
    // Create stock movement record
    const newMovement = {
      _id: (mockStockMovements.length + 1).toString(),
      product: mockProducts[productIndex].name,
      productId,
      type: 'in',
      quantity,
      reason: reason || 'Stock in',
      reference: reference || `SI-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      employee: 'Current User' // In real app, get from auth
    };
    
    mockStockMovements.push(newMovement);
    
    logger.info(`Stock in recorded: ${quantity} units of ${mockProducts[productIndex].name}`);
    return successResponse(res, { 
      movement: newMovement,
      updatedStock: mockProducts[productIndex].stock.current
    }, 'Stock in recorded successfully', 201);
  } catch (error) {
    logger.error('Error recording stock in:', error);
    return errorResponse(res, 'Failed to record stock in', 500);
  }
};

const stockOut = async (req, res) => {
  try {
    const { productId, quantity, reason, reference } = req.body;
    
    const productIndex = mockProducts.findIndex(prod => prod._id === productId);
    if (productIndex === -1) {
      return errorResponse(res, 'Product not found', 404);
    }
    
    // Check if enough stock available
    if (mockProducts[productIndex].stock.current < quantity) {
      return errorResponse(res, 'Insufficient stock available', 400);
    }
    
    // Update product stock
    mockProducts[productIndex].stock.current -= quantity;
    
    // Create stock movement record
    const newMovement = {
      _id: (mockStockMovements.length + 1).toString(),
      product: mockProducts[productIndex].name,
      productId,
      type: 'out',
      quantity,
      reason: reason || 'Stock out',
      reference: reference || `SO-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      employee: 'Current User' // In real app, get from auth
    };
    
    mockStockMovements.push(newMovement);
    
    logger.info(`Stock out recorded: ${quantity} units of ${mockProducts[productIndex].name}`);
    return successResponse(res, { 
      movement: newMovement,
      updatedStock: mockProducts[productIndex].stock.current
    }, 'Stock out recorded successfully', 201);
  } catch (error) {
    logger.error('Error recording stock out:', error);
    return errorResponse(res, 'Failed to record stock out', 500);
  }
};

const getStockMovements = async (req, res) => {
  try {
    logger.info('Fetching stock movements');
    
    const { page = 1, limit = 10, type = '', productId = '', startDate = '', endDate = '' } = req.query;
    
    let filteredMovements = mockStockMovements;
    
    if (type) {
      filteredMovements = filteredMovements.filter(movement => movement.type === type);
    }
    
    if (productId) {
      filteredMovements = filteredMovements.filter(movement => movement.productId === productId);
    }
    
    if (startDate && endDate) {
      filteredMovements = filteredMovements.filter(movement => 
        movement.date >= startDate && movement.date <= endDate
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMovements = filteredMovements.slice(startIndex, endIndex);
    
    return successResponse(res, {
      movements: paginatedMovements,
      total: filteredMovements.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredMovements.length / limit)
    }, 'Stock movements retrieved successfully');
  } catch (error) {
    logger.error('Error fetching stock movements:', error);
    return errorResponse(res, 'Failed to fetch stock movements', 500);
  }
};

const getStockReport = async (req, res) => {
  try {
    const { startDate, endDate, productId } = req.query;
    
    let filteredMovements = mockStockMovements;
    
    if (startDate && endDate) {
      filteredMovements = filteredMovements.filter(movement => 
        movement.date >= startDate && movement.date <= endDate
      );
    }
    
    if (productId) {
      filteredMovements = filteredMovements.filter(movement => movement.productId === productId);
    }
    
    const stockIn = filteredMovements
      .filter(movement => movement.type === 'in')
      .reduce((sum, movement) => sum + movement.quantity, 0);
    
    const stockOut = filteredMovements
      .filter(movement => movement.type === 'out')
      .reduce((sum, movement) => sum + movement.quantity, 0);
    
    const netMovement = stockIn - stockOut;
    
    const report = {
      period: { startDate, endDate },
      summary: {
        totalStockIn: stockIn,
        totalStockOut: stockOut,
        netMovement,
        totalMovements: filteredMovements.length
      },
      movements: filteredMovements,
      currentStock: mockProducts.map(product => ({
        name: product.name,
        sku: product.sku,
        currentStock: product.stock.current,
        value: product.stock.current * product.price.cost
      }))
    };
    
    return successResponse(res, report, 'Stock report generated successfully');
  } catch (error) {
    logger.error('Error generating stock report:', error);
    return errorResponse(res, 'Failed to generate stock report', 500);
  }
};

// Supplier Controllers
const getSuppliers = async (req, res) => {
  try {
    logger.info('Fetching suppliers');
    
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    let filteredSuppliers = mockSuppliers;
    
    if (search) {
      filteredSuppliers = filteredSuppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.code.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status) {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);
    
    return successResponse(res, {
      suppliers: paginatedSuppliers,
      total: filteredSuppliers.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredSuppliers.length / limit)
    }, 'Suppliers retrieved successfully');
  } catch (error) {
    logger.error('Error fetching suppliers:', error);
    return errorResponse(res, 'Failed to fetch suppliers', 500);
  }
};

const getSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = mockSuppliers.find(sup => sup._id === id);
    
    if (!supplier) {
      return errorResponse(res, 'Supplier not found', 404);
    }
    
    return successResponse(res, { supplier }, 'Supplier retrieved successfully');
  } catch (error) {
    logger.error('Error fetching supplier:', error);
    return errorResponse(res, 'Failed to fetch supplier', 500);
  }
};

const createSupplier = async (req, res) => {
  try {
    const { name, code, contact, products } = req.body;
    
    const newSupplier = {
      _id: (mockSuppliers.length + 1).toString(),
      name,
      code: code || `SUP-${Date.now()}`,
      contact,
      products: products || [],
      status: 'active',
      rating: 0
    };
    
    mockSuppliers.push(newSupplier);
    
    logger.info(`Supplier created: ${name}`);
    return successResponse(res, { supplier: newSupplier }, 'Supplier created successfully', 201);
  } catch (error) {
    logger.error('Error creating supplier:', error);
    return errorResponse(res, 'Failed to create supplier', 500);
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const supplierIndex = mockSuppliers.findIndex(sup => sup._id === id);
    if (supplierIndex === -1) {
      return errorResponse(res, 'Supplier not found', 404);
    }
    
    mockSuppliers[supplierIndex] = { ...mockSuppliers[supplierIndex], ...updates };
    
    logger.info(`Supplier updated: ${id}`);
    return successResponse(res, { supplier: mockSuppliers[supplierIndex] }, 'Supplier updated successfully');
  } catch (error) {
    logger.error('Error updating supplier:', error);
    return errorResponse(res, 'Failed to update supplier', 500);
  }
};

// Inventory Stats
const getInventoryStats = async (req, res) => {
  try {
    const totalProducts = mockProducts.length;
    const activeProducts = mockProducts.filter(prod => prod.status === 'active').length;
    const lowStockProducts = mockProducts.filter(prod => prod.stock.current <= prod.stock.minimum).length;
    
    const totalStockValue = mockProducts.reduce((sum, prod) => 
      sum + (prod.stock.current * prod.price.cost), 0
    );
    
    const totalStockQuantity = mockProducts.reduce((sum, prod) => sum + prod.stock.current, 0);
    
    const categoryDistribution = mockProducts.reduce((acc, prod) => {
      acc[prod.category] = (acc[prod.category] || 0) + 1;
      return acc;
    }, {});
    
    const recentMovements = mockStockMovements
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    const stats = {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalStockValue,
      totalStockQuantity,
      averageProductValue: totalProducts > 0 ? totalStockValue / totalProducts : 0,
      categoryDistribution,
      recentMovements,
      topProducts: mockProducts
        .sort((a, b) => b.stock.current - a.stock.current)
        .slice(0, 5)
        .map(prod => ({
          name: prod.name,
          sku: prod.sku,
          stock: prod.stock.current,
          value: prod.stock.current * prod.price.cost
        }))
    };
    
    return successResponse(res, stats, 'Inventory statistics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching inventory stats:', error);
    return errorResponse(res, 'Failed to fetch inventory statistics', 500);
  }
};

module.exports = {
  // Products
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Stock
  getStock,
  stockIn,
  stockOut,
  getStockMovements,
  getStockReport,
  
  // Suppliers
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  
  // Stats
  getInventoryStats
};
