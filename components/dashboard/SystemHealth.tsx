'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Cpu, HardDrive, Wifi, Database } from 'lucide-react';

const systemMetrics = [
  {
    name: 'CPU Usage',
    value: 45,
    status: 'normal',
    icon: Cpu,
  },
  {
    name: 'Memory',
    value: 67,
    status: 'warning',
    icon: HardDrive,
  },
  {
    name: 'Network',
    value: 23,
    status: 'normal',
    icon: Wifi,
  },
  {
    name: 'Database',
    value: 89,
    status: 'critical',
    icon: Database,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'critical':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'normal':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Normal</Badge>;
    case 'warning':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default function SystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tình trạng hệ thống</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {systemMetrics.map((metric) => (
          <div key={metric.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <metric.icon className="h-4 w-4" />
                <span className="font-medium">{metric.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">{metric.value}%</span>
                {getStatusBadge(metric.status)}
              </div>
            </div>
            <Progress 
              value={metric.value} 
              className="h-2"
              style={{
                '--progress-foreground': `var(--${getStatusColor(metric.status).replace('bg-', '')})`
              } as any}
            />
          </div>
        ))}

        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="font-semibold mb-2">Trạng thái tổng quan</h4>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Hệ thống hoạt động bình thường</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}