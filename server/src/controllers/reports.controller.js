const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// Mock data for comprehensive reports
const mockReportTemplates = [
  {
    _id: '1',
    name: 'Báo cáo doanh thu hàng tháng',
    type: 'revenue',
    description: 'Báo cáo tổng hợp doanh thu theo tháng',
    parameters: ['startDate', 'endDate', 'department'],
    format: 'pdf',
    schedule: 'monthly',
    isActive: true
  },
  {
    _id: '2',
    name: 'Báo cáo nhân sự',
    type: 'hr',
    description: 'Báo cáo tình hình nhân sự và chấm công',
    parameters: ['month', 'year', 'department'],
    format: 'excel',
    schedule: 'monthly',
    isActive: true
  },
  {
    _id: '3',
    name: 'Báo cáo tồn kho',
    type: 'inventory',
    description: 'Báo cáo tình hình tồn kho và xuất nhập',
    parameters: ['startDate', 'endDate', 'category'],
    format: 'pdf',
    schedule: 'weekly',
    isActive: true
  }
];

const mockReportHistory = [
  {
    _id: '1',
    templateId: '1',
    templateName: 'Báo cáo doanh thu hàng tháng',
    parameters: {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      department: 'all'
    },
    status: 'completed',
    generatedBy: 'Nguyễn Văn A',
    generatedAt: '2024-02-01T09:00:00Z',
    fileUrl: '/reports/revenue-2024-01.pdf',
    fileSize: '2.5MB'
  },
  {
    _id: '2',
    templateId: '2',
    templateName: 'Báo cáo nhân sự',
    parameters: {
      month: 1,
      year: 2024,
      department: 'all'
    },
    status: 'completed',
    generatedBy: 'Trần Thị B',
    generatedAt: '2024-02-01T10:30:00Z',
    fileUrl: '/reports/hr-2024-01.xlsx',
    fileSize: '1.8MB'
  },
  {
    _id: '3',
    templateId: '3',
    templateName: 'Báo cáo tồn kho',
    parameters: {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      category: 'all'
    },
    status: 'processing',
    generatedBy: 'Lê Văn C',
    generatedAt: '2024-02-01T11:00:00Z',
    fileUrl: null,
    fileSize: null
  }
];

// Report Generation Controllers
const generateReport = async (req, res) => {
  try {
    const { type, parameters, format = 'pdf' } = req.body;
    
    logger.info(`Generating report: ${type}`);
    
    // Simulate report generation
    const reportData = await generateReportData(type, parameters);
    
    const newReport = {
      _id: (mockReportHistory.length + 1).toString(),
      templateId: null,
      templateName: `Custom ${type} Report`,
      parameters,
      status: 'completed',
      generatedBy: 'Current User', // In real app, get from auth
      generatedAt: new Date().toISOString(),
      fileUrl: `/reports/custom-${type}-${Date.now()}.${format}`,
      fileSize: '1.2MB',
      data: reportData
    };
    
    mockReportHistory.push(newReport);
    
    return successResponse(res, { report: newReport }, 'Report generated successfully', 201);
  } catch (error) {
    logger.error('Error generating report:', error);
    return errorResponse(res, 'Failed to generate report', 500);
  }
};

const generateCustomReport = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      dataSource, 
      filters, 
      groupBy, 
      aggregations, 
      format = 'pdf' 
    } = req.body;
    
    logger.info(`Generating custom report: ${title}`);
    
    // Simulate custom report generation
    const reportData = await generateCustomReportData({
      dataSource,
      filters,
      groupBy,
      aggregations
    });
    
    const customReport = {
      _id: (mockReportHistory.length + 1).toString(),
      templateId: null,
      templateName: title,
      description,
      parameters: { filters, groupBy, aggregations },
      status: 'completed',
      generatedBy: 'Current User',
      generatedAt: new Date().toISOString(),
      fileUrl: `/reports/custom-${Date.now()}.${format}`,
      fileSize: '2.1MB',
      data: reportData
    };
    
    mockReportHistory.push(customReport);
    
    return successResponse(res, { report: customReport }, 'Custom report generated successfully', 201);
  } catch (error) {
    logger.error('Error generating custom report:', error);
    return errorResponse(res, 'Failed to generate custom report', 500);
  }
};

// Report Template Controllers
const getReportTemplates = async (req, res) => {
  try {
    logger.info('Fetching report templates');
    
    const { type = '', isActive = '' } = req.query;
    
    let filteredTemplates = mockReportTemplates;
    
    if (type) {
      filteredTemplates = filteredTemplates.filter(template => template.type === type);
    }
    
    if (isActive !== '') {
      filteredTemplates = filteredTemplates.filter(template => 
        template.isActive === (isActive === 'true')
      );
    }
    
    return successResponse(res, { templates: filteredTemplates }, 'Report templates retrieved successfully');
  } catch (error) {
    logger.error('Error fetching report templates:', error);
    return errorResponse(res, 'Failed to fetch report templates', 500);
  }
};

const getReportTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = mockReportTemplates.find(temp => temp._id === id);
    
    if (!template) {
      return errorResponse(res, 'Report template not found', 404);
    }
    
    return successResponse(res, { template }, 'Report template retrieved successfully');
  } catch (error) {
    logger.error('Error fetching report template:', error);
    return errorResponse(res, 'Failed to fetch report template', 500);
  }
};

const createReportTemplate = async (req, res) => {
  try {
    const { name, type, description, parameters, format, schedule } = req.body;
    
    const newTemplate = {
      _id: (mockReportTemplates.length + 1).toString(),
      name,
      type,
      description,
      parameters: parameters || [],
      format: format || 'pdf',
      schedule: schedule || 'manual',
      isActive: true
    };
    
    mockReportTemplates.push(newTemplate);
    
    logger.info(`Report template created: ${name}`);
    return successResponse(res, { template: newTemplate }, 'Report template created successfully', 201);
  } catch (error) {
    logger.error('Error creating report template:', error);
    return errorResponse(res, 'Failed to create report template', 500);
  }
};

const updateReportTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const templateIndex = mockReportTemplates.findIndex(temp => temp._id === id);
    if (templateIndex === -1) {
      return errorResponse(res, 'Report template not found', 404);
    }
    
    mockReportTemplates[templateIndex] = { ...mockReportTemplates[templateIndex], ...updates };
    
    logger.info(`Report template updated: ${id}`);
    return successResponse(res, { template: mockReportTemplates[templateIndex] }, 'Report template updated successfully');
  } catch (error) {
    logger.error('Error updating report template:', error);
    return errorResponse(res, 'Failed to update report template', 500);
  }
};

const deleteReportTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const templateIndex = mockReportTemplates.findIndex(temp => temp._id === id);
    if (templateIndex === -1) {
      return errorResponse(res, 'Report template not found', 404);
    }
    
    mockReportTemplates.splice(templateIndex, 1);
    
    logger.info(`Report template deleted: ${id}`);
    return successResponse(res, null, 'Report template deleted successfully');
  } catch (error) {
    logger.error('Error deleting report template:', error);
    return errorResponse(res, 'Failed to delete report template', 500);
  }
};

// Report History Controllers
const getReportHistory = async (req, res) => {
  try {
    logger.info('Fetching report history');
    
    const { page = 1, limit = 10, status = '', type = '', startDate = '', endDate = '' } = req.query;
    
    let filteredHistory = mockReportHistory;
    
    if (status) {
      filteredHistory = filteredHistory.filter(report => report.status === status);
    }
    
    if (type) {
      filteredHistory = filteredHistory.filter(report => 
        report.templateName.toLowerCase().includes(type.toLowerCase())
      );
    }
    
    if (startDate && endDate) {
      filteredHistory = filteredHistory.filter(report => 
        report.generatedAt >= startDate && report.generatedAt <= endDate
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);
    
    return successResponse(res, {
      reports: paginatedHistory,
      total: filteredHistory.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredHistory.length / limit)
    }, 'Report history retrieved successfully');
  } catch (error) {
    logger.error('Error fetching report history:', error);
    return errorResponse(res, 'Failed to fetch report history', 500);
  }
};

const getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = mockReportHistory.find(rep => rep._id === id);
    
    if (!report) {
      return errorResponse(res, 'Report not found', 404);
    }
    
    return successResponse(res, { report }, 'Report retrieved successfully');
  } catch (error) {
    logger.error('Error fetching report:', error);
    return errorResponse(res, 'Failed to fetch report', 500);
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reportIndex = mockReportHistory.findIndex(rep => rep._id === id);
    if (reportIndex === -1) {
      return errorResponse(res, 'Report not found', 404);
    }
    
    mockReportHistory.splice(reportIndex, 1);
    
    logger.info(`Report deleted: ${id}`);
    return successResponse(res, null, 'Report deleted successfully');
  } catch (error) {
    logger.error('Error deleting report:', error);
    return errorResponse(res, 'Failed to delete report', 500);
  }
};

// Reports Overview
const getReportsOverview = async (req, res) => {
  try {
    const totalTemplates = mockReportTemplates.length;
    const activeTemplates = mockReportTemplates.filter(temp => temp.isActive).length;
    
    const totalReports = mockReportHistory.length;
    const completedReports = mockReportHistory.filter(rep => rep.status === 'completed').length;
    const processingReports = mockReportHistory.filter(rep => rep.status === 'processing').length;
    const failedReports = mockReportHistory.filter(rep => rep.status === 'failed').length;
    
    const recentReports = mockReportHistory
      .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
      .slice(0, 5);
    
    const reportsByType = mockReportHistory.reduce((acc, report) => {
      const type = report.templateName.split(' ')[1] || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const monthlyReports = mockReportHistory.reduce((acc, report) => {
      const month = new Date(report.generatedAt).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    
    const overview = {
      templates: {
        total: totalTemplates,
        active: activeTemplates,
        inactive: totalTemplates - activeTemplates
      },
      reports: {
        total: totalReports,
        completed: completedReports,
        processing: processingReports,
        failed: failedReports
      },
      recentReports,
      reportsByType,
      monthlyTrend: Object.entries(monthlyReports).map(([month, count]) => ({
        month,
        count
      })),
      popularTemplates: mockReportTemplates
        .map(template => ({
          ...template,
          usageCount: mockReportHistory.filter(rep => rep.templateId === template._id).length
        }))
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5)
    };
    
    return successResponse(res, overview, 'Reports overview retrieved successfully');
  } catch (error) {
    logger.error('Error fetching reports overview:', error);
    return errorResponse(res, 'Failed to fetch reports overview', 500);
  }
};

// Helper functions for report generation
const generateReportData = async (type, parameters) => {
  // Simulate different report types
  switch (type) {
    case 'revenue':
      return {
        totalRevenue: 500000000,
        totalOrders: 150,
        averageOrderValue: 3333333,
        topProducts: [
          { name: 'Laptop Dell XPS 13', revenue: 250000000, quantity: 10 },
          { name: 'Bàn làm việc gỗ', revenue: 45000000, quantity: 15 }
        ],
        monthlyTrend: [
          { month: '2024-01', revenue: 500000000 }
        ]
      };
    
    case 'hr':
      return {
        totalEmployees: 25,
        presentToday: 23,
        averageWorkingHours: 8.2,
        departmentStats: [
          { department: 'IT', employees: 10, attendance: 95 },
          { department: 'Sales', employees: 8, attendance: 92 }
        ],
        payrollSummary: {
          totalSalary: 450000000,
          averageSalary: 18000000
        }
      };
    
    case 'inventory':
      return {
        totalProducts: 50,
        totalStockValue: 2000000000,
        lowStockItems: 5,
        topMovingProducts: [
          { name: 'Laptop Dell XPS 13', movement: 25 },
          { name: 'Bàn làm việc gỗ', movement: 15 }
        ],
        categoryDistribution: {
          'Electronics': 20,
          'Furniture': 15,
          'Office Supplies': 15
        }
      };
    
    case 'sales':
      return {
        totalSales: 750000000,
        totalCustomers: 120,
        conversionRate: 15.5,
        topCustomers: [
          { name: 'Công ty ABC', spent: 100000000 },
          { name: 'Nguyễn Văn A', spent: 50000000 }
        ],
        salesByChannel: {
          'Online': 60,
          'Store': 40
        }
      };
    
    default:
      return {
        message: 'Report data generated successfully',
        timestamp: new Date().toISOString()
      };
  }
};

const generateCustomReportData = async (config) => {
  // Simulate custom report data generation based on configuration
  return {
    dataSource: config.dataSource,
    totalRecords: 1000,
    filteredRecords: 750,
    aggregations: config.aggregations || {},
    groupedData: [
      { group: 'Group 1', value: 100, percentage: 40 },
      { group: 'Group 2', value: 75, percentage: 30 },
      { group: 'Group 3', value: 50, percentage: 20 },
      { group: 'Others', value: 25, percentage: 10 }
    ],
    summary: {
      total: 250,
      average: 62.5,
      min: 25,
      max: 100
    },
    generatedAt: new Date().toISOString()
  };
};

module.exports = {
  // Report Generation
  generateReport,
  generateCustomReport,
  
  // Templates
  getReportTemplates,
  getReportTemplate,
  createReportTemplate,
  updateReportTemplate,
  deleteReportTemplate,
  
  // History
  getReportHistory,
  getReport,
  deleteReport,
  
  // Overview
  getReportsOverview
};
