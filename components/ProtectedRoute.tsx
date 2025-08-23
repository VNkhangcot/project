'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  requireAll = false,
  fallbackPath = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, hasPermission, hasAnyPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check authentication
    if (!isAuthenticated) {
      router.push(fallbackPath);
      return;
    }

    // Check permissions if required
    if (requiredPermissions.length > 0) {
      const hasRequiredPermissions = requireAll
        ? requiredPermissions.every(permission => hasPermission(permission))
        : hasAnyPermission(requiredPermissions);

      if (!hasRequiredPermissions) {
        // Use replace instead of push to avoid navigation issues
        router.replace('/dashboard'); // Redirect to dashboard if no permission
        return;
      }
    }
  }, [user, loading, isAuthenticated, router, requiredPermissions, requireAll, fallbackPath, hasPermission, hasAnyPermission]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check permissions and render appropriate content
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every(permission => hasPermission(permission))
      : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Không có quyền truy cập
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bạn không có quyền truy cập vào trang này.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
