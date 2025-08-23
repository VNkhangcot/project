'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, Lock, Eye } from 'lucide-react';

const securityMetrics = [
  {
    title: 'Mức độ bảo mật',
    value: 85,
    status: 'good',
    description: 'Tốt',
  },
  {
    title: 'Lỗ hổng phát hiện',
    value: 3,
    status: 'warning',
    description: 'Cần xử lý',
  },
  {
    title: 'Firewall',
    value: 100,
    status: 'excellent',
    description: 'Hoạt động tốt',
  },
  {
    title: 'Mã hóa dữ liệu',
    value: 95,
    status: 'good',
    description: 'Được bảo vệ',
  },
];

const securityAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Nhiều lần đăng nhập thất bại',
    description: 'IP 192.168.1.999 có 5 lần đăng nhập thất bại trong 10 phút',
    time: '5 phút trước',
  },
  {
    id: 2,
    type: 'info',
    title: 'Cập nhật bảo mật',
    description: 'Hệ thống đã được cập nhật phiên bản bảo mật mới',
    time: '2 giờ trước',
  },
  {
    id: 3,
    type: 'error',
    title: 'Truy cập bất thường',
    description: 'Phát hiện truy cập từ vị trí địa lý bất thường',
    time: '1 ngày trước',
  },
];

export default function SecurityMonitoring() {
  return (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {typeof metric.value === 'number' && metric.title !== 'Lỗ hổng phát hiện' 
                    ? `${metric.value}%` 
                    : metric.value}
                </div>
                <Progress value={typeof metric.value === 'number' ? metric.value : 0} className="h-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Cảnh báo bảo mật</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityAlerts.map((alert) => (
              <Alert key={alert.id} variant={alert.type === 'error' ? 'destructive' : 'default'}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{alert.title}</span>
                      <Badge variant={
                        alert.type === 'error' ? 'destructive' : 
                        alert.type === 'warning' ? 'secondary' : 'outline'
                      }>
                        {alert.type === 'error' ? 'Nghiêm trọng' : 
                         alert.type === 'warning' ? 'Cảnh báo' : 'Thông tin'}
                      </Badge>
                    </div>
                    <AlertDescription>{alert.description}</AlertDescription>
                    <p className="text-xs text-slate-500">{alert.time}</p>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Firewall</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Trạng thái:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Hoạt động</Badge>
              </div>
              <div className="flex justify-between">
                <span>Quy tắc:</span>
                <span>247 quy tắc</span>
              </div>
              <div className="flex justify-between">
                <span>Chặn:</span>
                <span>1,234 lần</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Mã hóa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>SSL/TLS:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Kích hoạt</Badge>
              </div>
              <div className="flex justify-between">
                <span>Database:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Mã hóa</Badge>
              </div>
              <div className="flex justify-between">
                <span>Backup:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Bảo mật</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Giám sát</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span>99.9%</span>
              </div>
              <div className="flex justify-between">
                <span>Phiên hoạt động:</span>
                <span>1,234</span>
              </div>
              <div className="flex justify-between">
                <span>Cảnh báo:</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">3 cảnh báo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}