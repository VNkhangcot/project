const User = require('../models/User');
const Enterprise = require('../models/Enterprise');
const Role = require('../models/Role');
const { 
  sendSuccess, 
  sendError,
  asyncHandler 
} = require('../utils/response');
const { getDateRange } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Get dashboard statistics
 */
const getStats = asyncHandler(async (req, res) => {
  try {
    // Get user stats
    const userStats = await User.getStats();
    
    // Get enterprise stats
    const enterpriseStats = await Enterprise.getStats();
    
    // Get role stats
    const roleStats = await Role.getStats();
    
    // Calculate additional metrics
    const totalUsers = userStats.total;
    const activeUsers = userStats.active;
    const totalEnterprises = enterpriseStats.byStatus.reduce((sum, stat) => sum + stat.count, 0);
    const activeEnterprises = enterpriseStats.byStatus.find(stat => stat._id === 'active')?.count || 0;
    
    // Mock revenue data (replace with actual financial data)
    const totalRevenue = 15000000; // VND
    const monthlyRevenue = 2500000; // VND
    
    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: userStats.inactive,
        suspended: userStats.suspended,
        growth: calculateGrowthRate(totalUsers, 'users') // Mock growth rate
      },
      enterprises: {
        total: totalEnterprises,
        active: activeEnterprises,
        pending: enterpriseStats.byStatus.find(stat => stat._id === 'pending')?.count || 0,
        suspended: enterpriseStats.byStatus.find(stat => stat._id === 'suspended')?.count || 0,
        growth: calculateGrowthRate(totalEnterprises, 'enterprises')
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        growth: calculateGrowthRate(monthlyRevenue, 'revenue')
      },
      roles: {
        total: roleStats.reduce((sum, stat) => sum + stat.totalRoles, 0),
        active: roleStats.reduce((sum, stat) => sum + stat.activeRoles, 0)
      },
      systemHealth: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };

    logger.info('Dashboard stats retrieved', { userId: req.userId });

    return sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');

  } catch (error) {
    logger.error('Error getting dashboard stats:', error);
    return sendError(res, 'Failed to retrieve dashboard statistics', 500);
  }
});

/**
 * Get analytics data
 */
const getAnalytics = asyncHandler(async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // User registration analytics
    const userAnalytics = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Enterprise registration analytics
    const enterpriseAnalytics = await Enterprise.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Business type distribution
    const businessTypeDistribution = await Enterprise.aggregate([
      {
        $group: {
          _id: '$businessType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // User role distribution
    const roleDistribution = await User.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roleInfo'
        }
      },
      {
        $unwind: '$roleInfo'
      },
      {
        $group: {
          _id: '$roleInfo.displayName',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const analytics = {
      period,
      dateRange: { startDate, endDate },
      userRegistrations: userAnalytics,
      enterpriseRegistrations: enterpriseAnalytics,
      businessTypeDistribution,
      roleDistribution,
      summary: {
        totalNewUsers: userAnalytics.reduce((sum, item) => sum + item.count, 0),
        totalNewEnterprises: enterpriseAnalytics.reduce((sum, item) => sum + item.count, 0),
        mostPopularBusinessType: businessTypeDistribution[0]?._id || 'N/A',
        mostCommonRole: roleDistribution[0]?._id || 'N/A'
      }
    };

    logger.info('Analytics data retrieved', { userId: req.userId, period });

    return sendSuccess(res, analytics, 'Analytics data retrieved successfully');

  } catch (error) {
    logger.error('Error getting analytics data:', error);
    return sendError(res, 'Failed to retrieve analytics data', 500);
  }
});

/**
 * Get recent activities
 */
const getRecentActivities = asyncHandler(async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    // Get recent user registrations
    const recentUsers = await User.find()
      .populate('role', 'displayName')
      .sort({ createdAt: -1 })
      .limit(Math.floor(limitNum / 2))
      .select('name email createdAt role');

    // Get recent enterprise registrations
    const recentEnterprises = await Enterprise.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(Math.floor(limitNum / 2))
      .select('name code businessType status createdAt owner');

    // Combine and format activities
    const activities = [];

    recentUsers.forEach(user => {
      activities.push({
        type: 'user_registration',
        title: 'New User Registration',
        description: `${user.name} registered as ${user.role?.displayName || 'User'}`,
        user: {
          name: user.name,
          email: user.email
        },
        timestamp: user.createdAt,
        icon: 'user-plus',
        color: 'green'
      });
    });

    recentEnterprises.forEach(enterprise => {
      activities.push({
        type: 'enterprise_registration',
        title: 'New Enterprise Registration',
        description: `${enterprise.name} (${enterprise.businessType}) registered by ${enterprise.owner?.name}`,
        enterprise: {
          name: enterprise.name,
          code: enterprise.code,
          businessType: enterprise.businessType,
          status: enterprise.status
        },
        user: enterprise.owner ? {
          name: enterprise.owner.name,
          email: enterprise.owner.email
        } : null,
        timestamp: enterprise.createdAt,
        icon: 'building',
        color: 'blue'
      });
    });

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Limit to requested number
    const limitedActivities = activities.slice(0, limitNum);

    logger.info('Recent activities retrieved', { userId: req.userId, count: limitedActivities.length });

    return sendSuccess(res, limitedActivities, 'Recent activities retrieved successfully');

  } catch (error) {
    logger.error('Error getting recent activities:', error);
    return sendError(res, 'Failed to retrieve recent activities', 500);
  }
});

/**
 * Helper function to calculate growth rate (mock implementation)
 */
function calculateGrowthRate(currentValue, type) {
  // This is a mock implementation
  // In a real application, you would compare with previous period data
  const mockGrowthRates = {
    users: 12.5,
    enterprises: 8.3,
    revenue: 15.7
  };
  
  return mockGrowthRates[type] || 0;
}

/**
 * Get server metrics
 */
const getServerMetrics = asyncHandler(async (req, res) => {
  try {
    logger.info('Fetching server metrics', { userId: req.userId });

    // Get actual Node.js process metrics
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Mock server metrics data (in production, use actual system monitoring)
    const metrics = {
      cpu: {
        usage: Math.floor(Math.random() * 100),
        cores: require('os').cpus().length,
        loadAverage: require('os').loadavg()
      },
      memory: {
        total: Math.round(require('os').totalmem() / 1024 / 1024), // MB
        used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        free: Math.round(require('os').freemem() / 1024 / 1024), // MB
        usage: Math.round((memUsage.heapUsed / require('os').totalmem()) * 100)
      },
      disk: {
        total: 500, // GB - mock data
        used: Math.floor(Math.random() * 400),
        free: 100,
        usage: Math.floor(Math.random() * 80)
      },
      network: {
        bytesIn: Math.floor(Math.random() * 1000000),
        bytesOut: Math.floor(Math.random() * 800000),
        packetsIn: Math.floor(Math.random() * 10000),
        packetsOut: Math.floor(Math.random() * 8000)
      },
      uptime: Math.floor(process.uptime()),
      processes: Math.floor(Math.random() * 200) + 50,
      connections: Math.floor(Math.random() * 100) + 10,
      platform: require('os').platform(),
      nodeVersion: process.version,
      hostname: require('os').hostname()
    };

    logger.info('Server metrics retrieved', { userId: req.userId });
    return sendSuccess(res, metrics, 'Server metrics retrieved successfully');

  } catch (error) {
    logger.error('Error fetching server metrics:', error);
    return sendError(res, 'Failed to fetch server metrics', 500);
  }
});

module.exports = {
  getStats,
  getAnalytics,
  getRecentActivities,
  getServerMetrics
};
