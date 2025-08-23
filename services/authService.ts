import { apiClient } from '@/lib/api';
import { LoginCredentials, RegisterData, AuthResponse, User, ApiResponse } from '@/lib/types';
import { mockCredentials } from '@/lib/mockData';

export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Mock authentication for development
    const mockUser = mockCredentials[credentials.email as keyof typeof mockCredentials];
    
    if (!mockUser || mockUser.password !== credentials.password) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response: AuthResponse = {
      status: 'success',
      message: 'Đăng nhập thành công',
      token: 'mock-jwt-token-' + Date.now(),
      data: mockUser.user
    };
    
    // Store token in localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response;
  }

  // Register user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>('/auth/me');
  }

  // Update profile
  static async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', userData);
    
    // Update user in localStorage
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  }

  // Change password
  static async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<AuthResponse> {
    return apiClient.put<AuthResponse>('/auth/change-password', passwordData);
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>('/auth/forgot-password', { email });
  }

  // Reset password
  static async resetPassword(token: string, password: string): Promise<AuthResponse> {
    return apiClient.put<AuthResponse>(`/auth/reset-password/${token}`, { password });
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  // Get stored user
  static getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get stored token
  static getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }
}