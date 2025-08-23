'use client';

import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import RecentActivity from '@/components/dashboard/RecentActivity';
import SystemHealth from '@/components/dashboard/SystemHealth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredPermissions={['view_analytics']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Chào mừng quay trở lại, {user?.name}
            </p>
          </div>

          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsCharts />
            <SystemHealth />
          </div>

          <RecentActivity />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}