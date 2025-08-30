import { apiClient } from '@/lib/api';
import { LoginCredentials, RegisterData, AuthResponse, User, ApiResponse } from '@/lib/types';

export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/login', credentials);
    
    // Store tokens in localStorage
    if (response.data?.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return {
      status: response.status,
      message: response.message,
      token: response.data?.tokens?.accessToken || '',
      data: response.data?.user
    };
  }

  // Register user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/register', userData);
    
    return {
      status: response.status,
      message: response.message,
      token: '',
      data: response.data
    };
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>('/auth/profile');
  }

  // Update profile
  static async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', userData);
    
    // Update stored user data
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  }

  // Change password
  static async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.put<any>('/auth/change-password', passwordData);
    
    return {
      status: response.status,
      message: response.message,
      token: '',
      data: {} as User
    };
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>('/auth/forgot-password', { email });
  }

  // Reset password
  static async resetPassword(data: { token: string; password: string; confirmPassword: string }): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/reset-password', data);
    
    return {
      status: response.status,
      message: response.message,
      token: '',
      data: {} as User
    };
  }

  // Refresh token
  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<any>('/auth/refresh-token', { refreshToken });
    
    // Update tokens
    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return {
      status: response.status,
      message: response.message,
      token: response.data?.accessToken || '',
      data: {} as User
    };
  }

  // Verify email
  static async verifyEmail(token: string): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>('/auth/verify-email', { token });
  }

  // Resend verification
  static async resendVerification(): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>('/auth/resend-verification');
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
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
    return localStorage.getItem('accessToken');
  }
}
