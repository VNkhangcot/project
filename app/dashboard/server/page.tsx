'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ServerMetrics from '@/components/server/ServerMetrics';
import ServerLogs from '@/components/server/ServerLogs';
import ProcessMonitor from '@/components/server/ProcessMonitor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ServerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Giám sát Server</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Theo dõi hiệu suất và tình trạng server
          </p>
        </div>

        <Tabs defaultValue="metrics" className="w-full">
          <TabsList>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="processes">Processes</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-6">
            <ServerMetrics />
          </TabsContent>
          
          <TabsContent value="processes" className="space-y-6">
            <ProcessMonitor />
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-6">
            <ServerLogs />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}