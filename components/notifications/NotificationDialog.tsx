'use client';

import { useState, useEffect } from 'react';
import { NotificationService } from '@/services/notificationService';
import { Notification } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Users, 
  Calendar, 
  Settings,
  Plus,
  Trash2,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Megaphone
} from 'lucide-react';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification?: Notification | null;
  onClose: () => void;
}

export default function NotificationDialog({
  open,
  onOpenChange,
  notification,
  onClose,
}: NotificationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    recipients: {
      type: 'all',
      userIds: [] as string[],
      roleIds: [] as string[],
      enterpriseIds: [] as string[]
    },
    scheduledAt: '',
    expiresAt: '',
    actions: [] as Array<{
      label: string;
      url: string;
      type: string;
    }>
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        recipients: {
          type: notification.recipients.type,
          userIds: notification.recipients.userIds || [],
          roleIds: notification.recipients.roleIds || [],
          enterpriseIds: notification.recipients.enterpriseIds || []
        },
        scheduledAt: notification.scheduledAt || '',
        expiresAt: notification.expiresAt || '',
        actions: notification.actions || []
      });
    } else {
      // Reset form for new notification
      setFormData({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        recipients: {
          type: 'all',
          userIds: [],
          roleIds: [],
          enterpriseIds: []
        },
        scheduledAt: '',
        expiresAt: '',
        actions: []
      });
    }
  }, [notification, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (notification) {
        await NotificationService.updateNotification(notification._id, formData);
      } else {
        await NotificationService.createNotification(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { label: '', url: '', type: 'primary' }]
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      info: Info,
      success: CheckCircle,
      warning: AlertTriangle,
      error: XCircle,
      announcement: Megaphone
    };
    return icons[type as keyof typeof icons] || Info;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      info: 'text-blue-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600',
      announcement: 'text-purple-600'
    };
    return colors[type as keyof typeof colors] || 'text-blue-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {notification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
          </DialogTitle>
          <DialogDescription>
            {notification ? 'Cập nhật thông tin thông báo' : 'Tạo thông báo mới để gửi cho người dùng'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="recipients">Người nhận</TabsTrigger>
              <TabsTrigger value="schedule">Lên lịch</TabsTrigger>
              <TabsTrigger value="actions">Hành động</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề thông báo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại thông báo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-600" />
                          Thông tin
                        </div>
                      </SelectItem>
                      <SelectItem value="success">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Thành công
                        </div>
                      </SelectItem>
                      <SelectItem value="warning">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          Cảnh báo
                        </div>
                      </SelectItem>
                      <SelectItem value="error">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Lỗi
                        </div>
                      </SelectItem>
                      <SelectItem value="announcement">
                        <div className="flex items-center gap-2">
                          <Megaphone className="h-4 w-4 text-purple-600" />
                          Thông báo
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Nội dung *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Nhập nội dung thông báo"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Mức độ ưu tiên</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Xem trước</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <div className="flex items-start gap-3">
                      {(() => {
                        const Icon = getTypeIcon(formData.type);
                        return <Icon className={`h-5 w-5 mt-0.5 ${getTypeColor(formData.type)}`} />;
                      })()}
                      <div className="flex-1">
                        <h4 className="font-medium">{formData.title || 'Tiêu đề thông báo'}</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {formData.message || 'Nội dung thông báo sẽ hiển thị ở đây'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{formData.type}</Badge>
                          <Badge variant="secondary">{formData.priority}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recipients" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Loại người nhận</Label>
                  <Select
                    value={formData.recipients.type}
                    onValueChange={(value: any) => setFormData(prev => ({
                      ...prev,
                      recipients: { ...prev.recipients, type: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả người dùng</SelectItem>
                      <SelectItem value="specific">Người dùng cụ thể</SelectItem>
                      <SelectItem value="role">Theo vai trò</SelectItem>
                      <SelectItem value="enterprise">Theo doanh nghiệp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.recipients.type === 'specific' && (
                  <div className="space-y-2">
                    <Label>Chọn người dùng</Label>
                    <Input
                      placeholder="Nhập ID người dùng (phân cách bằng dấu phẩy)"
                      value={formData.recipients.userIds?.join(', ') || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        recipients: {
                          ...prev.recipients,
                          userIds: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                        }
                      }))}
                    />
                  </div>
                )}

                {formData.recipients.type === 'role' && (
                  <div className="space-y-2">
                    <Label>Chọn vai trò</Label>
                    <Input
                      placeholder="Nhập ID vai trò (phân cách bằng dấu phẩy)"
                      value={formData.recipients.roleIds?.join(', ') || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        recipients: {
                          ...prev.recipients,
                          roleIds: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                        }
                      }))}
                    />
                  </div>
                )}

                {formData.recipients.type === 'enterprise' && (
                  <div className="space-y-2">
                    <Label>Chọn doanh nghiệp</Label>
                    <Input
                      placeholder="Nhập ID doanh nghiệp (phân cách bằng dấu phẩy)"
                      value={formData.recipients.enterpriseIds?.join(', ') || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        recipients: {
                          ...prev.recipients,
                          enterpriseIds: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                        }
                      }))}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Lên lịch gửi</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  />
                  <p className="text-xs text-slate-500">
                    Để trống để gửi ngay lập tức
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Hết hạn</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  />
                  <p className="text-xs text-slate-500">
                    Thông báo sẽ tự động ẩn sau thời gian này
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Nút hành động</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAction}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm nút
                  </Button>
                </div>

                {formData.actions.map((action, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Nhãn</Label>
                          <Input
                            value={action.label}
                            onChange={(e) => updateAction(index, 'label', e.target.value)}
                            placeholder="Ví dụ: Xem chi tiết"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>URL</Label>
                          <Input
                            value={action.url}
                            onChange={(e) => updateAction(index, 'url', e.target.value)}
                            placeholder="Ví dụ: /dashboard/settings"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Loại</Label>
                          <div className="flex items-center gap-2">
                            <Select
                              value={action.type}
                              onValueChange={(value: any) => updateAction(index, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="primary">Chính</SelectItem>
                                <SelectItem value="secondary">Phụ</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAction(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {formData.actions.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Chưa có nút hành động nào
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : (notification ? 'Cập nhật' : 'Tạo thông báo')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
