const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Role name must be at least 2 characters'],
    maxlength: [50, 'Role name cannot exceed 50 characters']
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    maxlength: [100, 'Display name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  permissions: [{
    type: String,
    enum: [
      // Basic permissions
      'read',
      'write',
      'delete',
      
      // User management
      'manage_users',
      'view_users',
      'create_users',
      'update_users',
      'delete_users',
      
      // Role management
      'manage_roles',
      'view_roles',
      'create_roles',
      'update_roles',
      'delete_roles',
      
      // Enterprise management
      'manage_enterprises',
      'view_enterprises',
      'create_enterprises',
      'update_enterprises',
      'delete_enterprises',
      
      // HR management
      'manage_hr',
      'view_employees',
      'create_employees',
      'update_employees',
      'delete_employees',
      'manage_departments',
      'view_attendance',
      'manage_attendance',
      'manage_recruitment',
      
      // Finance management
      'manage_finance',
      'view_transactions',
      'create_transactions',
      'update_transactions',
      'delete_transactions',
      'manage_invoices',
      'manage_payroll',
      'view_financial_reports',
      
      // Inventory management
      'manage_inventory',
      'view_products',
      'create_products',
      'update_products',
      'delete_products',
      'manage_stock',
      'view_stock_reports',
      
      // Sales management
      'manage_sales',
      'view_orders',
      'create_orders',
      'update_orders',
      'delete_orders',
      'manage_customers',
      'manage_promotions',
      'view_sales_reports',
      
      // Reports and analytics
      'view_analytics',
      'view_reports',
      'create_reports',
      'export_data',
      
      // System management
      'system_settings',
      'audit_logs',
      'security_monitoring',
      'server_monitoring',
      'manage_notifications',
      'manage_subscriptions',
      'manage_business_types',
      
      // Shopping features
      'view_products',
      'manage_cart',
      'place_orders',
      'write_reviews',
      'manage_profile'
    ]
  }],
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  level: {
    type: Number,
    default: 1,
    min: [1, 'Level must be at least 1'],
    max: [10, 'Level cannot exceed 10']
  },
  category: {
    type: String,
    enum: ['system', 'enterprise', 'department', 'employee'],
    default: 'employee'
  },
  metadata: {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
roleSchema.index({ name: 1 });
roleSchema.index({ isActive: 1 });
roleSchema.index({ category: 1 });
roleSchema.index({ level: 1 });

// Virtual for user count
roleSchema.virtual('userCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'role',
  count: true
});

// Pre-save middleware to ensure only one default role per category
roleSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { category: this.category, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Instance method to check if role has permission
roleSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

// Instance method to check if role has any of the permissions
roleSchema.methods.hasAnyPermission = function(permissions) {
  return permissions.some(permission => this.permissions.includes(permission));
};

// Instance method to check if role has all permissions
roleSchema.methods.hasAllPermissions = function(permissions) {
  return permissions.every(permission => this.permissions.includes(permission));
};

// Static method to find by name
roleSchema.statics.findByName = function(name) {
  return this.findOne({ name: name.toLowerCase() });
};

// Static method to find default role for category
roleSchema.statics.findDefault = function(category = 'employee') {
  return this.findOne({ category, isDefault: true, isActive: true });
};

// Static method to get role hierarchy
roleSchema.statics.getHierarchy = function() {
  return this.find({ isActive: true }).sort({ level: -1, name: 1 });
};

// Static method to get roles by category
roleSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ level: -1, name: 1 });
};

// Static method to get role stats
roleSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'role',
        as: 'users'
      }
    },
    {
      $group: {
        _id: '$category',
        totalRoles: { $sum: 1 },
        activeRoles: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        totalUsers: { $sum: { $size: '$users' } }
      }
    }
  ]);
  
  return stats;
};

// Static method to create default roles
roleSchema.statics.createDefaultRoles = async function() {
  const defaultRoles = [
    {
      name: 'super_admin',
      displayName: 'Super Administrator',
      description: 'Quyền quản trị tối cao của hệ thống',
      permissions: [
        'read', 'write', 'delete',
        'manage_users', 'manage_roles', 'manage_enterprises',
        'manage_hr', 'manage_finance', 'manage_inventory', 'manage_sales',
        'view_analytics', 'view_reports', 'create_reports', 'export_data',
        'system_settings', 'audit_logs', 'security_monitoring', 'server_monitoring',
        'manage_notifications', 'manage_subscriptions', 'manage_business_types'
      ],
      isDefault: true,
      level: 10,
      category: 'system'
    },
    {
      name: 'admin',
      displayName: 'Administrator',
      description: 'Quản trị viên hệ thống',
      permissions: [
        'read', 'write', 'delete',
        'view_users', 'create_users', 'update_users',
        'view_roles', 'manage_enterprises',
        'manage_hr', 'manage_finance', 'manage_inventory', 'manage_sales',
        'view_analytics', 'view_reports', 'export_data'
      ],
      isDefault: false,
      level: 9,
      category: 'system'
    },
    {
      name: 'enterprise_owner',
      displayName: 'Chủ doanh nghiệp',
      description: 'Chủ sở hữu doanh nghiệp',
      permissions: [
        'read', 'write', 'delete',
        'manage_hr', 'manage_finance', 'manage_inventory', 'manage_sales',
        'view_analytics', 'view_reports', 'create_reports', 'export_data',
        'manage_users', 'view_roles'
      ],
      isDefault: true,
      level: 8,
      category: 'enterprise'
    },
    {
      name: 'manager',
      displayName: 'Quản lý',
      description: 'Quản lý phòng ban',
      permissions: [
        'read', 'write',
        'view_employees', 'create_employees', 'update_employees',
        'manage_departments', 'view_attendance', 'manage_attendance',
        'view_transactions', 'view_products', 'view_orders',
        'view_reports'
      ],
      isDefault: false,
      level: 5,
      category: 'department'
    },
    {
      name: 'employee',
      displayName: 'Nhân viên',
      description: 'Nhân viên thông thường',
      permissions: [
        'read',
        'view_products', 'manage_cart', 'place_orders',
        'write_reviews', 'manage_profile'
      ],
      isDefault: true,
      level: 1,
      category: 'employee'
    }
  ];

  for (const roleData of defaultRoles) {
    const existingRole = await this.findOne({ name: roleData.name });
    if (!existingRole) {
      await this.create(roleData);
    }
  }
};

module.exports = mongoose.model('Role', roleSchema);
