'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { BusinessType } from '@/lib/types';

interface BusinessTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessType?: BusinessType | null;
  onClose: () => void;
}

const availableFeatures = [
  { id: 'user_management', label: 'Quản lý người dùng', description: 'Tạo, sửa, xóa tài khoản người dùng' },
  { id: 'analytics', label: 'Phân tích dữ liệu', description: 'Xem báo cáo và thống kê chi tiết' },
  { id: 'api_access', label: 'Truy cập API', description: 'Sử dụng API để tích hợp hệ thống' },
  { id: 'custom_reports', label: 'Báo cáo tùy chỉnh', description: 'Tạo báo cáo theo yêu cầu riêng' },
  { id: 'security_monitoring', label: 'Giám sát bảo mật', description: 'Theo dõi các hoạt động bảo mật' },
  { id: 'audit_logs', label: 'Nhật ký kiểm toán', description: 'Xem lịch sử hoạt động chi tiết' },
  { id: 'compliance_reports', label: 'Báo cáo tuân thủ', description: 'Báo cáo theo quy định pháp luật' },
  { id: 'inventory_tracking', label: 'Theo dõi kho', description: 'Quản lý hàng tồn kho' },
  { id: 'production_reports', label: 'Báo cáo sản xuất', description: 'Thống kê quy trình sản xuất' },
  { id: 'student_tracking', label: 'Theo dõi học sinh', description: 'Quản lý thông tin học sinh' },
  { id: 'course_management', label: 'Quản lý khóa học', description: 'Tạo và quản lý các khóa học' },
];

const categories = [
  'Technology',
  'Finance',
  'Manufacturing',
  'Education',
  'Healthcare',
  'Retail',
  'Government',
  'Non-profit'
];

export default function BusinessTypeDialog({ open, onOpenChange, businessType, onClose }: BusinessTypeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: '',
    features: [] as string[],
    defaultUserLimit: 50,
    isActive: true
  });

  useEffect(() => {
    if (businessType) {
      setFormData({
        name: businessType.name || '',
        code: businessType.code || '',
        description: businessType.description || '',
        category: businessType.category || '',
        features: businessType.features || [],
        defaultUserLimit: businessType.defaultUserLimit || 50,
        isActive: businessType.isActive ?? true
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        category: '',
        features: [],
        defaultUserLimit: 50,
        isActive: true
      });
    }
  }, [businessType]);

  const handleFeatureChange = (featureId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: checked
        ? [...prev.features, featureId]
        : prev.features.filter(f => f !== featureId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving business type:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {businessType ? 'Chỉnh sửa loại doanh nghiệp' : 'Thêm loại doanh nghiệp mới'}
          </DialogTitle>
          <DialogDescription>
            {businessType ? 'Cập nhật thông tin và cấu hình loại doanh nghiệp' : 'Tạo loại doanh nghiệp mới với các tính năng và giới hạn'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên loại doanh nghiệp *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Công ty Công nghệ"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Mã loại *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="TECH"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về loại doanh nghiệp này"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultUserLimit">Giới hạn người dùng mặc định</Label>
                  <Input
                    id="defaultUserLimit"
                    type="number"
                    value={formData.defaultUserLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, defaultUserLimit: parseInt(e.target.value) || 50 }))}
                    min="1"
                    max="10000"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Trạng thái hoạt động</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Cho phép tạo doanh nghiệp với loại này
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Features Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cấu hình tính năng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <Checkbox
                      id={feature.id}
                      checked={formData.features.includes(feature.id)}
                      onCheckedChange={(checked) => handleFeatureChange(feature.id, !!checked)}
                    />
                    <div className="space-y-1 flex-1">
                      <Label htmlFor={feature.id} className="text-sm font-medium">
                        {feature.label}
                      </Label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {businessType ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}