'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Key, AlertTriangle, Clock } from 'lucide-react';

export default function SecuritySettings() {
  const [settings, setSettings] = useState({
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: false,
    ipWhitelist: '',
    auditLogging: true,
    encryptionLevel: 'aes256',
  });

  const handleSave = () => {
    console.log('Saving security settings:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Chính sách mật khẩu</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Độ dài tối thiểu</Label>
            <Select 
              value={settings.passwordMinLength.toString()} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, passwordMinLength: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 ký tự</SelectItem>
                <SelectItem value="8">8 ký tự</SelectItem>
                <SelectItem value="10">10 ký tự</SelectItem>
                <SelectItem value="12">12 ký tự</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Yêu cầu ký tự đặc biệt</Label>
              <Switch
                checked={settings.passwordRequireSpecial}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, passwordRequireSpecial: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Yêu cầu số</Label>
              <Switch
                checked={settings.passwordRequireNumbers}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, passwordRequireNumbers: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Yêu cầu chữ hoa</Label>
              <Switch
                checked={settings.passwordRequireUppercase}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, passwordRequireUppercase: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Quản lý phiên</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Thời gian hết hạn phiên (phút)</Label>
            <Select 
              value={settings.sessionTimeout.toString()} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 phút</SelectItem>
                <SelectItem value="30">30 phút</SelectItem>
                <SelectItem value="60">1 giờ</SelectItem>
                <SelectItem value="120">2 giờ</SelectItem>
                <SelectItem value="480">8 giờ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Login Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Bảo mật đăng nhập</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số lần đăng nhập thất bại tối đa</Label>
              <Select 
                value={settings.maxLoginAttempts.toString()} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 lần</SelectItem>
                  <SelectItem value="5">5 lần</SelectItem>
                  <SelectItem value="10">10 lần</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Thời gian khóa tài khoản (phút)</Label>
              <Select 
                value={settings.lockoutDuration.toString()} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, lockoutDuration: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 phút</SelectItem>
                  <SelectItem value="15">15 phút</SelectItem>
                  <SelectItem value="30">30 phút</SelectItem>
                  <SelectItem value="60">1 giờ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Xác thực hai yếu tố (2FA)</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Bắt buộc 2FA cho tất cả người dùng
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Bảo mật nâng cao</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Mức độ mã hóa</Label>
            <Select 
              value={settings.encryptionLevel} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, encryptionLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aes128">AES-128</SelectItem>
                <SelectItem value="aes256">AES-256</SelectItem>
                <SelectItem value="rsa2048">RSA-2048</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipWhitelist">IP Whitelist</Label>
            <Input
              id="ipWhitelist"
              value={settings.ipWhitelist}
              onChange={(e) => setSettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
              placeholder="192.168.1.0/24, 10.0.0.0/8"
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Danh sách IP được phép truy cập (phân cách bằng dấu phẩy)
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Audit Logging</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ghi lại tất cả hoạt động hệ thống
              </p>
            </div>
            <Switch
              checked={settings.auditLogging}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auditLogging: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Trạng thái bảo mật</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>SSL/TLS</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Kích hoạt</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Firewall</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Hoạt động</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Intrusion Detection</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Bảo vệ</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Backup Encryption</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Mã hóa</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Lưu cài đặt bảo mật
        </Button>
      </div>
    </div>
  );
}