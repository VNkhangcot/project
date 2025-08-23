'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, MessageSquare, AlertTriangle } from 'lucide-react';

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    securityAlerts: true,
    systemUpdates: true,
    userActivity: false,
    reportGeneration: true,
    maintenanceAlerts: true,
    emailFrequency: 'immediate',
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    adminEmail: 'admin@company.com',
    smsNumber: '',
  });

  const handleSave = () => {
    console.log('Saving notification settings:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Kênh thông báo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4" />
              <div>
                <Label>Email</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Nhận thông báo qua email
                </p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-4 w-4" />
              <div>
                <Label>SMS</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Nhận thông báo qua tin nhắn
                </p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-4 w-4" />
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Thông báo đẩy trên trình duyệt
                </p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Loại thông báo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Cảnh báo bảo mật</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Thông báo về các mối đe dọa và vi phạm bảo mật
              </p>
            </div>
            <Switch
              checked={settings.securityAlerts}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, securityAlerts: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Cập nhật hệ thống</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Thông báo về các bản cập nhật và bảo trì
              </p>
            </div>
            <Switch
              checked={settings.systemUpdates}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, systemUpdates: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Hoạt động người dùng</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Thông báo về đăng nhập và hoạt động bất thường
              </p>
            </div>
            <Switch
              checked={settings.userActivity}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, userActivity: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Tạo báo cáo</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Thông báo khi báo cáo được tạo xong
              </p>
            </div>
            <Switch
              checked={settings.reportGeneration}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, reportGeneration: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Cảnh báo bảo trì</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Thông báo về lịch bảo trì hệ thống
              </p>
            </div>
            <Switch
              checked={settings.maintenanceAlerts}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceAlerts: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Cài đặt Email</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email quản trị</Label>
            <Input
              id="adminEmail"
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Tần suất gửi email</Label>
            <Select 
              value={settings.emailFrequency} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, emailFrequency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Ngay lập tức</SelectItem>
                <SelectItem value="hourly">Mỗi giờ</SelectItem>
                <SelectItem value="daily">Hàng ngày</SelectItem>
                <SelectItem value="weekly">Hàng tuần</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SMS Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Cài đặt SMS</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="smsNumber">Số điện thoại</Label>
            <Input
              id="smsNumber"
              type="tel"
              value={settings.smsNumber}
              onChange={(e) => setSettings(prev => ({ ...prev, smsNumber: e.target.value }))}
              placeholder="+84 xxx xxx xxx"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Giờ im lặng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Không gửi thông báo trong khoảng thời gian này (trừ cảnh báo khẩn cấp)
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quietStart">Bắt đầu</Label>
              <Input
                id="quietStart"
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => setSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quietEnd">Kết thúc</Label>
              <Input
                id="quietEnd"
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => setSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Lưu cài đặt thông báo
        </Button>
      </div>
    </div>
  );
}