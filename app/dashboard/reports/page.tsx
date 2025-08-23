'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportsOverview from '@/components/reports/ReportsOverview';
import ReportGenerator from '@/components/reports/ReportGenerator';
import ReportHistory from '@/components/reports/ReportHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Tạo và quản lý các báo cáo hệ thống
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="generator">Tạo báo cáo</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <ReportsOverview />
          </TabsContent>
          
          <TabsContent value="generator" className="space-y-6">
            <ReportGenerator />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <ReportHistory />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}