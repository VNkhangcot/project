'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: any;
  onClose: () => void;
}

const allPermissions = [
  { id: 'read', label: 'Xem dữ liệu', category: 'Cơ bản' },
  { id: 'write', label: 'Chỉnh sửa', category: 'Cơ bản' },
  { id: 'delete', label: 'Xóa', category: 'Cơ bản' },
  { id: 'manage_users', label: 'Quản lý người dùng', category: 'Quản lý' },
  { id: 'manage_roles', label: 'Quản lý vai trò', category: 'Quản lý' },
  { id: 'view_analytics', label: 'Xem báo cáo', category: 'Báo cáo' },
  { id: 'export_data', label: 'Xuất dữ liệu', category: 'Báo cáo' },
  { id: 'system_settings', label: 'Cài đặt hệ thống', category: 'Hệ thống' },
  { id: 'audit_logs', label: 'Xem nhật ký audit', category: 'Hệ thống' },
];

export default function RoleDialog({ open, onOpenChange, role, onClose }: RoleDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        permissions: role.permissions || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: [],
      });
    }
  }, [role]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving role:', formData);
    onClose();
  };

  const permissionsByCategory = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof allPermissions>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
          </DialogTitle>
          <DialogDescription>
            {role ? 'Cập nhật thông tin và quyền hạn vai trò' : 'Tạo vai trò mới và phân quyền'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên vai trò</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên vai trò"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả vai trò và trách nhiệm"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Phân quyền</h3>
            {Object.entries(permissionsByCategory).map(([category, permissions]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                        />
                        <Label htmlFor={permission.id} className="text-sm">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {role ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}