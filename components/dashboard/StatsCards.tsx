'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Activity, Server } from 'lucide-react';

const stats = [
  {
    title: 'Tổng người dùng',
    value: '2,847',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: 'Phiên hoạt động',
    value: '1,234',
    change: '+8%',
    changeType: 'positive' as const,
    icon: Activity,
  },
  {
    title: 'Cảnh báo bảo mật',
    value: '23',
    change: '-5%',
    changeType: 'negative' as const,
    icon: Shield,
  },
  {
    title: 'Uptime server',
    value: '99.9%',
    change: '+0.1%',
    changeType: 'positive' as const,
    icon: Server,
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change} so với tháng trước
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}