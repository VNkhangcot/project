import { apiClient } from '@/lib/api';
import { User, ApiResponse, QueryParams } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';

export class UserService {
  // Get all users with pagination and filtering
  static async getUsers(params?: QueryParams): Promise<ApiResponse<User[]>> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredUsers = [...mockUsers];
    
    // Apply search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (params?.status) {
      filteredUsers = filteredUsers.filter(user => user.status === params.status);
    }
    
    return {
      status: 'success',
      count: filteredUsers.length,
      total: filteredUsers.length,
      data: filteredUsers
    };
  }

  // Get single user
  static async getUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`/users/${id}`);
  }

  // Create user
  static async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    status?: string;
  }): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>('/users', userData);
  }

  // Update user
  static async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
  }

  // Delete user
  static async deleteUser(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/users/${id}`);
  }

  // Get user statistics
  static async getUserStats(): Promise<ApiResponse<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    statusStats: Array<{ _id: string; count: number }>;
    roleStats: Array<{ _id: string; count: number }>;
  }>> {
    return apiClient.get<ApiResponse<any>>('/users/stats');
  }

  // Bulk update users
  static async bulkUpdateUsers(userIds: string[], updates: Partial<User>): Promise<ApiResponse<{
    matched: number;
    modified: number;
  }>> {
    return apiClient.put<ApiResponse<any>>('/users/bulk', { userIds, updates });
  }

  // Lock/unlock user account
  static async toggleUserLock(id: string, lock: boolean): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(`/users/${id}`, {
      status: lock ? 'suspended' : 'active'
    });
  }

  // Reset user password (admin action)
  static async resetUserPassword(id: string, newPassword: string): Promise<ApiResponse<any>> {
    return apiClient.put<ApiResponse<any>>(`/users/${id}/reset-password`, { password: newPassword });
  }
}