const mongoose = require('mongoose');

const enterpriseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enterprise name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  code: {
    type: String,
    required: [true, 'Enterprise code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    minlength: [2, 'Code must be at least 2 characters'],
    maxlength: [50, 'Code cannot exceed 50 characters']
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: [
      'Technology',
      'Manufacturing',
      'Retail',
      'Healthcare',
      'Education',
      'Finance',
      'Real Estate',
      'Food & Beverage',
      'Transportation',
      'Construction',
      'Agriculture',
      'Entertainment',
      'Consulting',
      'Other'
    ]
  },
  taxCode: {
    type: String,
    required: [true, 'Tax code is required'],
    unique: true,
    trim: true,
    minlength: [10, 'Tax code must be at least 10 characters'],
    maxlength: [20, 'Tax code cannot exceed 20 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'Vietnam'
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/, 'Please enter a valid Vietnamese phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  logo: {
    type: String,
    default: null
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    position: {
      type: String,
      required: [true, 'Contact person position is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact person phone is required'],
      trim: true,
      match: [/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/, 'Please enter a valid Vietnamese phone number']
    },
    email: {
      type: String,
      required: [true, 'Contact person email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Enterprise owner is required']
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'pending'
  },
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  subscriptionExpiry: {
    type: Date,
    default: function() {
      // Default to 30 days from now
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  userLimit: {
    type: Number,
    default: 10,
    min: [1, 'User limit must be at least 1']
  },
  features: [{
    type: String,
    enum: [
      'user_management',
      'hr_management',
      'finance_management',
      'inventory_management',
      'sales_management',
      'analytics',
      'reports',
      'api_access',
      'custom_reports',
      'advanced_security',
      'priority_support',
      'data_export',
      'integrations'
    ]
  }],
  settings: {
    currency: {
      type: String,
      default: 'VND',
      enum: ['VND', 'USD', 'EUR']
    },
    timezone: {
      type: String,
      default: 'Asia/Ho_Chi_Minh'
    },
    language: {
      type: String,
      default: 'vi',
      enum: ['vi', 'en']
    },
    dateFormat: {
      type: String,
      default: 'DD/MM/YYYY',
      enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
    },
    workingHours: {
      start: {
        type: String,
        default: '08:00'
      },
      end: {
        type: String,
        default: '17:00'
      }
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }]
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  metadata: {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
enterpriseSchema.index({ code: 1 });
enterpriseSchema.index({ taxCode: 1 });
enterpriseSchema.index({ status: 1 });
enterpriseSchema.index({ businessType: 1 });
enterpriseSchema.index({ owner: 1 });
enterpriseSchema.index({ subscriptionExpiry: 1 });
enterpriseSchema.index({ createdAt: -1 });

// Virtual for current user count
enterpriseSchema.virtual('currentUserCount').get(function() {
  return this.employees ? this.employees.length : 0;
});

// Virtual for subscription status
enterpriseSchema.virtual('subscriptionStatus').get(function() {
  if (!this.subscriptionExpiry) return 'expired';
  return this.subscriptionExpiry > new Date() ? 'active' : 'expired';
});

// Virtual for full address
enterpriseSchema.virtual('fullAddress').get(function() {
  const { street, city, state, zipCode, country } = this.address;
  return [street, city, state, zipCode, country].filter(Boolean).join(', ');
});

// Virtual for days until expiry
enterpriseSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.subscriptionExpiry) return 0;
  const diff = this.subscriptionExpiry.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate code if not provided
enterpriseSchema.pre('save', async function(next) {
  if (!this.code && this.isNew) {
    const prefix = this.businessType.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.code = `${prefix}${timestamp}`;
  }
  next();
});

// Pre-save middleware to update lastActivity
enterpriseSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastActivity = new Date();
  }
  next();
});

// Instance method to check if subscription is active
enterpriseSchema.methods.isSubscriptionActive = function() {
  return this.subscriptionExpiry && this.subscriptionExpiry > new Date();
};

// Instance method to check if feature is enabled
enterpriseSchema.methods.hasFeature = function(feature) {
  return this.features.includes(feature);
};

// Instance method to check if user limit is reached
enterpriseSchema.methods.isUserLimitReached = function() {
  return this.currentUserCount >= this.userLimit;
};

// Instance method to add employee
enterpriseSchema.methods.addEmployee = function(employeeId) {
  if (!this.employees.includes(employeeId)) {
    this.employees.push(employeeId);
  }
  return this.save();
};

// Instance method to remove employee
enterpriseSchema.methods.removeEmployee = function(employeeId) {
  this.employees = this.employees.filter(id => !id.equals(employeeId));
  return this.save();
};

// Instance method to add department
enterpriseSchema.methods.addDepartment = function(departmentId) {
  if (!this.departments.includes(departmentId)) {
    this.departments.push(departmentId);
  }
  return this.save();
};

// Instance method to remove department
enterpriseSchema.methods.removeDepartment = function(departmentId) {
  this.departments = this.departments.filter(id => !id.equals(departmentId));
  return this.save();
};

// Static method to find by code
enterpriseSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() });
};

// Static method to find by tax code
enterpriseSchema.statics.findByTaxCode = function(taxCode) {
  return this.findOne({ taxCode });
};

// Static method to find active enterprises
enterpriseSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find enterprises by owner
enterpriseSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId });
};

// Static method to get enterprise stats
enterpriseSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const businessTypeStats = await this.aggregate([
    {
      $group: {
        _id: '$businessType',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const subscriptionStats = await this.aggregate([
    {
      $group: {
        _id: '$subscriptionPlan',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    byStatus: stats,
    byBusinessType: businessTypeStats,
    bySubscription: subscriptionStats
  };
};

// Static method to find expiring subscriptions
enterpriseSchema.statics.findExpiringSubscriptions = function(days = 7) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  
  return this.find({
    subscriptionExpiry: { $lte: expiryDate },
    status: 'active'
  });
};

module.exports = mongoose.model('Enterprise', enterpriseSchema);
