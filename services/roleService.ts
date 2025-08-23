import { apiClient } from '@/lib/api';
import { Role, Permission, ApiResponse } from '@/lib/types';
import { mockRoles } from '@/lib/mockData';

export class RoleService {
  // Get all roles
  static async getRoles(): Promise<ApiResponse<Role[]>> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      status: 'success',
      count: mockRoles.length,
      data: mockRoles
    };
  }

  // Get single role
  static async getRole(id: string): Promise<ApiResponse<Role>> {
    return apiClient.get<ApiResponse<Role>>(`/roles/${id}`);
  }

  // Create role
  static async createRole(roleData: {
    name: string;
    description: string;
    permissions: Permission[];
  }): Promise<ApiResponse<Role>> {
    return apiClient.post<ApiResponse<Role>>('/roles', roleData);
  }

  // Update role
  static async updateRole(id: string, roleData: Partial<Role>): Promise<ApiResponse<Role>> {
    return apiClient.put<ApiResponse<Role>>(`/roles/${id}`, roleData);
  }

  // Delete role
  static async deleteRole(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/roles/${id}`);
  }

  // Get available permissions
  static async getPermissions(): Promise<ApiResponse<{
    all: Permission[];
    categories: Record<string, Permission[]>;
  }>> {
    return apiClient.get<ApiResponse<any>>('/roles/permissions');
  }

  // Check if user has permission
  static hasPermission(user: any, permission: Permission): boolean {
    if (!user || !user.role || !user.role.permissions) return false;
    return user.role.permissions.includes(permission);
  }

  // Check if user has any of the permissions
  static hasAnyPermission(user: any, permissions: Permission[]): boolean {
    if (!user || !user.role || !user.role.permissions) return false;
    return permissions.some(permission => user.role.permissions.includes(permission));
  }

  // Check if user has all permissions
  static hasAllPermissions(user: any, permissions: Permission[]): boolean {
    if (!user || !user.role || !user.role.permissions) return false;
    return permissions.every(permission => user.role.permissions.includes(permission));
  }
}