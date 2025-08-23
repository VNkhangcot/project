import { apiClient } from '@/lib/api';
import { DashboardStats, SystemHealth, AuditLog, ApiResponse } from '@/lib/types';
import { mockDashboardStats, mockSystemHealth, mockAuditLogs } from '@/lib/mockData';

export class DashboardService {
  // Get dashboard statistics
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 'success',
      data: mockDashboardStats
    };
  }

  // Get system health metrics
  static async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 'success',
      data: mockSystemHealth
    };
  }

  // Get recent activity
  static async getRecentActivity(): Promise<ApiResponse<AuditLog[]>> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 'success',
      data: mockAuditLogs.slice(0, 5)
    };
  }

  // Get analytics data
  static async getAnalyticsData(period: '24h' | '7d' | '30d' = '7d'): Promise<ApiResponse<{
    userActivity: Array<{
      _id: { date: string; action: string };
      count: number;
    }>;
    loginAttempts: Array<{
      _id: { hour: number; action: string };
      count: number;
    }>;
    period: string;
  }>> {
    return apiClient.get<ApiResponse<any>>(`/dashboard/analytics?period=${period}`);
  }

  // Get server metrics
  static async getServerMetrics(): Promise<ApiResponse<{
    cpu: { usage: number; cores: number };
    memory: { total: number; used: number; free: number; usage: number };
    disk: { total: number; used: number; free: number; usage: number };
    network: { bytesIn: number; bytesOut: number };
    uptime: number;
    processes: { total: number; running: number; sleeping: number };
  }>> {
    return apiClient.get<ApiResponse<any>>('/dashboard/server-metrics');
  }

  // Get security alerts
  static async getSecurityAlerts(): Promise<ApiResponse<{
    totalAlerts: number;
    criticalAlerts: number;
    recentAlerts: AuditLog[];
    alertsByType: Array<{ type: string; count: number }>;
  }>> {
    return apiClient.get<ApiResponse<any>>('/dashboard/security-alerts');
  }

  // Get performance metrics over time
  static async getPerformanceMetrics(period: '1h' | '24h' | '7d' = '24h'): Promise<ApiResponse<Array<{
    timestamp: string;
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  }>>> {
    return apiClient.get<ApiResponse<any>>(`/dashboard/performance?period=${period}`);
  }
}