'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'T1', users: 400, sessions: 240 },
  { name: 'T2', users: 300, sessions: 139 },
  { name: 'T3', users: 200, sessions: 980 },
  { name: 'T4', users: 278, sessions: 390 },
  { name: 'T5', users: 189, sessions: 480 },
  { name: 'T6', users: 239, sessions: 380 },
  { name: 'T7', users: 349, sessions: 430 },
];

export default function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động người dùng</CardTitle>
          <CardDescription>
            Thống kê người dùng và phiên làm việc trong 7 ngày qua
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#3B82F6" name="Người dùng" />
              <Bar dataKey="sessions" fill="#10B981" name="Phiên" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Xu hướng truy cập</CardTitle>
          <CardDescription>
            Biểu đồ đường thể hiện xu hướng truy cập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}