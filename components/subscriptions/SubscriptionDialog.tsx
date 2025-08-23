'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Save, Loader2 } from 'lucide-react';
import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionPackage } from '@/lib/types';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: SubscriptionPackage | null;
  onClose: () => void;
}

export default function SubscriptionDialog({ 
  open, 
  onOpenChange, 
  subscription, 
  onClose 
}: SubscriptionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    price: {
      monthly: 0,
      yearly: 0,
      currency: 'VND'
    },
    features: [] as string[],
    limits: {
      users: 50,
      storage: 10,
      apiCalls: 10000,
      projects: 5,
      support: 'basic' as 'basic' | 'priority' | '24/7'
    },
    isPopular: false,
    isActive: true,
    category: 'basic' as 'basic' | 'premium' | 'enterprise' | 'custom',
    trialDays: 14,
    setupFee: 0,
    billingCycle: 'both' as 'monthly' | 'yearly' | 'both'
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        code: subscription.code,
        description: subscription.description,
        price: subscription.price,
        features: [...subscription.features],
        limits: subscription.limits,
        isPopular: subscription.isPopular,
        isActive: subscription.isActive,
        category: subscription.category,
        trialDays: subscription.trialDays,
        setupFee: subscription.setupFee,
        billingCycle: subscription.billingCycle
      });
    } else {
      // Reset form for new subscription
      setFormData({
        name: '',
        code: '',
        description: '',
        price: {
          monthly: 0,
          yearly: 0,
          currency: 'VND'
        },
        features: [],
        limits: {
          users: 50,
          storage: 10,
          apiCalls: 10000,
          projects: 5,
          support: 'basic'
        },
        isPopular: false,
        isActive: true,
        category: 'basic',
        trialDays: 14,
        setupFee: 0,
        billingCycle: 'both'
      });
    }
  }, [subscription, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (subscription) {
        await SubscriptionService.updateSubscriptionPackage(subscription._id, formData);
      } else {
        await SubscriptionService.createSubscriptionPackage(formData);
      }
      onClose();
      // Reload the parent component
      window.location.reload();
    } catch (error) {
      console.error('Error saving subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {subscription ? 'Chỉnh sửa gói đăng ký' : 'Thêm gói đăng ký mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="pricing">Định giá</TabsTrigger>
              <TabsTrigger value="features">Tính năng</TabsTrigger>
              <TabsTrigger value="limits">Giới hạn</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên gói *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ví dụ: Gói Chuyên nghiệp"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Mã gói *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="Ví dụ: PREMIUM"
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
                  placeholder="Mô tả chi tiết về gói dịch vụ..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Cơ bản</SelectItem>
                      <SelectItem value="premium">Chuyên nghiệp</SelectItem>
                      <SelectItem value="enterprise">Doanh nghiệp</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trialDays">Thời gian dùng thử (ngày)</Label>
                  <Input
                    id="trialDays"
                    type="number"
                    value={formData.trialDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, trialDays: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
                  />
                  <Label htmlFor="isPopular">Gói phổ biến</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Kích hoạt</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyPrice">Giá tháng (VND) *</Label>
                  <Input
                    id="monthlyPrice"
                    type="number"
                    value={formData.price.monthly}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      price: { ...prev.price, monthly: parseInt(e.target.value) || 0 }
                    }))}
                    min="0"
                    required
                  />
                  <p className="text-xs text-slate-500">
                    {formatPrice(formData.price.monthly)} VND/tháng
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearlyPrice">Giá năm (VND) *</Label>
                  <Input
                    id="yearlyPrice"
                    type="number"
                    value={formData.price.yearly}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      price: { ...prev.price, yearly: parseInt(e.target.value) || 0 }
                    }))}
                    min="0"
                    required
                  />
                  <p className="text-xs text-slate-500">
                    {formatPrice(formData.price.yearly)} VND/năm
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="setupFee">Phí thiết lập (VND)</Label>
                  <Input
                    id="setupFee"
                    type="number"
                    value={formData.setupFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, setupFee: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingCycle">Chu kỳ thanh toán</Label>
                  <Select value={formData.billingCycle} onValueChange={(value: any) => setFormData(prev => ({ ...prev, billingCycle: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                      <SelectItem value="yearly">Hàng năm</SelectItem>
                      <SelectItem value="both">Cả hai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="space-y-2">
                <Label>Tính năng gói dịch vụ</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Nhập tính năng mới..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Danh sách tính năng</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="limits" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userLimit">Giới hạn người dùng</Label>
                  <Input
                    id="userLimit"
                    type="number"
                    value={formData.limits.users}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      limits: { ...prev.limits, users: parseInt(e.target.value) || 0 }
                    }))}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageLimit">Dung lượng lưu trữ (GB)</Label>
                  <Input
                    id="storageLimit"
                    type="number"
                    value={formData.limits.storage}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      limits: { ...prev.limits, storage: parseInt(e.target.value) || 0 }
                    }))}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiLimit">Giới hạn API calls/tháng</Label>
                  <Input
                    id="apiLimit"
                    type="number"
                    value={formData.limits.apiCalls}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      limits: { ...prev.limits, apiCalls: parseInt(e.target.value) || 0 }
                    }))}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectLimit">Số dự án</Label>
                  <Input
                    id="projectLimit"
                    type="number"
                    value={formData.limits.projects}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      limits: { ...prev.limits, projects: parseInt(e.target.value) || 0 }
                    }))}
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="support">Mức độ hỗ trợ</Label>
                <Select value={formData.limits.support} onValueChange={(value: any) => setFormData(prev => ({ 
                  ...prev, 
                  limits: { ...prev.limits, support: value }
                }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Cơ bản (Email)</SelectItem>
                    <SelectItem value="priority">Ưu tiên (Email + Chat)</SelectItem>
                    <SelectItem value="24/7">24/7 (Tất cả kênh)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {subscription ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
