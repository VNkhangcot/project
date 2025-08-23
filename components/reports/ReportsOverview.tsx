'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

const reportStats = [
  {
    title: 'Báo cáo tháng này',
    value: '24',
    change: '+12%',
    changeType: 'positive' as const,
    icon: FileText,
  },
  {
    title: 'Tổng lượt tải',
    value: '1,847',
    change: '+8%',
    changeType: 'positive' as const,
    icon: Download,
  },
  {
    title: 'Báo cáo tự động',
    value: '15',
    change: '+3',
    changeType: 'positive' as const,
    icon: Calendar,
  },
  {
    title: 'Hiệu suất',
    value: '94%',
    change: '+2%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
];

const reportTypeData = [
  { name: 'Người dùng', value: 35, color: '#3B82F6' },
  { name: 'Bảo mật', value: 25, color: '#EF4444' },
  { name: 'Hiệu suất', value: 20, color: '#10B981' },
  { name: 'Tài chính', value: 20, color: '#F59E0B' },
];

const monthlyData = [
  { month: 'T1', reports: 18 },
  { month: 'T2', reports: 22 },
  { month: 'T3', reports: 19 },
  { month: 'T4', reports: 25 },
  { month: 'T5', reports: 28 },
  { month: 'T6', reports: 24 },
];

export default function ReportsOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Types */}
        <Card>
          <CardHeader>
            <CardTitle>Phân loại báo cáo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reportTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {reportTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reports" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Báo cáo người dùng tháng 1',
                type: 'Người dùng',
                status: 'completed',
                date: '2024-01-15',
                downloads: 45,
              },
              {
                name: 'Phân tích bảo mật tuần 3',
                type: 'Bảo mật',
                status: 'processing',
                date: '2024-01-14',
                downloads: 23,
              },
              {
                name: 'Hiệu suất hệ thống Q1',
                type: 'Hiệu suất',
                status: 'completed',
                date: '2024-01-13',
                downloads: 67,
              },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <div className="space-y-1">
                  <p className="font-medium">{report.name}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{report.type}</Badge>
                    <Badge variant={report.status === 'completed' ? 'secondary' : 'default'}>
                      {report.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{report.date}</p>
                  <p className="text-xs text-slate-500">{report.downloads} lượt tải</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}