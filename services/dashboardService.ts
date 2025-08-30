import { apiClient } from '@/lib/api';
import { DashboardStats, SystemHealth, AuditLog, ApiResponse } from '@/lib/types';

export class DashboardService {
  // Get dashboard statistics
  static async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  }

  // Get analytics data
  static async getAnalytics(period: string = 'month'): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`/dashboard/analytics?period=${period}`);
  }

  // Get recent activities
  static async getRecentActivities(limit: number = 10): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`/dashboard/recent-activities?limit=${limit}`);
  }

  // Get dashboard statistics (legacy method name)
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.getStats();
  }

  // Get recent activity (legacy method name)
  static async getRecentActivity(): Promise<ApiResponse<any[]>> {
    return this.getRecentActivities(5);
  }

  // Get analytics data (legacy method name)
  static async getAnalyticsData(period: '24h' | '7d' | '30d' = '7d'): Promise<ApiResponse<any>> {
    const periodMap = {
      '24h': 'today',
      '7d': 'week',
      '30d': 'month'
    };
    return this.getAnalytics(periodMap[period]);
  }

  // Get system health (mock for now)
  static async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    // This will be implemented when we add system monitoring endpoints
    return {
      status: 'success',
      data: {
        cpu: {
          usage: 45,
          cores: 4
        },
        memory: {
          total: 8192,
          used: 3072,
          free: 5120,
          usage: 37.5
        },
        uptime: 86400,
        loadAverage: [0.5, 0.7, 0.8]
      }
    } as ApiResponse<SystemHealth>;
  }

  // Get server metrics (mock for now)
  static async getServerMetrics(): Promise<ApiResponse<{
    cpu: { usage: number; cores: number };
    memory: { total: number; used: number; free: number; usage: number };
    disk: { total: number; used: number; free: number; usage: number };
    network: { bytesIn: number; bytesOut: number };
    uptime: number;
    processes: { total: number; running: number; sleeping: number };
  }>> {
    return {
      status: 'success',
      data: {
        cpu: { usage: 45, cores: 4 },
        memory: { total: 8192, used: 3072, free: 5120, usage: 37.5 },
        disk: { total: 500000, used: 325000, free: 175000, usage: 65 },
        network: { bytesIn: 1024000, bytesOut: 512000 },
        uptime: 86400,
        processes: { total: 150, running: 5, sleeping: 145 }
      }
    } as ApiResponse<any>;
  }

  // Get security alerts (mock for now)
  static async getSecurityAlerts(): Promise<ApiResponse<{
    totalAlerts: number;
    criticalAlerts: number;
    recentAlerts: AuditLog[];
    alertsByType: Array<{ type: string; count: number }>;
  }>> {
    return {
      status: 'success',
      data: {
        totalAlerts: 5,
        criticalAlerts: 1,
        recentAlerts: [],
        alertsByType: [
          { type: 'Failed Login', count: 3 },
          { type: 'Suspicious Activity', count: 1 },
          { type: 'Permission Denied', count: 1 }
        ]
      }
    } as ApiResponse<any>;
  }

  // Get performance metrics (mock for now)
  static async getPerformanceMetrics(period: '1h' | '24h' | '7d' = '24h'): Promise<ApiResponse<Array<{
    timestamp: string;
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  }>>> {
    const now = new Date();
    const data = [];
    
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      data.push({
        timestamp: timestamp.toISOString(),
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: Math.random() * 1000
      });
    }

    return {
      status: 'success',
      data
    } as ApiResponse<any>;
  }
}
