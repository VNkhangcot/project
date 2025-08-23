'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const hourlyData = [
  { hour: '00:00', successful: 12, failed: 2 },
  { hour: '04:00', successful: 8, failed: 1 },
  { hour: '08:00', successful: 45, failed: 5 },
  { hour: '12:00', successful: 67, failed: 3 },
  { hour: '16:00', successful: 89, failed: 7 },
  { hour: '20:00', successful: 34, failed: 2 },
];

const dailyData = [
  { day: 'T2', successful: 234, failed: 12 },
  { day: 'T3', successful: 198, failed: 8 },
  { day: 'T4', successful: 267, failed: 15 },
  { day: 'T5', successful: 301, failed: 9 },
  { day: 'T6', successful: 278, failed: 6 },
  { day: 'T7', successful: 156, failed: 4 },
  { day: 'CN', successful: 134, failed: 3 },
];

export default function LoginAttempts() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập theo giờ (Hôm nay)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="successful" stroke="#10B981" strokeWidth={2} name="Thành công" />
                <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} name="Thất bại" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập theo ngày (Tuần này)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="successful" fill="#10B981" name="Thành công" />
                <Bar dataKey="failed" fill="#EF4444" name="Thất bại" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Login Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">234</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">đăng nhập thành công</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Thất bại hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">lần đăng nhập thất bại</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Tỷ lệ thành công
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">95.1%</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">trong 24h qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              IP độc nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">IP truy cập hôm nay</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}