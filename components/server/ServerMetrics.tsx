'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, HardDrive, Wifi, Database, Activity } from 'lucide-react';

const metricsData = [
  { time: '10:00', cpu: 45, memory: 67, network: 23, disk: 34 },
  { time: '10:05', cpu: 52, memory: 71, network: 28, disk: 36 },
  { time: '10:10', cpu: 48, memory: 69, network: 31, disk: 35 },
  { time: '10:15', cpu: 61, memory: 73, network: 25, disk: 37 },
  { time: '10:20', cpu: 55, memory: 70, network: 29, disk: 38 },
  { time: '10:25', cpu: 49, memory: 68, network: 27, disk: 36 },
];

const currentMetrics = [
  {
    name: 'CPU Usage',
    value: 55,
    max: 100,
    status: 'normal',
    icon: Cpu,
    color: 'bg-blue-500',
  },
  {
    name: 'Memory',
    value: 68,
    max: 100,
    status: 'warning',
    icon: HardDrive,
    color: 'bg-yellow-500',
  },
  {
    name: 'Disk Usage',
    value: 36,
    max: 100,
    status: 'normal',
    icon: Database,
    color: 'bg-green-500',
  },
  {
    name: 'Network I/O',
    value: 27,
    max: 100,
    status: 'normal',
    icon: Wifi,
    color: 'bg-purple-500',
  },
];

export default function ServerMetrics() {
  return (
    <div className="space-y-6">
      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {metric.name}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold">{metric.value}%</div>
                <Progress value={metric.value} className="h-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">0%</span>
                  <span className={`font-medium ${
                    metric.status === 'normal' ? 'text-green-600' :
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metric.status === 'normal' ? 'Bình thường' :
                     metric.status === 'warning' ? 'Cảnh báo' : 'Nghiêm trọng'}
                  </span>
                  <span className="text-slate-500">100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Historical Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ theo thời gian thực</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#EF4444" strokeWidth={2} name="Memory %" />
              <Line type="monotone" dataKey="network" stroke="#10B981" strokeWidth={2} name="Network %" />
              <Line type="monotone" dataKey="disk" stroke="#8B5CF6" strokeWidth={2} name="Disk %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Server Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Server</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Hostname:</span>
                <span className="font-mono">web-server-01</span>
              </div>
              <div className="flex justify-between">
                <span>OS:</span>
                <span>Ubuntu 22.04 LTS</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span>15 ngày 8 giờ 23 phút</span>
              </div>
              <div className="flex justify-between">
                <span>Load Average:</span>
                <span>0.85, 0.92, 1.01</span>
              </div>
              <div className="flex justify-between">
                <span>CPU Cores:</span>
                <span>8 cores</span>
              </div>
              <div className="flex justify-between">
                <span>Total Memory:</span>
                <span>32 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tình trạng dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Web Server (Nginx)', status: 'running' },
                { name: 'Database (PostgreSQL)', status: 'running' },
                { name: 'Redis Cache', status: 'running' },
                { name: 'Elasticsearch', status: 'warning' },
                { name: 'Background Jobs', status: 'running' },
                { name: 'File Storage', status: 'running' },
              ].map((service) => (
                <div key={service.name} className="flex justify-between items-center">
                  <span>{service.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'running' ? 'bg-green-500' :
                      service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm">
                      {service.status === 'running' ? 'Hoạt động' :
                       service.status === 'warning' ? 'Cảnh báo' : 'Dừng'}
                    </span>
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