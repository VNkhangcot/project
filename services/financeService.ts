import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

// Finance related interfaces
export interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  employee?: string;
  invoice?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  type: 'sales' | 'purchase';
  customer: {
    name: string;
    email: string;
    address: any;
    taxCode?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Payroll {
  _id: string;
  employee: string;
  period: {
    month: number;
    year: number;
  };
  basicSalary: number;
  allowances: Array<{
    type: string;
    amount: number;
  }>;
  deductions: Array<{
    type: string;
    amount: number;
  }>;
  overtime: {
    hours: number;
    rate: number;
    amount: number;
  };
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export class FinanceService {
  // Transaction Management
  static async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<ApiResponse<Transaction[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/finance/transactions?${queryString}` : '/finance/transactions';
    
    return apiClient.get<ApiResponse<Transaction[]>>(endpoint);
  }

  static async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    return apiClient.get<ApiResponse<Transaction>>(`/finance/transactions/${id}`);
  }

  static async createTransaction(data: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    return apiClient.post<ApiResponse<Transaction>>('/finance/transactions', data);
  }

  static async updateTransaction(id: string, data: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    return apiClient.put<ApiResponse<Transaction>>(`/finance/transactions/${id}`, data);
  }

  static async deleteTransaction(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/finance/transactions/${id}`);
  }

  // Invoice Management
  static async getInvoices(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Invoice[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/finance/invoices?${queryString}` : '/finance/invoices';
    
    return apiClient.get<ApiResponse<Invoice[]>>(endpoint);
  }

  static async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    return apiClient.get<ApiResponse<Invoice>>(`/finance/invoices/${id}`);
  }

  static async createInvoice(data: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    return apiClient.post<ApiResponse<Invoice>>('/finance/invoices', data);
  }

  static async updateInvoice(id: string, data: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    return apiClient.put<ApiResponse<Invoice>>(`/finance/invoices/${id}`, data);
  }

  static async deleteInvoice(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/finance/invoices/${id}`);
  }

  static async sendInvoice(id: string): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(`/finance/invoices/${id}/send`);
  }

  static async markInvoicePaid(id: string): Promise<ApiResponse<Invoice>> {
    return apiClient.put<ApiResponse<Invoice>>(`/finance/invoices/${id}/paid`);
  }

  // Payroll Management
  static async getPayrolls(params?: {
    page?: number;
    limit?: number;
    employee?: string;
    month?: number;
    year?: number;
    status?: string;
  }): Promise<ApiResponse<Payroll[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/finance/payroll?${queryString}` : '/finance/payroll';
    
    return apiClient.get<ApiResponse<Payroll[]>>(endpoint);
  }

  static async getPayroll(id: string): Promise<ApiResponse<Payroll>> {
    return apiClient.get<ApiResponse<Payroll>>(`/finance/payroll/${id}`);
  }

  static async createPayroll(data: Partial<Payroll>): Promise<ApiResponse<Payroll>> {
    return apiClient.post<ApiResponse<Payroll>>('/finance/payroll', data);
  }

  static async updatePayroll(id: string, data: Partial<Payroll>): Promise<ApiResponse<Payroll>> {
    return apiClient.put<ApiResponse<Payroll>>(`/finance/payroll/${id}`, data);
  }

  static async approvePayroll(id: string): Promise<ApiResponse<Payroll>> {
    return apiClient.put<ApiResponse<Payroll>>(`/finance/payroll/${id}/approve`);
  }

  static async processPayroll(id: string): Promise<ApiResponse<Payroll>> {
    return apiClient.put<ApiResponse<Payroll>>(`/finance/payroll/${id}/process`);
  }

  // Financial Reports
  static async getIncomeStatement(params: {
    startDate: string;
    endDate: string;
  }): Promise<ApiResponse<{
    revenue: number;
    expenses: number;
    netIncome: number;
    revenueByCategory: Array<{ category: string; amount: number }>;
    expensesByCategory: Array<{ category: string; amount: number }>;
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value.toString());
    });
    
    return apiClient.get<ApiResponse<any>>(`/finance/reports/income-statement?${queryParams.toString()}`);
  }

  static async getBalanceSheet(): Promise<ApiResponse<{
    assets: {
      current: number;
      fixed: number;
      total: number;
    };
    liabilities: {
      current: number;
      longTerm: number;
      total: number;
    };
    equity: {
      capital: number;
      retainedEarnings: number;
      total: number;
    };
  }>> {
    return apiClient.get<ApiResponse<any>>('/finance/reports/balance-sheet');
  }

  static async getCashFlow(params: {
    startDate: string;
    endDate: string;
  }): Promise<ApiResponse<{
    operating: number;
    investing: number;
    financing: number;
    netCashFlow: number;
    cashFlowByMonth: Array<{ month: string; amount: number }>;
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value.toString());
    });
    
    return apiClient.get<ApiResponse<any>>(`/finance/reports/cash-flow?${queryParams.toString()}`);
  }

  // Finance Statistics
  static async getFinanceStats(): Promise<ApiResponse<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    pendingInvoices: number;
    overdueInvoices: number;
    cashBalance: number;
    monthlyGrowth: number;
  }>> {
    return apiClient.get<ApiResponse<any>>('/finance/stats');
  }

  // Tax and Compliance
  static async getTaxReport(params: {
    startDate: string;
    endDate: string;
    taxType?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<ApiResponse<any>>(`/finance/reports/tax?${queryParams.toString()}`);
  }

  static async exportFinancialData(params: {
    type: 'transactions' | 'invoices' | 'payroll';
    format: 'csv' | 'excel' | 'pdf';
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.post<ApiResponse<any>>('/finance/export', params);
  }
}
