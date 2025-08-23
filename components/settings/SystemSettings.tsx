'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Server, Database, HardDrive, Cpu, RefreshCw, Download } from 'lucide-react';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    logLevel: 'info',
    maxLogSize: 100,
    cacheEnabled: true,
    cacheSize: 512,
    compressionEnabled: true,
    apiRateLimit: 1000,
  });

  const [systemInfo] = useState({
    version: '2.1.0',
    uptime: '15 ngày 8 giờ 23 phút',
    lastBackup: '2024-01-15 02:00:00',
    diskUsage: 65,
    memoryUsage: 72,
    cpuUsage: 45,
    activeConnections: 234,
  });

  const handleSave = () => {
    console.log('Saving system settings:', settings);
  };

  const handleBackupNow = () => {
    console.log('Starting manual backup...');
  };

  const handleClearCache = () => {
    console.log('Clearing cache...');
  };

  return (
    <div className="space-y-6">
      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>Thông tin hệ thống</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Phiên bản:</span>
                <Badge variant="outline">v{systemInfo.version}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span className="text-sm">{systemInfo.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span>Backup cuối:</span>
                <span className="text-sm">{systemInfo.lastBackup}</span>
              </div>
              <div className="flex justify-between">
                <span>Kết nối:</span>
                <span className="text-sm">{systemInfo.activeConnections}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Disk Usage</span>
                  <span className="text-sm">{systemInfo.diskUsage}%</span>
                </div>
                <Progress value={systemInfo.diskUsage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Memory</span>
                  <span className="text-sm">{systemInfo.memoryUsage}%</span>
                </div>
                <Progress value={systemInfo.memoryUsage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">CPU</span>
                  <span className="text-sm">{systemInfo.cpuUsage}%</span>
                </div>
                <Progress value={systemInfo.cpuUsage} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>Bảo trì hệ thống</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Chế độ bảo trì</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tạm dừng truy cập hệ thống để bảo trì
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
            />
          </div>
          {settings.maintenanceMode && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Hệ thống đang ở chế độ bảo trì. Người dùng sẽ không thể truy cập.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Cài đặt Backup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Tự động backup</Label>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBackup: checked }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tần suất backup</Label>
              <Select 
                value={settings.backupFrequency} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, backupFrequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Mỗi giờ</SelectItem>
                  <SelectItem value="daily">Hàng ngày</SelectItem>
                  <SelectItem value="weekly">Hàng tuần</SelectItem>
                  <SelectItem value="monthly">Hàng tháng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lưu trữ (ngày)</Label>
              <Select 
                value={settings.backupRetention.toString()} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, backupRetention: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 ngày</SelectItem>
                  <SelectItem value="30">30 ngày</SelectItem>
                  <SelectItem value="90">90 ngày</SelectItem>
                  <SelectItem value="365">1 năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleBackupNow} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Backup ngay
          </Button>
        </CardContent>
      </Card>

      {/* Logging */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mức độ log</Label>
              <Select 
                value={settings.logLevel} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, logLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kích thước tối đa (MB)</Label>
              <Input
                type="number"
                value={settings.maxLogSize}
                onChange={(e) => setSettings(prev => ({ ...prev, maxLogSize: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cpu className="h-5 w-5" />
            <span>Hiệu suất</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bật Cache</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cải thiện tốc độ phản hồi
              </p>
            </div>
            <Switch
              checked={settings.cacheEnabled}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, cacheEnabled: checked }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kích thước Cache (MB)</Label>
              <Input
                type="number"
                value={settings.cacheSize}
                onChange={(e) => setSettings(prev => ({ ...prev, cacheSize: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>API Rate Limit (req/min)</Label>
              <Input
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => setSettings(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Nén dữ liệu</Label>
            <Switch
              checked={settings.compressionEnabled}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compressionEnabled: checked }))}
            />
          </div>

          <Button onClick={handleClearCache} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Xóa Cache
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Lưu cài đặt hệ thống
        </Button>
      </div>
    </div>
  );
}