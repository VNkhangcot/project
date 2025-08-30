import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

// Inventory related interfaces
export interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  unit: string;
  price: {
    cost: number;
    selling: number;
  };
  stock: {
    current: number;
    minimum: number;
    maximum: number;
  };
  supplier: {
    name: string;
    contact: string;
    email: string;
  };
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  _id: string;
  product: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference: string;
  date: string;
  employee: string;
  notes?: string;
  createdAt: string;
}

export interface Supplier {
  _id: string;
  name: string;
  code: string;
  contact: {
    person: string;
    phone: string;
    email: string;
    address: any;
  };
  products: string[];
  status: 'active' | 'inactive';
  rating: number;
  totalOrders: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockAlert {
  _id: string;
  product: Product;
  type: 'low_stock' | 'out_of_stock' | 'overstock';
  currentStock: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

export class InventoryService {
  // Product Management
  static async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
    lowStock?: boolean;
  }): Promise<ApiResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/inventory/products?${queryString}` : '/inventory/products';
    
    return apiClient.get<ApiResponse<Product[]>>(endpoint);
  }

  static async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<ApiResponse<Product>>(`/inventory/products/${id}`);
  }

  static async createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.post<ApiResponse<Product>>('/inventory/products', data);
  }

  static async updateProduct(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.put<ApiResponse<Product>>(`/inventory/products/${id}`, data);
  }

  static async deleteProduct(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/inventory/products/${id}`);
  }

  static async getProductsByCategory(): Promise<ApiResponse<Array<{
    category: string;
    count: number;
    products: Product[];
  }>>> {
    return apiClient.get<ApiResponse<any>>('/inventory/products/by-category');
  }

  // Stock Management
  static async getStock(params?: {
    page?: number;
    limit?: number;
    product?: string;
    lowStock?: boolean;
  }): Promise<ApiResponse<Array<{
    product: Product;
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    lastMovement: string;
  }>>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/inventory/stock?${queryString}` : '/inventory/stock';
    
    return apiClient.get<ApiResponse<any>>(endpoint);
  }

  static async stockIn(data: {
    product: string;
    quantity: number;
    reason: string;
    reference?: string;
    notes?: string;
  }): Promise<ApiResponse<StockMovement>> {
    return apiClient.post<ApiResponse<StockMovement>>('/inventory/stock/in', data);
  }

  static async stockOut(data: {
    product: string;
    quantity: number;
    reason: string;
    reference?: string;
    notes?: string;
  }): Promise<ApiResponse<StockMovement>> {
    return apiClient.post<ApiResponse<StockMovement>>('/inventory/stock/out', data);
  }

  static async stockAdjustment(data: {
    product: string;
    quantity: number;
    reason: string;
    notes?: string;
  }): Promise<ApiResponse<StockMovement>> {
    return apiClient.post<ApiResponse<StockMovement>>('/inventory/stock/adjustment', data);
  }

  static async getStockMovements(params?: {
    page?: number;
    limit?: number;
    product?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<StockMovement[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/inventory/stock/movements?${queryString}` : '/inventory/stock/movements';
    
    return apiClient.get<ApiResponse<StockMovement[]>>(endpoint);
  }

  // Supplier Management
  static async getSuppliers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Supplier[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/inventory/suppliers?${queryString}` : '/inventory/suppliers';
    
    return apiClient.get<ApiResponse<Supplier[]>>(endpoint);
  }

  static async getSupplier(id: string): Promise<ApiResponse<Supplier>> {
    return apiClient.get<ApiResponse<Supplier>>(`/inventory/suppliers/${id}`);
  }

  static async createSupplier(data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
    return apiClient.post<ApiResponse<Supplier>>('/inventory/suppliers', data);
  }

  static async updateSupplier(id: string, data: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
    return apiClient.put<ApiResponse<Supplier>>(`/inventory/suppliers/${id}`, data);
  }

  static async deleteSupplier(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/inventory/suppliers/${id}`);
  }

  // Stock Alerts
  static async getStockAlerts(params?: {
    type?: string;
    severity?: string;
    resolved?: boolean;
  }): Promise<ApiResponse<StockAlert[]>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/inventory/alerts?${queryString}` : '/inventory/alerts';
    
    return apiClient.get<ApiResponse<StockAlert[]>>(endpoint);
  }

  static async resolveAlert(id: string): Promise<ApiResponse<any>> {
    return apiClient.put<ApiResponse<any>>(`/inventory/alerts/${id}/resolve`);
  }

  // Inventory Reports
  static async getInventoryReport(params?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    supplier?: string;
  }): Promise<ApiResponse<{
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    topMovingProducts: Array<{
      product: Product;
      totalMovement: number;
    }>;
    categoryBreakdown: Array<{
      category: string;
      count: number;
      value: number;
    }>;
  }>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/inventory/reports?${queryString}` : '/inventory/reports';
    
    return apiClient.get<ApiResponse<any>>(endpoint);
  }

  static async getStockValuation(): Promise<ApiResponse<{
    totalValue: number;
    valueByCategory: Array<{
      category: string;
      value: number;
      percentage: number;
    }>;
    valueBySupplier: Array<{
      supplier: string;
      value: number;
      percentage: number;
    }>;
  }>> {
    return apiClient.get<ApiResponse<any>>('/inventory/reports/valuation');
  }

  static async getMovementAnalysis(params: {
    startDate: string;
    endDate: string;
    type?: string;
  }): Promise<ApiResponse<{
    totalMovements: number;
    movementsByType: Array<{
      type: string;
      count: number;
      quantity: number;
    }>;
    movementsByProduct: Array<{
      product: Product;
      inQuantity: number;
      outQuantity: number;
      netMovement: number;
    }>;
    dailyMovements: Array<{
      date: string;
      inQuantity: number;
      outQuantity: number;
    }>;
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<ApiResponse<any>>(`/inventory/reports/movements?${queryParams.toString()}`);
  }

  // Inventory Statistics
  static async getInventoryStats(): Promise<ApiResponse<{
    totalProducts: number;
    totalCategories: number;
    totalSuppliers: number;
    lowStockAlerts: number;
    outOfStockItems: number;
    totalInventoryValue: number;
    averageStockLevel: number;
  }>> {
    return apiClient.get<ApiResponse<any>>('/inventory/stats');
  }

  // Barcode and QR Code
  static async generateBarcode(productId: string): Promise<ApiResponse<{ barcodeUrl: string }>> {
    return apiClient.post<ApiResponse<any>>(`/inventory/products/${productId}/barcode`);
  }

  static async scanBarcode(barcode: string): Promise<ApiResponse<Product>> {
    return apiClient.get<ApiResponse<Product>>(`/inventory/products/barcode/${barcode}`);
  }
}
