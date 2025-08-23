'use client';

import React from 'react';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthService } from '@/services/authService';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = AuthService.getStoredUser();
    const token = AuthService.getStoredToken();

    if (storedUser && token) {
      setUser(storedUser);
      // Optionally verify token with server
      verifyToken();
    }
    
    setLoading(false);
  }, []);

  const verifyToken = async () => {
    try {
      const response = await AuthService.getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // Clear invalid token
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password });
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await AuthService.updateProfile(userData);
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role || !user.role.permissions) return false;
    return user.role.permissions.includes(permission as any);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.role || !user.role.permissions) return false;
    return permissions.some(permission => user.role.permissions.includes(permission as any));
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    hasPermission,
    hasAnyPermission,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}