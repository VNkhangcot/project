'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NotificationTable from '@/components/notifications/NotificationTable';
import NotificationDialog from '@/components/notifications/NotificationDialog';
import NotificationStats from '@/components/notifications/NotificationStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Bell } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Notification } from '@/lib/types';

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  return (
    <ProtectedRoute requiredPermissions={['manage_notifications']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
                <Bell className="h-8 w-8 text-blue-600" />
                <span>Quản lý Thông báo</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Gửi và quản lý thông báo cho người dùng trong hệ thống
              </p>
            </div>
            <Button onClick={() => setShowNotificationDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo thông báo
            </Button>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">Danh sách thông báo</TabsTrigger>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm kiếm thông báo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                    <SelectItem value="sent">Đã gửi</SelectItem>
                    <SelectItem value="failed">Thất bại</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Loại thông báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="info">Thông tin</SelectItem>
                    <SelectItem value="success">Thành công</SelectItem>
                    <SelectItem value="warning">Cảnh báo</SelectItem>
                    <SelectItem value="error">Lỗi</SelectItem>
                    <SelectItem value="announcement">Thông báo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mức độ</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <NotificationTable 
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                typeFilter={typeFilter}
                priorityFilter={priorityFilter}
                onEditNotification={(notification) => {
                  setSelectedNotification(notification);
                  setShowNotificationDialog(true);
                }}
              />
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-6">
              <NotificationStats />
            </TabsContent>
          </Tabs>

          <NotificationDialog
            open={showNotificationDialog}
            onOpenChange={setShowNotificationDialog}
            notification={selectedNotification}
            onClose={() => {
              setShowNotificationDialog(false);
              setSelectedNotification(null);
            }}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
