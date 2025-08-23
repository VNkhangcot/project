'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, Zap, Ban } from 'lucide-react';

const threats = [
  {
    id: 1,
    type: 'SQL Injection',
    severity: 'high',
    ip: '95.216.1.999',
    description: 'Phát hiện cố gắng SQL injection trên endpoint /api/users',
    time: '2 phút trước',
    status: 'blocked',
    location: 'Russia',
  },
  {
    id: 2,
    type: 'Brute Force',
    severity: 'medium',
    ip: '198.51.100.xxx',
    description: 'Nhiều lần đăng nhập thất bại liên tiếp',
    time: '5 phút trước',
    status: 'monitoring',
    location: 'Unknown',
  },
  {
    id: 3,
    type: 'DDoS',
    severity: 'high',
    ip: '203.0.113.xxx',
    description: 'Lưu lượng bất thường từ nhiều IP trong cùng subnet',
    time: '10 phút trước',
    status: 'mitigated',
    location: 'China',
  },
  {
    id: 4,
    type: 'XSS Attempt',
    severity: 'medium',
    ip: '192.0.2.xxx',
    description: 'Cố gắng chèn script độc hại qua form input',
    time: '15 phút trước',
    status: 'blocked',
    location: 'Vietnam',
  },
];

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'high':
      return <Badge variant="destructive">Cao</Badge>;
    case 'medium':
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Trung bình</Badge>;
    case 'low':
      return <Badge variant="outline">Thấp</Badge>;
    default:
      return <Badge variant="secondary">Không xác định</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'blocked':
      return <Badge variant="destructive">Đã chặn</Badge>;
    case 'monitoring':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Giám sát</Badge>;
    case 'mitigated':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Đã xử lý</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

export default function ThreatDetection() {
  return (
    <div className="space-y-6">
      {/* Threat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Mối đe dọa hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">đã phát hiện</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Đã chặn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">21</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">tự động chặn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Cần xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">cần can thiệp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Mức độ rủi ro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Trung bình</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">an toàn tương đối</p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Chi tiết mối đe dọa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {threats.map((threat) => (
              <div 
                key={threat.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{threat.type}</span>
                      {getSeverityBadge(threat.severity)}
                      {getStatusBadge(threat.status)}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {threat.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>IP: {threat.ip}</span>
                      <span>Vị trí: {threat.location}</span>
                      <span>{threat.time}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {threat.status === 'monitoring' && (
                      <Button size="sm" variant="outline">
                        <Ban className="h-4 w-4 mr-1" />
                        Chặn
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>WAF</span>
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
                <span>1,247</span>
              </div>
              <div className="flex justify-between">
                <span>Chặn hôm nay:</span>
                <span className="text-red-600 font-medium">21</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>DDoS Protection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Trạng thái:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Bảo vệ</Badge>
              </div>
              <div className="flex justify-between">
                <span>Ngưỡng:</span>
                <span>1000 req/min</span>
              </div>
              <div className="flex justify-between">
                <span>Tấn công chặn:</span>
                <span className="text-red-600 font-medium">3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ban className="h-5 w-5" />
              <span>IP Blacklist</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>IP đã chặn:</span>
                <span className="font-medium">1,456</span>
              </div>
              <div className="flex justify-between">
                <span>Tự động chặn:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Bật</Badge>
              </div>
              <div className="flex justify-between">
                <span>Cập nhật cuối:</span>
                <span className="text-xs">2 phút trước</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}