'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import AuditLogs from '@/components/audit/AuditLogs';
import AuditFilters from '@/components/audit/AuditFilters';
import AuditStats from '@/components/audit/AuditStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuditPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Theo dõi và kiểm tra các hoạt động hệ thống
          </p>
        </div>

        <Tabs defaultValue="logs" className="w-full">
          <TabsList>
            <TabsTrigger value="logs">Nhật ký</TabsTrigger>
            <TabsTrigger value="stats">Thống kê</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logs" className="space-y-6">
            <AuditFilters />
            <AuditLogs />
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
            <AuditStats />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}