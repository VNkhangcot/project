import { ApiResponse, SubscriptionPackage, Subscription, QueryParams } from '@/lib/types';
import { mockSubscriptionPackages } from '@/lib/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class SubscriptionService {
  // Get all subscription packages
  static async getSubscriptionPackages(params?: QueryParams): Promise<ApiResponse<SubscriptionPackage[]>> {
    await delay(500);
    
    try {
      let packages = [...mockSubscriptionPackages];
      
      // Apply search filter
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        packages = packages.filter(pkg =>
          pkg.name.toLowerCase().includes(searchTerm) ||
          pkg.code.toLowerCase().includes(searchTerm) ||
          pkg.description.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply status filter
      if (params?.status && params.status !== 'all') {
        packages = packages.filter(pkg => 
          params.status === 'active' ? pkg.isActive : !pkg.isActive
        );
      }
      
      // Apply category filter
      if (params?.role) { // Using role param as category filter
        packages = packages.filter(pkg => pkg.category === params.role);
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPackages = packages.slice(startIndex, endIndex);
      
      return {
        status: 'success',
        data: paginatedPackages,
        count: paginatedPackages.length,
        total: packages.length,
        pagination: {
          next: endIndex < packages.length ? { page: page + 1, limit } : undefined,
          prev: page > 1 ? { page: page - 1, limit } : undefined
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Không thể tải danh sách gói đăng ký',
        errors: [{ field: 'general', message: 'Server error', value: null }]
      };
    }
  }
  
  // Get subscription package by ID
  static async getSubscriptionPackageById(id: string): Promise<ApiResponse<SubscriptionPackage>> {
    await delay(300);
    
    try {
      const pkg = mockSubscriptionPackages.find(p => p._id === id);
      
      if (!pkg) {
        return {
          status: 'error',
          message: 'Không tìm thấy gói đăng ký',
          errors: [{ field: 'id', message: 'Package not found', value: id }]
        };
      }
      
      return {
        status: 'success',
        data: pkg
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Không thể tải thông tin gói đăng ký',
        errors: [{ field: 'general', message: 'Server error', value: null }]
      };
    }
  }
  
  // Create new subscription package
  static async createSubscriptionPackage(packageData: Omit<SubscriptionPackage, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<SubscriptionPackage>> {
    await delay(800);
    
    try {
      // Validate required fields
      if (!packageData.name || !packageData.code) {
        return {
          status: 'error',
          message: 'Thiếu thông tin bắt buộc',
          errors: [
            { field: 'name', message: 'Tên gói là bắt buộc', value: packageData.name },
            { field: 'code', message: 'Mã gói là bắt buộc', value: packageData.code }
          ]
        };
      }
      
      // Check if code already exists
      const existingPackage = mockSubscriptionPackages.find(p => p.code === packageData.code);
      if (existingPackage) {
        return {
          status: 'error',
          message: 'Mã gói đã tồn tại',
          errors: [{ field: 'code', message: 'Package code already exists', value: packageData.code }]
        };
      }
      
      const newPackage: SubscriptionPackage = {
        ...packageData,
        _id: `pkg${Date.now()}`,
        enterpriseCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, this would be saved to database
      (mockSubscriptionPackages as SubscriptionPackage[]).push(newPackage);
      
      return {
        status: 'success',
        data: newPackage,
        message: 'Tạo gói đăng ký thành công'
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Không thể tạo gói đăng ký',
        errors: [{ field: 'general', message: 'Server error', value: null }]
      };
    }
  }
  
  // Update subscription package
  static async updateSubscriptionPackage(id: string, packageData: Partial<SubscriptionPackage>): Promise<ApiResponse<SubscriptionPackage>> {
    await delay(800);
    
    try {
      const packageIndex = mockSubscriptionPackages.findIndex(p => p._id === id);
      
      if (packageIndex === -1) {
        return {
          status: 'error',
          message: 'Không tìm thấy gói đăng ký',
          errors: [{ field: 'id', message: 'Package not found', value: id }]
        };
      }
      
      // Check if code already exists (excluding current package)
      if (packageData.code) {
        const existingPackage = mockSubscriptionPackages.find(p => p.code === packageData.code && p._id !== id);
        if (existingPackage) {
          return {
            status: 'error',
            message: 'Mã gói đã tồn tại',
            errors: [{ field: 'code', message: 'Package code already exists', value: packageData.code }]
          };
        }
      }
      
      const updatedPackage = {
        ...mockSubscriptionPackages[packageIndex],
        ...packageData,
        updatedAt: new Date().toISOString()
      };
      
      (mockSubscriptionPackages as SubscriptionPackage[])[packageIndex] = updatedPackage;
      
      return {
        status: 'success',
        data: updatedPackage,
        message: 'Cập nhật gói đăng ký thành công'
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Không thể cập nhật gói đăng ký',
        errors: [{ field: 'general', message: 'Server error', value: null }]
      };
    }
  }
  
  // Delete subscription package
  static async deleteSubscriptionPackage(id: string): Promise<ApiResponse<void>> {
    await delay(500);
    
    try {
      const packageIndex = mockSubscriptionPackages.findIndex(p => p._id === id);
      
      if (packageIndex === -1) {
        return {
          status: 'error',
          message: 'Không tìm thấy gói đăng ký',
          errors: [{ field: 'id', message: 'Package not found', value: id }]
        };
      }
      
      const pkg = mockSubscriptionPackages[packageIndex];
      
      // Check if package is being used by enterprises
      if (pkg.enterpriseCount && pkg.enterpriseCount > 0) {
        return {
          status: 'error',
          message: 'Không thể xóa gói đang được sử dụng',
          errors: [{ field: 'enterpriseCount', message: 'Package is in use', value: pkg.enterpriseCount }]
        };
      }
      
      mockSubscriptionPackages.splice(packageIndex, 1);
      
      return {
        status: 'success',
        message: 'Xóa gói đăng ký thành công'
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Không thể xóa gói đăng ký',
        errors: [{ field: 'general', message: 'Server error', value: null }]
      };
    }
  }
  
  // Get subscription statistics
  static async getSubscriptionStats(): Promise<ApiResponse<any>> {
    await delay(400);
    
    try {
      const totalPackages = mockSubscriptionPackages.length;
      const activePackages = mockSubscriptionPackages.filter(p => p.isActive).length;
      const totalEnterprises = mockSubscriptionPackages.reduce((sum, p) => sum + (p.enterpriseCount || 0), 0);
      const totalRevenue = mockSubscriptionPackages.reduce((sum, p) => sum + (p.price.monthly * (p.enterpriseCount || 0)), 0);
      
      const categoryStats = mockSubscriptionPackages.reduce((acc, pkg) => {
        acc[pkg.category] = (acc[pkg.category] || 0) + (pkg.enterpriseCount || 0);
        return acc;
      }, {} as Record<string, number>);
      
      const revenueByPackage = mockSubscriptionPackages.map(pkg => ({
        name: pkg.name,
        revenue: pkg.price.monthly * (pkg.enterpriseCount || 0),
        enterprises: pkg.enterpriseCount || 0
      }));
      
      return {
        status: 'success',
        data: {
          totalPackages,
          activePackages,
          totalEnterprises,
          totalRevenue,
          categoryStats,
          revenueByPackage,
          growthRate: 12.5, // Mock growth rate
          conversionRate: 8.3 // Mock conversion rate
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Không thể tải thống kê gói đăng ký',
        errors: [{ field: 'general', message: 'Server error', value: null }]
      };
    }
  }
}
