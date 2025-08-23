'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, User, Shield, Database, Settings, AlertTriangle } from 'lucide-react';

const auditLogs = [
  {
    id: 1,
    timestamp: '2024-01-15 10:30:15',
    user: 'Admin User',
    action: 'USER_LOGIN',
    resource: 'Authentication',
    details: 'Đăng nhập thành công từ IP: 192.168.1.100',
    severity: 'info',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: 2,
    timestamp: '2024-01-15 10:29:45',
    user: 'Manager User',
    action: 'USER_UPDATE',
    resource: 'User Management',
    details: 'Cập nhật thông tin người dùng: john.doe@company.com',
    severity: 'warning',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  },
  {
    id: 3,
    timestamp: '2024-01-15 10:28:30',
    user: 'System',
    action: 'SECURITY_ALERT',
    resource: 'Security',
    details: 'Phát hiện nhiều lần đăng nhập thất bại từ IP: 95.216.1.999',
    severity: 'error',
    ip: '95.216.1.999',
    userAgent: 'Unknown',
  },
  {
    id: 4,
    timestamp: '2024-01-15 10:27:20',
    user: 'Admin User',
    action: 'ROLE_ASSIGN',
    resource: 'Role Management',
    details: 'Gán vai trò Manager cho người dùng: jane.smith@company.com',
    severity: 'info',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: 5,
    timestamp: '2024-01-15 10:26:10',
    user: 'Database System',
    action: 'DATA_BACKUP',
    resource: 'Database',
    details: 'Sao lưu dữ liệu tự động hoàn thành thành công',
    severity: 'info',
    ip: 'localhost',
    userAgent: 'System Process',
  },
  {
    id: 6,
    timestamp: '2024-01-15 10:25:05',
    user: 'Editor User',
    action: 'DATA_DELETE',
    resource: 'Content Management',
    details: 'Xóa bài viết: "Hướng dẫn sử dụng hệ thống"',
    severity: 'warning',
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  },
];

const getActionIcon = (action: string) => {
  switch (action) {
    case 'USER_LOGIN':
    case 'USER_LOGOUT':
      return <User className="h-4 w-4" />;
    case 'SECURITY_ALERT':
      return <Shield className="h-4 w-4" />;
    case 'DATA_BACKUP':
    case 'DATA_DELETE':
    case 'DATA_UPDATE':
      return <Database className="h-4 w-4" />;
    case 'ROLE_ASSIGN':
    case 'PERMISSION_CHANGE':
      return <Settings className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'error':
      return <Badge variant="destructive">Nghiêm trọng</Badge>;
    case 'warning':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>;
    case 'info':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Thông tin</Badge>;
    default:
      return <Badge variant="outline">Khác</Badge>;
  }
};

const getActionBadge = (action: string) => {
  const actionMap: Record<string, { label: string; color: string }> = {
    'USER_LOGIN': { label: 'Đăng nhập', color: 'bg-green-100 text-green-800' },
    'USER_LOGOUT': { label: 'Đăng xuất', color: 'bg-gray-100 text-gray-800' },
    'USER_UPDATE': { label: 'Cập nhật người dùng', color: 'bg-blue-100 text-blue-800' },
    'SECURITY_ALERT': { label: 'Cảnh báo bảo mật', color: 'bg-red-100 text-red-800' },
    'ROLE_ASSIGN': { label: 'Gán vai trò', color: 'bg-purple-100 text-purple-800' },
    'DATA_BACKUP': { label: 'Sao lưu dữ liệu', color: 'bg-indigo-100 text-indigo-800' },
    'DATA_DELETE': { label: 'Xóa dữ liệu', color: 'bg-red-100 text-red-800' },
  };

  const config = actionMap[action] || { label: action, color: 'bg-gray-100 text-gray-800' };
  
  return (
    <Badge variant="secondary" className={config.color}>
      {config.label}
    </Badge>
  );
};

export default function AuditLogs() {
  const [selectedLog, setSelectedLog] = useState<any>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhật ký Audit ({auditLogs.length} entries)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div 
              key={log.id}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => setSelectedLog(log)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-mono text-xs text-slate-500">{log.timestamp}</span>
                      {getSeverityBadge(log.severity)}
                      {getActionBadge(log.action)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" alt={log.user} />
                        <AvatarFallback className="text-xs">{log.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{log.user}</span>
                      <span className="text-xs text-slate-500">→</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">{log.resource}</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {log.details}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>IP: {log.ip}</span>
                      <span className="truncate max-w-xs">UA: {log.userAgent}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Chi tiết
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}