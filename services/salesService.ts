import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

// Sales related interfaces
export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  type: 'individual' | 'business';
  taxCode?: string;
  creditLimit: number;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer;
  items: Array<{
    product: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  _id: string;
  name: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
  value: number;
  conditions: {
    minimumAmount?: number;
    applicableProducts?: string[];
    applicableCategories?: string[];
    maxUsage?: number;
    maxUsagePerCustomer?: number;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  _id: string;
  quoteNumber: string;
  customer: Customer;
  items: Array<{
    product: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class SalesService {
  // Order Management
  static async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    customer?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<ApiResponse<Order[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/sales/orders?${queryString}` : '/sales/orders';
    
    return apiClient.get<ApiResponse<Order[]>>(endpoint);
  }

  static async getOrder(id: string): Promise<ApiResponse<Order>> {
    return apiClient.get<ApiResponse<Order>>(`/sales/orders/${id}`);
  }

  static async createOrder(data: Partial<Order>): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>('/sales/orders', data);
  }

  static async updateOrder(id: string, data: Partial<Order>): Promise<ApiResponse<Order>> {
    return apiClient.put<ApiResponse<Order>>(`/sales/orders/${id}`, data);
  }

  static async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return apiClient.put<ApiResponse<Order>>(`/sales/orders/${id}/status`, { status });
  }

  static async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    return apiClient.put<ApiResponse<Order>>(`/sales/orders/${id}/cancel`, { reason });
  }

  static async processPayment(id: string, paymentData: {
    method: string;
    amount: number;
    reference?: string;
  }): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>(`/sales/orders/${id}/payment`, paymentData);
  }

  // Customer Management
  static async getCustomers(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Customer[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/sales/customers?${queryString}` : '/sales/customers';
    
    return apiClient.get<ApiResponse<Customer[]>>(endpoint);
  }

  static async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    return apiClient.get<ApiResponse<Customer>>(`/sales/customers/${id}`);
  }

  static async createCustomer(data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return apiClient.post<ApiResponse<Customer>>('/sales/customers', data);
  }

  static async updateCustomer(id: string, data: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return apiClient.put<ApiResponse<Customer>>(`/sales/customers/${id}`, data);
  }

  static async deleteCustomer(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/sales/customers/${id}`);
  }

  static async getCustomerOrders(id: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<Order[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/sales/customers/${id}/orders?${queryString}` : `/sales/customers/${id}/orders`;
    
    return apiClient.get<ApiResponse<Order[]>>(endpoint);
  }

  // Quote Management
  static async getQuotes(params?: {
    page?: number;
    limit?: number;
    status?: string;
    customer?: string;
    search?: string;
  }): Promise<ApiResponse<Quote[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/sales/quotes?${queryString}` : '/sales/quotes';
    
    return apiClient.get<ApiResponse<Quote[]>>(endpoint);
  }

  static async getQuote(id: string): Promise<ApiResponse<Quote>> {
    return apiClient.get<ApiResponse<Quote>>(`/sales/quotes/${id}`);
  }

  static async createQuote(data: Partial<Quote>): Promise<ApiResponse<Quote>> {
    return apiClient.post<ApiResponse<Quote>>('/sales/quotes', data);
  }

  static async updateQuote(id: string, data: Partial<Quote>): Promise<ApiResponse<Quote>> {
    return apiClient.put<ApiResponse<Quote>>(`/sales/quotes/${id}`, data);
  }

  static async sendQuote(id: string): Promise<ApiResponse<Quote>> {
    return apiClient.post<ApiResponse<Quote>>(`/sales/quotes/${id}/send`);
  }

  static async convertQuoteToOrder(id: string): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>(`/sales/quotes/${id}/convert`);
  }

  // Promotion Management
  static async getPromotions(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
  }): Promise<ApiResponse<Promotion[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/sales/promotions?${queryString}` : '/sales/promotions';
    
    return apiClient.get<ApiResponse<Promotion[]>>(endpoint);
  }

  static async getPromotion(id: string): Promise<ApiResponse<Promotion>> {
    return apiClient.get<ApiResponse<Promotion>>(`/sales/promotions/${id}`);
  }

  static async createPromotion(data: Partial<Promotion>): Promise<ApiResponse<Promotion>> {
    return apiClient.post<ApiResponse<Promotion>>('/sales/promotions', data);
  }

  static async updatePromotion(id: string, data: Partial<Promotion>): Promise<ApiResponse<Promotion>> {
    return apiClient.put<ApiResponse<Promotion>>(`/sales/promotions/${id}`, data);
  }

  static async deletePromotion(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/sales/promotions/${id}`);
  }

  static async validatePromotion(code: string, orderData: {
    subtotal: number;
    items: Array<{ product: string; quantity: number }>;
  }): Promise<ApiResponse<{
    valid: boolean;
    discount: number;
    promotion?: Promotion;
    message?: string;
  }>> {
    return apiClient.post<ApiResponse<any>>('/sales/promotions/validate', { code, ...orderData });
  }

  // Sales Reports
  static async getRevenueReport(params: {
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    revenueByPeriod: Array<{
      period: string;
      revenue: number;
      orders: number;
    }>;
    revenueByPaymentMethod: Array<{
      method: string;
      revenue: number;
      percentage: number;
    }>;
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<ApiResponse<any>>(`/sales/reports/revenue?${queryParams.toString()}`);
  }

  static async getProductReport(params: {
    startDate: string;
    endDate: string;
    limit?: number;
  }): Promise<ApiResponse<{
    topSellingProducts: Array<{
      product: any;
      quantitySold: number;
      revenue: number;
    }>;
    productPerformance: Array<{
      product: any;
      quantitySold: number;
      revenue: number;
      profitMargin: number;
    }>;
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<ApiResponse<any>>(`/sales/reports/products?${queryParams.toString()}`);
  }

  static async getCustomerReport(params: {
    startDate: string;
    endDate: string;
    limit?: number;
  }): Promise<ApiResponse<{
    topCustomers: Array<{
      customer: Customer;
      totalOrders: number;
      totalSpent: number;
      averageOrderValue: number;
    }>;
    customerSegmentation: Array<{
      segment: string;
      count: number;
      revenue: number;
    }>;
    newCustomers: number;
    returningCustomers: number;
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<ApiResponse<any>>(`/sales/reports/customers?${queryParams.toString()}`);
  }

  // Sales Statistics
  static async getSalesStats(): Promise<ApiResponse<{
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    monthlyGrowth: number;
    topSellingProduct: string;
    topCustomer: string;
  }>> {
    return apiClient.get<ApiResponse<any>>('/sales/stats');
  }

  // Sales Analytics
  static async getSalesAnalytics(period: 'today' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    salesTrend: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
    conversionRate: number;
    averageOrderValue: number;
    customerAcquisitionCost: number;
    customerLifetimeValue: number;
  }>> {
    return apiClient.get<ApiResponse<any>>(`/sales/analytics?period=${period}`);
  }
}
