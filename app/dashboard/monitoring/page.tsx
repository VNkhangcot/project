'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import SecurityMonitoring from '@/components/monitoring/SecurityMonitoring';
import LoginAttempts from '@/components/monitoring/LoginAttempts';
import ThreatDetection from '@/components/monitoring/ThreatDetection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MonitoringPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Giám sát bảo mật</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Theo dõi và phát hiện các mối đe dọa bảo mật
          </p>
        </div>

        <Tabs defaultValue="security" className="w-full">
          <TabsList>
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="threats">Phát hiện mối đe dọa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security" className="space-y-6">
            <SecurityMonitoring />
          </TabsContent>
          
          <TabsContent value="login" className="space-y-6">
            <LoginAttempts />
          </TabsContent>
          
          <TabsContent value="threats" className="space-y-6">
            <ThreatDetection />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}