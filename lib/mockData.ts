// Mock data for development
export const mockUsers = [
  {
    _id: '1',
    name: 'Nguyễn Văn Admin',
    email: 'admin@company.com',
    role: {
      _id: 'role1',
      name: 'Admin',
      description: 'Quyền quản trị tối cao',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles', 'manage_enterprises', 'manage_business_types', 'manage_subscriptions', 'manage_notifications', 'view_analytics', 'export_data', 'system_settings', 'audit_logs', 'security_monitoring', 'server_monitoring'],
      isDefault: true,
      isActive: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    },
    status: 'active' as const,
    avatar: '',
    lastLogin: '2024-01-15T10:30:00.000Z',
    loginAttempts: 0,
    twoFactorEnabled: false,
    emailVerified: true,
    preferences: {
      language: 'vi' as const,
      theme: 'system' as const,
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    _id: '2',
    name: 'Trần Thị Manager',
    email: 'manager@company.com',
    role: {
      _id: 'role2',
      name: 'Manager',
      description: 'Quản lý các hoạt động và báo cáo',
      permissions: ['read', 'write', 'manage_users', 'view_analytics', 'export_data'],
      isDefault: true,
      isActive: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    },
    status: 'active' as const,
    avatar: '',
    lastLogin: '2024-01-15T09:15:00.000Z',
    loginAttempts: 0,
    twoFactorEnabled: true,
    emailVerified: true,
    preferences: {
      language: 'vi' as const,
      theme: 'light' as const,
      notifications: {
        email: true,
        push: true,
        sms: true
      }
    },
    createdAt: '2023-02-15T00:00:00.000Z',
    updatedAt: '2024-01-15T09:15:00.000Z'
  },
  {
    _id: '3',
    name: 'Lê Văn User',
    email: 'user@company.com',
    role: {
      _id: 'role3',
      name: 'User',
      description: 'Người dùng cơ bản với quyền xem',
      permissions: ['read'],
      isDefault: true,
      isActive: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    },
    status: 'inactive' as const,
    avatar: '',
    lastLogin: '2024-01-10T14:20:00.000Z',
    loginAttempts: 0,
    twoFactorEnabled: false,
    emailVerified: true,
    preferences: {
      language: 'vi' as const,
      theme: 'dark' as const,
      notifications: {
        email: false,
        push: false,
        sms: false
      }
    },
    createdAt: '2023-03-20T00:00:00.000Z',
    updatedAt: '2024-01-10T14:20:00.000Z'
  },
  {
    _id: '4',
    name: 'Phạm Thị Editor',
    email: 'editor@company.com',
    role: {
      _id: 'role4',
      name: 'Editor',
      description: 'Chỉnh sửa nội dung và dữ liệu',
      permissions: ['read', 'write'],
      isDefault: false,
      isActive: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    },
    status: 'suspended' as const,
    avatar: '',
    lastLogin: '2024-01-12T16:45:00.000Z',
    loginAttempts: 3,
    twoFactorEnabled: false,
    emailVerified: true,
    preferences: {
      language: 'en' as const,
      theme: 'light' as const,
      notifications: {
        email: true,
        push: false,
        sms: false
      }
    },
    createdAt: '2023-04-10T00:00:00.000Z',
    updatedAt: '2024-01-12T16:45:00.000Z'
  }
];

export const mockRoles = [
  {
    _id: 'role1',
    name: 'Admin',
    description: 'Quyền quản trị tối cao của hệ thống',
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles', 'manage_enterprises', 'manage_business_types', 'manage_subscriptions', 'manage_notifications', 'view_analytics', 'export_data', 'system_settings', 'audit_logs', 'security_monitoring', 'server_monitoring'],
    isDefault: true,
    isActive: true,
    userCount: 1,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'role2',
    name: 'Manager',
    description: 'Quản lý các hoạt động và báo cáo',
    permissions: ['read', 'write', 'manage_users', 'view_analytics', 'export_data'],
    isDefault: true,
    isActive: true,
    userCount: 1,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'role3',
    name: 'User',
    description: 'Người dùng cơ bản với quyền xem',
    permissions: ['read'],
    isDefault: true,
    isActive: true,
    userCount: 1,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'role4',
    name: 'Editor',
    description: 'Chỉnh sửa nội dung và dữ liệu',
    permissions: ['read', 'write'],
    isDefault: false,
    isActive: true,
    userCount: 1,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }
];

export const mockAuditLogs = [
  {
    _id: '1',
    user: {
      _id: '1',
      name: 'Nguyễn Văn Admin',
      email: 'admin@company.com'
    },
    action: 'USER_LOGIN',
    resource: 'Authentication',
    resourceId: '1',
    details: 'Đăng nhập thành công từ IP: 192.168.1.100',
    severity: 'info' as const,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: {
      country: 'Vietnam',
      city: 'Ho Chi Minh City'
    },
    metadata: {},
    createdAt: '2024-01-15T10:30:15.000Z'
  },
  {
    _id: '2',
    user: {
      _id: '2',
      name: 'Trần Thị Manager',
      email: 'manager@company.com'
    },
    action: 'USER_UPDATE',
    resource: 'User Management',
    resourceId: '3',
    details: 'Cập nhật thông tin người dùng: user@company.com',
    severity: 'warning' as const,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    location: {
      country: 'Vietnam',
      city: 'Hanoi'
    },
    metadata: {},
    createdAt: '2024-01-15T10:29:45.000Z'
  },
  {
    _id: '3',
    action: 'SECURITY_ALERT',
    resource: 'Security',
    details: 'Phát hiện nhiều lần đăng nhập thất bại từ IP: 95.216.1.999',
    severity: 'error' as const,
    ipAddress: '95.216.1.999',
    userAgent: 'Unknown',
    location: {
      country: 'Russia',
      city: 'Moscow'
    },
    metadata: {},
    createdAt: '2024-01-15T10:28:30.000Z'
  }
];

export const mockDashboardStats = {
  totalUsers: 2847,
  activeUsers: 1234,
  activeSessions: 567,
  securityAlerts: 23,
  systemUptime: {
    seconds: 1296000,
    percentage: 99.9
  }
};

export const mockSystemHealth = {
  cpu: {
    usage: 45,
    cores: 8
  },
  memory: {
    total: 32768,
    used: 13107,
    free: 19661,
    usage: 40
  },
  uptime: 1296000,
  loadAverage: [0.85, 0.92, 1.01]
};

// Mock business types
export const mockBusinessTypes = [
  {
    _id: 'bt1',
    name: 'Công ty Công nghệ',
    code: 'TECH',
    description: 'Các công ty hoạt động trong lĩnh vực công nghệ thông tin',
    category: 'Technology',
    features: ['user_management', 'analytics', 'api_access', 'custom_reports'],
    defaultUserLimit: 100,
    isActive: true,
    enterpriseCount: 45,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'bt2',
    name: 'Ngân hàng & Tài chính',
    code: 'FINANCE',
    description: 'Các tổ chức tài chính, ngân hàng, bảo hiểm',
    category: 'Finance',
    features: ['user_management', 'analytics', 'security_monitoring', 'audit_logs', 'compliance_reports'],
    defaultUserLimit: 500,
    isActive: true,
    enterpriseCount: 23,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'bt3',
    name: 'Sản xuất',
    code: 'MANUFACTURING',
    description: 'Các doanh nghiệp sản xuất, chế tạo',
    category: 'Manufacturing',
    features: ['user_management', 'inventory_tracking', 'production_reports'],
    defaultUserLimit: 200,
    isActive: true,
    enterpriseCount: 67,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'bt4',
    name: 'Giáo dục',
    code: 'EDUCATION',
    description: 'Các tổ chức giáo dục, trường học, đại học',
    category: 'Education',
    features: ['user_management', 'student_tracking', 'course_management'],
    defaultUserLimit: 1000,
    isActive: true,
    enterpriseCount: 34,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }
];

// Mock enterprises
export const mockEnterprises = [
  {
    _id: 'ent1',
    name: 'Công ty TNHH Công nghệ ABC',
    code: 'ABC_TECH',
    businessType: mockBusinessTypes[0],
    taxCode: '0123456789',
    address: '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
    phone: '028-1234-5678',
    email: 'contact@abctech.com',
    website: 'https://abctech.com',
    contactPerson: {
      name: 'Nguyễn Văn A',
      position: 'Giám đốc IT',
      phone: '0901-234-567',
      email: 'admin@abctech.com'
    },
    status: 'active' as const,
    subscriptionPlan: 'premium' as const,
    subscriptionExpiry: '2024-12-31T23:59:59.000Z',
    userLimit: 150,
    currentUserCount: 89,
    features: ['user_management', 'analytics', 'api_access', 'custom_reports'],
    registrationDate: '2023-03-15T00:00:00.000Z',
    lastActivity: '2024-01-15T10:30:00.000Z',
    createdAt: '2023-03-15T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    _id: 'ent2',
    name: 'Ngân hàng XYZ',
    code: 'XYZ_BANK',
    businessType: mockBusinessTypes[1],
    taxCode: '0987654321',
    address: '456 Đường Lê Lợi, Quận 1, TP.HCM',
    phone: '028-9876-5432',
    email: 'info@xyzbank.com',
    website: 'https://xyzbank.com',
    contactPerson: {
      name: 'Trần Thị B',
      position: 'Trưởng phòng IT',
      phone: '0902-345-678',
      email: 'it@xyzbank.com'
    },
    status: 'active' as const,
    subscriptionPlan: 'enterprise' as const,
    subscriptionExpiry: '2024-06-30T23:59:59.000Z',
    userLimit: 1000,
    currentUserCount: 756,
    features: ['user_management', 'analytics', 'security_monitoring', 'audit_logs', 'compliance_reports'],
    registrationDate: '2023-01-10T00:00:00.000Z',
    lastActivity: '2024-01-15T09:45:00.000Z',
    createdAt: '2023-01-10T00:00:00.000Z',
    updatedAt: '2024-01-15T09:45:00.000Z'
  },
  {
    _id: 'ent3',
    name: 'Nhà máy sản xuất DEF',
    code: 'DEF_MFG',
    businessType: mockBusinessTypes[2],
    taxCode: '0456789123',
    address: '789 Đường Võ Văn Kiệt, Quận 5, TP.HCM',
    phone: '028-4567-8901',
    email: 'contact@defmfg.com',
    contactPerson: {
      name: 'Lê Văn C',
      position: 'Quản lý hệ thống',
      phone: '0903-456-789',
      email: 'system@defmfg.com'
    },
    status: 'pending' as const,
    subscriptionPlan: 'basic' as const,
    subscriptionExpiry: '2024-03-31T23:59:59.000Z',
    userLimit: 50,
    currentUserCount: 23,
    features: ['user_management', 'inventory_tracking'],
    registrationDate: '2024-01-10T00:00:00.000Z',
    lastActivity: '2024-01-14T16:20:00.000Z',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-14T16:20:00.000Z'
  },
  {
    _id: 'ent4',
    name: 'Trường Đại học GHI',
    code: 'GHI_UNI',
    businessType: mockBusinessTypes[3],
    taxCode: '0789123456',
    address: '321 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
    phone: '028-7891-2345',
    email: 'admin@ghiuni.edu.vn',
    website: 'https://ghiuni.edu.vn',
    contactPerson: {
      name: 'Phạm Thị D',
      position: 'Trưởng phòng CNTT',
      phone: '0904-567-890',
      email: 'it@ghiuni.edu.vn'
    },
    status: 'suspended' as const,
    subscriptionPlan: 'premium' as const,
    subscriptionExpiry: '2024-08-31T23:59:59.000Z',
    userLimit: 2000,
    currentUserCount: 1456,
    features: ['user_management', 'student_tracking', 'course_management'],
    registrationDate: '2023-08-01T00:00:00.000Z',
    lastActivity: '2024-01-12T14:15:00.000Z',
    createdAt: '2023-08-01T00:00:00.000Z',
    updatedAt: '2024-01-12T14:15:00.000Z'
  }
];

// Mock login credentials for testing
// Subscription Packages
export const mockSubscriptionPackages = [
  {
    _id: 'pkg1',
    name: 'Gói Cơ Bản',
    code: 'BASIC',
    description: 'Gói dịch vụ cơ bản phù hợp cho doanh nghiệp nhỏ',
    price: {
      monthly: 299000,
      yearly: 2990000,
      currency: 'VND'
    },
    features: [
      'Quản lý người dùng cơ bản',
      'Báo cáo thống kê',
      'Hỗ trợ email',
      'Lưu trữ 10GB',
      'API cơ bản'
    ],
    limits: {
      users: 50,
      storage: 10,
      apiCalls: 10000,
      projects: 5,
      support: 'basic' as const
    },
    isPopular: false,
    isActive: true,
    category: 'basic' as const,
    trialDays: 14,
    setupFee: 0,
    billingCycle: 'both' as const,
    enterpriseCount: 45,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'pkg2',
    name: 'Gói Chuyên Nghiệp',
    code: 'PREMIUM',
    description: 'Gói dịch vụ chuyên nghiệp với nhiều tính năng nâng cao',
    price: {
      monthly: 599000,
      yearly: 5990000,
      currency: 'VND'
    },
    features: [
      'Tất cả tính năng gói Cơ bản',
      'Quản lý dự án nâng cao',
      'Báo cáo chi tiết',
      'Hỗ trợ ưu tiên',
      'Lưu trữ 100GB',
      'API không giới hạn',
      'Tích hợp bên thứ 3'
    ],
    limits: {
      users: 200,
      storage: 100,
      apiCalls: 100000,
      projects: 25,
      support: 'priority' as const
    },
    isPopular: true,
    isActive: true,
    category: 'premium' as const,
    trialDays: 30,
    setupFee: 500000,
    billingCycle: 'both' as const,
    enterpriseCount: 23,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'pkg3',
    name: 'Gói Doanh Nghiệp',
    code: 'ENTERPRISE',
    description: 'Gói dịch vụ doanh nghiệp với tính năng toàn diện',
    price: {
      monthly: 1299000,
      yearly: 12990000,
      currency: 'VND'
    },
    features: [
      'Tất cả tính năng gói Chuyên nghiệp',
      'Quản lý đa chi nhánh',
      'Báo cáo tùy chỉnh',
      'Hỗ trợ 24/7',
      'Lưu trữ không giới hạn',
      'API Enterprise',
      'Tích hợp ERP/CRM',
      'Bảo mật nâng cao',
      'Đào tạo chuyên sâu'
    ],
    limits: {
      users: 1000,
      storage: 1000,
      apiCalls: 1000000,
      projects: 100,
      support: '24/7' as const
    },
    isPopular: false,
    isActive: true,
    category: 'enterprise' as const,
    trialDays: 30,
    setupFee: 2000000,
    billingCycle: 'both' as const,
    enterpriseCount: 8,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'pkg4',
    name: 'Gói Tùy Chỉnh',
    code: 'CUSTOM',
    description: 'Gói dịch vụ tùy chỉnh theo nhu cầu riêng',
    price: {
      monthly: 0,
      yearly: 0,
      currency: 'VND'
    },
    features: [
      'Tính năng tùy chỉnh',
      'Hỗ trợ chuyên biệt',
      'Tích hợp đặc biệt',
      'SLA cam kết',
      'Đào tạo riêng'
    ],
    limits: {
      users: 9999,
      storage: 9999,
      apiCalls: 9999999,
      projects: 999,
      support: '24/7' as const
    },
    isPopular: false,
    isActive: true,
    category: 'custom' as const,
    trialDays: 0,
    setupFee: 0,
    billingCycle: 'yearly' as const,
    enterpriseCount: 3,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }
];

// Mock notifications
export const mockNotifications = [
  {
    _id: 'notif1',
    title: 'Cập nhật hệ thống quan trọng',
    message: 'Hệ thống sẽ được bảo trì vào ngày 25/01/2024 từ 2:00 - 4:00 sáng. Vui lòng lưu công việc trước thời gian này.',
    type: 'warning' as const,
    priority: 'high' as const,
    sender: {
      _id: '1',
      name: 'Nguyễn Văn Admin',
      email: 'admin@company.com'
    },
    recipients: {
      type: 'all' as const
    },
    status: 'sent' as const,
    sentAt: '2024-01-20T10:00:00.000Z',
    readBy: [
      {
        userId: '2',
        readAt: '2024-01-20T10:30:00.000Z'
      }
    ],
    actions: [
      {
        label: 'Xem chi tiết',
        url: '/dashboard/maintenance',
        type: 'primary' as const
      }
    ],
    expiresAt: '2024-01-26T00:00:00.000Z',
    isActive: true,
    metadata: {
      totalRecipients: 150,
      readCount: 45,
      clickCount: 12
    },
    createdAt: '2024-01-20T09:45:00.000Z',
    updatedAt: '2024-01-20T09:45:00.000Z'
  },
  {
    _id: 'notif2',
    title: 'Chúc mừng năm mới 2024',
    message: 'Chúc tất cả các thành viên một năm mới an khang thịnh vượng, công việc thuận lợi và nhiều thành công!',
    type: 'announcement' as const,
    priority: 'medium' as const,
    sender: {
      _id: '1',
      name: 'Nguyễn Văn Admin',
      email: 'admin@company.com'
    },
    recipients: {
      type: 'all' as const
    },
    status: 'sent' as const,
    sentAt: '2024-01-01T00:00:00.000Z',
    readBy: [
      {
        userId: '2',
        readAt: '2024-01-01T08:00:00.000Z'
      },
      {
        userId: '3',
        readAt: '2024-01-01T09:15:00.000Z'
      }
    ],
    isActive: true,
    metadata: {
      totalRecipients: 150,
      readCount: 142,
      clickCount: 0
    },
    createdAt: '2023-12-31T23:50:00.000Z',
    updatedAt: '2023-12-31T23:50:00.000Z'
  },
  {
    _id: 'notif3',
    title: 'Cập nhật tính năng mới',
    message: 'Chúng tôi đã thêm tính năng quản lý gói đăng ký mới. Hãy khám phá và trải nghiệm!',
    type: 'info' as const,
    priority: 'medium' as const,
    sender: {
      _id: '1',
      name: 'Nguyễn Văn Admin',
      email: 'admin@company.com'
    },
    recipients: {
      type: 'role' as const,
      roleIds: ['role1', 'role2']
    },
    status: 'sent' as const,
    sentAt: '2024-01-15T14:30:00.000Z',
    readBy: [
      {
        userId: '2',
        readAt: '2024-01-15T15:00:00.000Z'
      }
    ],
    actions: [
      {
        label: 'Xem tính năng',
        url: '/dashboard/subscriptions',
        type: 'primary' as const
      }
    ],
    isActive: true,
    metadata: {
      totalRecipients: 25,
      readCount: 18,
      clickCount: 8
    },
    createdAt: '2024-01-15T14:25:00.000Z',
    updatedAt: '2024-01-15T14:25:00.000Z'
  },
  {
    _id: 'notif4',
    title: 'Lỗi hệ thống đã được khắc phục',
    message: 'Sự cố đăng nhập gặp phải sáng nay đã được khắc phục hoàn toàn. Cảm ơn sự kiên nhẫn của các bạn.',
    type: 'success' as const,
    priority: 'low' as const,
    sender: {
      _id: '1',
      name: 'Nguyễn Văn Admin',
      email: 'admin@company.com'
    },
    recipients: {
      type: 'all' as const
    },
    status: 'sent' as const,
    sentAt: '2024-01-18T16:45:00.000Z',
    readBy: [],
    isActive: true,
    metadata: {
      totalRecipients: 150,
      readCount: 89,
      clickCount: 0
    },
    createdAt: '2024-01-18T16:40:00.000Z',
    updatedAt: '2024-01-18T16:40:00.000Z'
  },
  {
    _id: 'notif5',
    title: 'Thông báo bảo mật quan trọng',
    message: 'Phát hiện hoạt động đăng nhập bất thường. Vui lòng kiểm tra và thay đổi mật khẩu nếu cần thiết.',
    type: 'error' as const,
    priority: 'urgent' as const,
    sender: {
      _id: '1',
      name: 'Nguyễn Văn Admin',
      email: 'admin@company.com'
    },
    recipients: {
      type: 'specific' as const,
      userIds: ['3', '4']
    },
    status: 'sent' as const,
    sentAt: '2024-01-19T09:15:00.000Z',
    readBy: [
      {
        userId: '4',
        readAt: '2024-01-19T09:30:00.000Z'
      }
    ],
    actions: [
      {
        label: 'Đổi mật khẩu',
        url: '/dashboard/settings',
        type: 'primary' as const
      },
      {
        label: 'Xem chi tiết',
        url: '/dashboard/security',
        type: 'secondary' as const
      }
    ],
    isActive: true,
    metadata: {
      totalRecipients: 2,
      readCount: 1,
      clickCount: 1
    },
    createdAt: '2024-01-19T09:10:00.000Z',
    updatedAt: '2024-01-19T09:10:00.000Z'
  }
];

export const mockCredentials = {
  'admin@company.com': {
    password: 'admin123',
    user: mockUsers[0]
  },
  'manager@company.com': {
    password: 'manager123',
    user: mockUsers[1]
  },
  'user@company.com': {
    password: 'user123',
    user: mockUsers[2]
  },
  'editor@company.com': {
    password: 'editor123',
    user: mockUsers[3]
  }
};
