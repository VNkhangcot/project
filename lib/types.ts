// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  lastLogin?: string;
  loginAttempts: number;
  lockUntil?: string;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  preferences: {
    language: 'vi' | 'en';
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Role types
export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  isActive: boolean;
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type Permission = 
  | 'read'
  | 'write'
  | 'delete'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_enterprises'
  | 'manage_business_types'
  | 'manage_subscriptions'
  | 'manage_notifications'
  | 'view_analytics'
  | 'export_data'
  | 'system_settings'
  | 'audit_logs'
  | 'security_monitoring'
  | 'server_monitoring';

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  token: string;
  data: User;
}

// Audit Log types
export interface AuditLog {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  ipAddress: string;
  userAgent?: string;
  location?: {
    country?: string;
    city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  metadata?: Record<string, any>;
  createdAt: string;
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  activeSessions: number;
  securityAlerts: number;
  systemUptime: {
    seconds: number;
    percentage: number;
  };
}

export interface SystemHealth {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  uptime: number;
  loadAverage: number[];
}

// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  errors?: Array<{
    field: string;
    message: string;
    value: any;
  }>;
}

// Enterprise types
export interface Enterprise {
  _id: string;
  name: string;
  code: string;
  businessType: BusinessType;
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  contactPerson: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  subscriptionExpiry: string;
  userLimit: number;
  currentUserCount: number;
  features: string[];
  registrationDate: string;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessType {
  _id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  features: string[];
  defaultUserLimit: number;
  isActive: boolean;
  enterpriseCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Subscription Package types
export interface SubscriptionPackage {
  _id: string;
  name: string;
  code: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  features: string[];
  limits: {
    users: number;
    storage: number; // in GB
    apiCalls: number; // per month
    projects: number;
    support: 'basic' | 'priority' | '24/7';
  };
  isPopular: boolean;
  isActive: boolean;
  category: 'basic' | 'premium' | 'enterprise' | 'custom';
  trialDays: number;
  setupFee: number;
  billingCycle: 'monthly' | 'yearly' | 'both';
  enterpriseCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  enterprise: Enterprise;
  package: SubscriptionPackage;
  status: 'active' | 'expired' | 'cancelled' | 'pending' | 'trial';
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  autoRenew: boolean;
  paymentMethod: {
    type: 'credit_card' | 'bank_transfer' | 'invoice';
    lastFour?: string;
    expiryDate?: string;
  };
  billingHistory: {
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    invoiceId: string;
  }[];
  usage: {
    users: number;
    storage: number;
    apiCalls: number;
    projects: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  recipients: {
    type: 'all' | 'specific' | 'role' | 'enterprise';
    userIds?: string[];
    roleIds?: string[];
    enterpriseIds?: string[];
  };
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  readBy: {
    userId: string;
    readAt: string;
  }[];
  actions?: {
    label: string;
    url: string;
    type: 'primary' | 'secondary';
  }[];
  expiresAt?: string;
  isActive: boolean;
  metadata?: {
    totalRecipients?: number;
    readCount?: number;
    clickCount?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserNotification {
  _id: string;
  notification: Notification;
  user: User;
  isRead: boolean;
  readAt?: string;
  isArchived: boolean;
  archivedAt?: string;
  createdAt: string;
}

// Currency Exchange Rate types
export interface CurrencyRate {
  _id: string;
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate relative to base currency
  isBaseCurrency: boolean;
  isActive: boolean;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeRateHistory {
  _id: string;
  currencyCode: string;
  date: string;
  rate: number;
  source: string;
  createdAt: string;
}

// Query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  severity?: string;
  action?: string;
  user?: string;
  startDate?: string;
  endDate?: string;
}
