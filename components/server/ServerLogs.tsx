'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Download, RefreshCw } from 'lucide-react';

const logs = [
  {
    id: 1,
    timestamp: '2024-01-15 10:30:15',
    level: 'INFO',
    service: 'nginx',
    message: '192.168.1.100 - "GET /api/users HTTP/1.1" 200 1234',
  },
  {
    id: 2,
    timestamp: '2024-01-15 10:30:10',
    level: 'ERROR',
    service: 'api-server',
    message: 'Database connection timeout after 30s',
  },
  {
    id: 3,
    timestamp: '2024-01-15 10:29:55',
    level: 'WARN',
    service: 'auth',
    message: 'Failed login attempt for user: admin@company.com from IP: 95.216.1.999',
  },
  {
    id: 4,
    timestamp: '2024-01-15 10:29:45',
    level: 'INFO',
    service: 'database',
    message: 'Query executed successfully: SELECT * FROM users WHERE active = true',
  },
  {
    id: 5,
    timestamp: '2024-01-15 10:29:30',
    level: 'DEBUG',
    service: 'cache',
    message: 'Cache hit rate: 89.5% (1234/1379 requests)',
  },
  {
    id: 6,
    timestamp: '2024-01-15 10:29:20',
    level: 'ERROR',
    service: 'worker',
    message: 'Failed to process job: email-queue-job-5678',
  },
];

export default function ServerLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevel, setLogLevel] = useState('all');
  const [service, setService] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = logLevel === 'all' || log.level.toLowerCase() === logLevel;
    const matchesService = service === 'all' || log.service === service;
    
    return matchesSearch && matchesLevel && matchesService;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <Badge variant="destructive">ERROR</Badge>;
      case 'WARN':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">WARN</Badge>;
      case 'INFO':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">INFO</Badge>;
      case 'DEBUG':
        return <Badge variant="outline">DEBUG</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm trong logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={logLevel} onValueChange={setLogLevel}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="error">ERROR</SelectItem>
                <SelectItem value="warn">WARN</SelectItem>
                <SelectItem value="info">INFO</SelectItem>
                <SelectItem value="debug">DEBUG</SelectItem>
              </SelectContent>
            </Select>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả dịch vụ</SelectItem>
                <SelectItem value="nginx">Nginx</SelectItem>
                <SelectItem value="api-server">API Server</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="cache">Cache</SelectItem>
                <SelectItem value="worker">Worker</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Display */}
      <Card>
        <CardHeader>
          <CardTitle>Server Logs ({filteredLogs.length} entries)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div 
                key={log.id}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-slate-500">{log.timestamp}</span>
                      {getLevelBadge(log.level)}
                      <Badge variant="outline" className="text-xs">{log.service}</Badge>
                    </div>
                    <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      {log.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}