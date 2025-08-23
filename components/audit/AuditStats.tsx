'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Activity, AlertTriangle, Shield, Users } from 'lucide-react';

const dailyActivityData = [
  { day: 'T2', total: 145, errors: 12, warnings: 23, info: 110 },
  { day: 'T3', total: 167, errors: 8, warnings: 19, info: 140 },
  { day: 'T4', total: 189, errors: 15, warnings: 31, info: 143 },
  { day: 'T5', total: 203, errors: 6, warnings: 28, info: 169 },
  { day: 'T6', total: 178, errors: 11, warnings: 25, info: 142 },
  { day: 'T7', total: 134, errors: 4, warnings: 18, info: 112 },
  { day: 'CN', total: 98, errors: 2, warnings: 12, info: 84 },
];

const actionTypeData = [
  { name: 'Đăng nhập/Đăng xuất', value: 35, color: '#3B82F6' },
  { name: 'Quản lý người dùng', value: 25, color: '#10B981' },
  { name: 'Cảnh báo bảo mật', value: 20, color: '#EF4444' },
  { name: 'Quản lý dữ liệu', value: 15, color: '#F59E0B' },
  { name: 'Khác', value: 5, color: '#8B5CF6' },
];

const hourlyTrendData = [
  { hour: '00:00', activities: 12 },
  { hour: '04:00', activities: 8 },
  { hour: '08:00', activities: 45 },
  { hour: '12:00', activities: 67 },
  { hour: '16:00', activities: 89 },
  { hour: '20:00', activities: 34 },
];

const topUsers = [
  { name: 'Admin User', actions: 234, percentage: 28 },
  { name: 'Manager User', actions: 189, percentage: 23 },
  { name: 'System', actions: 156, percentage: 19 },
  { name: 'Editor User', actions: 123, percentage: 15 },
  { name: 'Other Users', actions: 125, percentage: 15 },
];

export default function AuditStats() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Tổng hoạt động
            </CardTitle>
            <Activity className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,114</div>
            <p className="text-xs text-green-600">+12% so với tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Cảnh báo nghiêm trọng
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">58</div>
            <p className="text-xs text-red-600">+3 so với hôm qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Sự kiện bảo mật
            </CardTitle>
            <Shield className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">136</div>
            <p className="text-xs text-yellow-600">-8% so với tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Người dùng hoạt động
            </CardTitle>
            <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-green-600">+5 người dùng mới</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="errors" stackId="a" fill="#EF4444" name="Lỗi" />
                <Bar dataKey="warnings" stackId="a" fill="#F59E0B" name="Cảnh báo" />
                <Bar dataKey="info" stackId="a" fill="#3B82F6" name="Thông tin" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Types */}
        <Card>
          <CardHeader>
            <CardTitle>Phân loại hành động</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={actionTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {actionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {actionTypeData.map((item) => (
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng theo giờ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="activities" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle>Người dùng hoạt động nhiều nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {user.actions} hoạt động
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{user.percentage}%</p>
                    <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${user.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}