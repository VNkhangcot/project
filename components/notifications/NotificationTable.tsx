'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  Send, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Megaphone 
} from 'lucide-react';
import { Notification } from '@/lib/types';
import { NotificationService } from '@/services/notificationService';
import { format } from 'date-fns';

interface NotificationTableProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  priorityFilter: string;
  onEditNotification: (notification: Notification) => void;
}

export default function NotificationTable({ 
  searchTerm, 
  statusFilter, 
  typeFilter, 
  priorityFilter,
  onEditNotification 
}: NotificationTableProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on component mount
  useState(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await NotificationService.getNotifications();
        setNotifications(response.data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  });

  // Apply filters
  const filteredNotifications = notifications.filter(notification => {
    // Search term filter
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    
    // Type filter
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Bản nháp</Badge>;
      case 'scheduled':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Đã lên lịch</Badge>;
      case 'sent':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Đã gửi</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'info':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Thông tin</Badge>;
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Thành công</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Lỗi</Badge>;
      case 'announcement':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Thông báo</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline">Thấp</Badge>;
      case 'medium':
        return <Badge variant="secondary">Trung bình</Badge>;
      case 'high':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Cao</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Khẩn cấp</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4 text-purple-600" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4 text-slate-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'sent':
        return <Send className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  const getRecipientText = (notification: Notification) => {
    switch (notification.recipients.type) {
      case 'all':
        return 'Tất cả người dùng';
      case 'specific':
        return `${notification.recipients.userIds?.length || 0} người dùng cụ thể`;
      case 'role':
        return `${notification.recipients.roleIds?.length || 0} vai trò`;
      case 'enterprise':
        return `${notification.recipients.enterpriseIds?.length || 0} doanh nghiệp`;
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách thông báo ({filteredNotifications.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Thông báo
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Người nhận
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Trạng thái
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Thời gian
                </th>
                <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Không có thông báo nào phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notification) => (
                  <tr 
                    key={notification._id} 
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(notification.type)}
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {getTypeBadge(notification.type)}
                            {getPriorityBadge(notification.priority)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{getRecipientText(notification)}</p>
                      {notification.metadata && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <Eye className="h-3 w-3" />
                          <span>{notification.metadata.readCount || 0}/{notification.metadata.totalRecipients || 0}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(notification.status)}
                        {getStatusBadge(notification.status)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                      {notification.status === 'scheduled' ? (
                        <div>
                          <p>Lên lịch: {formatDate(notification.scheduledAt)}</p>
                        </div>
                      ) : notification.status === 'sent' ? (
                        <div>
                          <p>Gửi: {formatDate(notification.sentAt)}</p>
                        </div>
                      ) : (
                        <div>
                          <p>Tạo: {formatDate(notification.createdAt)}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditNotification(notification)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          {notification.status === 'draft' && (
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Gửi ngay
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
