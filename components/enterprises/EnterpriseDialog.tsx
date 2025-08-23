'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusinessTypeService } from '@/services/enterpriseService';
import { SubscriptionService } from '@/services/subscriptionService';
import { BusinessType, Enterprise, SubscriptionPackage } from '@/lib/types';

interface EnterpriseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enterprise?: Enterprise | null;
  onClose: () => void;
}

export default function EnterpriseDialog({ open, onOpenChange, enterprise, onClose }: EnterpriseDialogProps) {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [subscriptionPackages, setSubscriptionPackages] = useState<SubscriptionPackage[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    businessTypeId: '',
    taxCode: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    contactPerson: {
      name: '',
      position: '',
      phone: '',
      email: ''
    },
    status: 'pending',
    subscriptionPlan: 'basic',
    userLimit: 50
  });

  useEffect(() => {
    loadBusinessTypes();
    loadSubscriptionPackages();
  }, []);

  useEffect(() => {
    if (enterprise) {
      setFormData({
        name: enterprise.name || '',
        code: enterprise.code || '',
        businessTypeId: enterprise.businessType._id || '',
        taxCode: enterprise.taxCode || '',
        address: enterprise.address || '',
        phone: enterprise.phone || '',
        email: enterprise.email || '',
        website: enterprise.website || '',
        contactPerson: enterprise.contactPerson || {
          name: '',
          position: '',
          phone: '',
          email: ''
        },
        status: enterprise.status || 'pending',
        subscriptionPlan: enterprise.subscriptionPlan || 'basic',
        userLimit: enterprise.userLimit || 50
      });
    } else {
      setFormData({
        name: '',
        code: '',
        businessTypeId: '',
        taxCode: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        contactPerson: {
          name: '',
          position: '',
          phone: '',
          email: ''
        },
        status: 'pending',
        subscriptionPlan: 'basic',
        userLimit: 50
      });
    }
  }, [enterprise]);

  const loadBusinessTypes = async () => {
    try {
      const response = await BusinessTypeService.getBusinessTypes();
      setBusinessTypes(response.data || []);
    } catch (error) {
      console.error('Error loading business types:', error);
    }
  };

  const loadSubscriptionPackages = async () => {
    try {
      const response = await SubscriptionService.getSubscriptionPackages({ status: 'active' });
      setSubscriptionPackages(response.data || []);
    } catch (error) {
      console.error('Error loading subscription packages:', error);
    }
  };

  const handleBusinessTypeChange = (businessTypeId: string) => {
    const selectedBusinessType = businessTypes.find(bt => bt._id === businessTypeId);
    setFormData(prev => ({
      ...prev,
      businessTypeId,
      userLimit: selectedBusinessType?.defaultUserLimit || 50
    }));
  };

  const handleSubscriptionChange = (subscriptionPlan: string) => {
    const selectedPackage = subscriptionPackages.find(pkg => pkg.code.toLowerCase() === subscriptionPlan);
    setFormData(prev => ({
      ...prev,
      subscriptionPlan,
      userLimit: selectedPackage?.limits.users || prev.userLimit
    }));
  };

  const getSubscriptionPackageInfo = (planCode: string) => {
    return subscriptionPackages.find(pkg => pkg.code.toLowerCase() === planCode);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving enterprise:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {enterprise ? 'Chỉnh sửa doanh nghiệp' : 'Thêm doanh nghiệp mới'}
          </DialogTitle>
          <DialogDescription>
            {enterprise ? 'Cập nhật thông tin doanh nghiệp' : 'Đăng ký doanh nghiệp mới vào hệ thống'}
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
                  <Label htmlFor="name">Tên doanh nghiệp *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên doanh nghiệp"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Mã doanh nghiệp *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="ABC_CORP"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Loại hình doanh nghiệp *</Label>
                  <Select value={formData.businessTypeId} onValueChange={handleBusinessTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type._id} value={type._id}>
                          {type.name} ({type.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxCode">Mã số thuế *</Label>
                  <Input
                    id="taxCode"
                    value={formData.taxCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, taxCode: e.target.value }))}
                    placeholder="0123456789"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Nhập địa chỉ đầy đủ"
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="028-1234-5678"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://company.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Người liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Họ tên *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactPerson.name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactPerson: { ...prev.contactPerson, name: e.target.value }
                    }))}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPosition">Chức vụ *</Label>
                  <Input
                    id="contactPosition"
                    value={formData.contactPerson.position}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactPerson: { ...prev.contactPerson, position: e.target.value }
                    }))}
                    placeholder="Giám đốc IT"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Số điện thoại *</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPerson.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactPerson: { ...prev.contactPerson, phone: e.target.value }
                    }))}
                    placeholder="0901-234-567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactPerson.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactPerson: { ...prev.contactPerson, email: e.target.value }
                    }))}
                    placeholder="admin@company.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cài đặt dịch vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                      <SelectItem value="suspended">Bị đình chỉ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subscriptionPlan">Gói dịch vụ</Label>
                  <Select value={formData.subscriptionPlan} onValueChange={handleSubscriptionChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptionPackages.map((pkg) => (
                        <SelectItem key={pkg._id} value={pkg.code.toLowerCase()}>
                          <div className="flex items-center justify-between w-full">
                            <span>{pkg.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {formatPrice(pkg.price.monthly)}/tháng
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.subscriptionPlan && getSubscriptionPackageInfo(formData.subscriptionPlan) && (
                    <div className="text-xs text-slate-600 mt-1">
                      <p>Giới hạn: {getSubscriptionPackageInfo(formData.subscriptionPlan)?.limits.users} người dùng</p>
                      <p>Lưu trữ: {getSubscriptionPackageInfo(formData.subscriptionPlan)?.limits.storage}GB</p>
                      <p>Hỗ trợ: {getSubscriptionPackageInfo(formData.subscriptionPlan)?.limits.support}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userLimit">Giới hạn người dùng</Label>
                  <Input
                    id="userLimit"
                    type="number"
                    value={formData.userLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, userLimit: parseInt(e.target.value) || 50 }))}
                    min="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {enterprise ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}