'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Square, Play, Pause } from 'lucide-react';

const processes = [
  {
    pid: 1234,
    name: 'nginx',
    user: 'root',
    cpu: 15.2,
    memory: 8.5,
    status: 'running',
    uptime: '15d 8h',
  },
  {
    pid: 5678,
    name: 'node (API Server)',
    user: 'app',
    cpu: 25.8,
    memory: 12.3,
    status: 'running',
    uptime: '15d 8h',
  },
  {
    pid: 9012,
    name: 'postgresql',
    user: 'postgres',
    cpu: 8.1,
    memory: 18.7,
    status: 'running',
    uptime: '15d 8h',
  },
  {
    pid: 3456,
    name: 'redis-server',
    user: 'redis',
    cpu: 2.3,
    memory: 4.2,
    status: 'running',
    uptime: '15d 8h',
  },
  {
    pid: 7890,
    name: 'elasticsearch',
    user: 'elastic',
    cpu: 12.7,
    memory: 28.9,
    status: 'warning',
    uptime: '2d 4h',
  },
  {
    pid: 1111,
    name: 'worker-queue',
    user: 'app',
    cpu: 5.4,
    memory: 6.1,
    status: 'running',
    uptime: '1d 12h',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'running':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Chạy</Badge>;
    case 'stopped':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Dừng</Badge>;
    case 'warning':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>;
    case 'error':
      return <Badge variant="destructive">Lỗi</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

export default function ProcessMonitor() {
  return (
    <div className="space-y-6">
      {/* Process Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Tổng processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">processes đang chạy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              CPU trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">11.6%</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">sử dụng CPU</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Memory sử dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">13.1GB</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">/ 32GB tổng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Processes cảnh báo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">cần chú ý</p>
          </CardContent>
        </Card>
      </div>

      {/* Process Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Danh sách Processes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">PID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Process</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">User</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">CPU %</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Memory %</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Uptime</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Trạng thái</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process) => (
                  <tr 
                    key={process.pid} 
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-sm">{process.pid}</td>
                    <td className="py-3 px-4 font-medium">{process.name}</td>
                    <td className="py-3 px-4 text-sm">{process.user}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{process.cpu}%</span>
                        <Progress value={process.cpu} className="w-16 h-1" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{process.memory}%</span>
                        <Progress value={process.memory} className="w-16 h-1" />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{process.uptime}</td>
                    <td className="py-3 px-4">
                      {getStatusBadge(process.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="sm">
                          <Pause className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Square className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}