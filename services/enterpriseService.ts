import { Enterprise, BusinessType, ApiResponse, QueryParams } from '@/lib/types';
import { mockEnterprises, mockBusinessTypes } from '@/lib/mockData';

export class EnterpriseService {
  // Get all enterprises with pagination and filtering
  static async getEnterprises(params?: QueryParams): Promise<ApiResponse<Enterprise[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredEnterprises = [...mockEnterprises];
    
    // Apply search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredEnterprises = filteredEnterprises.filter(enterprise => 
        enterprise.name.toLowerCase().includes(searchTerm) ||
        enterprise.code.toLowerCase().includes(searchTerm) ||
        enterprise.email.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (params?.status) {
      filteredEnterprises = filteredEnterprises.filter(enterprise => enterprise.status === params.status);
    }
    
    return {
      status: 'success',
      count: filteredEnterprises.length,
      total: filteredEnterprises.length,
      data: filteredEnterprises
    };
  }

  // Get single enterprise
  static async getEnterprise(id: string): Promise<ApiResponse<Enterprise>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const enterprise = mockEnterprises.find(e => e._id === id);
    if (!enterprise) {
      throw new Error('Không tìm thấy doanh nghiệp');
    }
    
    return {
      status: 'success',
      data: enterprise
    };
  }

  // Create enterprise
  static async createEnterprise(enterpriseData: Partial<Enterprise>): Promise<ApiResponse<Enterprise>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newEnterprise: Enterprise = {
      _id: 'ent' + Date.now(),
      name: enterpriseData.name || '',
      code: enterpriseData.code || '',
      businessType: enterpriseData.businessType || mockBusinessTypes[0],
      taxCode: enterpriseData.taxCode || '',
      address: enterpriseData.address || '',
      phone: enterpriseData.phone || '',
      email: enterpriseData.email || '',
      website: enterpriseData.website,
      contactPerson: enterpriseData.contactPerson || {
        name: '',
        position: '',
        phone: '',
        email: ''
      },
      status: 'pending',
      subscriptionPlan: 'basic',
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      userLimit: enterpriseData.businessType?.defaultUserLimit || 50,
      currentUserCount: 0,
      features: enterpriseData.businessType?.features || [],
      registrationDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      status: 'success',
      data: newEnterprise
    };
  }

  // Update enterprise
  static async updateEnterprise(id: string, enterpriseData: Partial<Enterprise>): Promise<ApiResponse<Enterprise>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const enterprise = mockEnterprises.find(e => e._id === id);
    if (!enterprise) {
      throw new Error('Không tìm thấy doanh nghiệp');
    }
    
    const updatedEnterprise = {
      ...enterprise,
      ...enterpriseData,
      updatedAt: new Date().toISOString()
    };
    
    return {
      status: 'success',
      data: updatedEnterprise
    };
  }

  // Delete enterprise
  static async deleteEnterprise(id: string): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      status: 'success',
      data: { message: 'Xóa doanh nghiệp thành công' }
    };
  }

  // Get enterprise statistics
  static async getEnterpriseStats(): Promise<ApiResponse<{
    totalEnterprises: number;
    activeEnterprises: number;
    pendingEnterprises: number;
    suspendedEnterprises: number;
    subscriptionStats: Array<{ plan: string; count: number }>;
    businessTypeStats: Array<{ type: string; count: number }>;
  }>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      status: 'success',
      data: {
        totalEnterprises: mockEnterprises.length,
        activeEnterprises: mockEnterprises.filter(e => e.status === 'active').length,
        pendingEnterprises: mockEnterprises.filter(e => e.status === 'pending').length,
        suspendedEnterprises: mockEnterprises.filter(e => e.status === 'suspended').length,
        subscriptionStats: [
          { plan: 'basic', count: 1 },
          { plan: 'premium', count: 2 },
          { plan: 'enterprise', count: 1 }
        ],
        businessTypeStats: mockBusinessTypes.map(bt => ({
          type: bt.name,
          count: bt.enterpriseCount || 0
        }))
      }
    };
  }
}

export class BusinessTypeService {
  // Get all business types
  static async getBusinessTypes(): Promise<ApiResponse<BusinessType[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 'success',
      count: mockBusinessTypes.length,
      data: mockBusinessTypes
    };
  }

  // Get single business type
  static async getBusinessType(id: string): Promise<ApiResponse<BusinessType>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const businessType = mockBusinessTypes.find(bt => bt._id === id);
    if (!businessType) {
      throw new Error('Không tìm thấy loại doanh nghiệp');
    }
    
    return {
      status: 'success',
      data: businessType
    };
  }

  // Create business type
  static async createBusinessType(businessTypeData: Partial<BusinessType>): Promise<ApiResponse<BusinessType>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newBusinessType: BusinessType = {
      _id: 'bt' + Date.now(),
      name: businessTypeData.name || '',
      code: businessTypeData.code || '',
      description: businessTypeData.description || '',
      category: businessTypeData.category || '',
      features: businessTypeData.features || [],
      defaultUserLimit: businessTypeData.defaultUserLimit || 50,
      isActive: true,
      enterpriseCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      status: 'success',
      data: newBusinessType
    };
  }

  // Update business type
  static async updateBusinessType(id: string, businessTypeData: Partial<BusinessType>): Promise<ApiResponse<BusinessType>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const businessType = mockBusinessTypes.find(bt => bt._id === id);
    if (!businessType) {
      throw new Error('Không tìm thấy loại doanh nghiệp');
    }
    
    const updatedBusinessType = {
      ...businessType,
      ...businessTypeData,
      updatedAt: new Date().toISOString()
    };
    
    return {
      status: 'success',
      data: updatedBusinessType
    };
  }

  // Delete business type
  static async deleteBusinessType(id: string): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 'success',
      data: { message: 'Xóa loại doanh nghiệp thành công' }
    };
  }
}