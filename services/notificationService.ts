import { Notification, UserNotification, ApiResponse } from '@/lib/types';
import { mockNotifications } from '@/lib/mockData';

export class NotificationService {
  // Get all notifications (admin view)
  static async getNotifications(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    priority?: string;
    search?: string;
  }): Promise<ApiResponse<Notification[]>> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredNotifications = [...mockNotifications];
    
    // Apply filters
    if (params?.status && params.status !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.status === params.status);
    }
    
    if (params?.type && params.type !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.type === params.type);
    }
    
    if (params?.priority && params.priority !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.priority === params.priority);
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredNotifications = filteredNotifications.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.message.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      status: 'success',
      message: 'Lấy danh sách thông báo thành công',
      data: filteredNotifications
    };
  }

  // Get notification by ID
  static async getNotificationById(id: string): Promise<ApiResponse<Notification>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const notification = mockNotifications.find(n => n._id === id);
    
    if (!notification) {
      throw new Error('Không tìm thấy thông báo');
    }
    
    return {
      status: 'success',
      message: 'Lấy thông tin thông báo thành công',
      data: notification
    };
  }

  // Create notification
  static async createNotification(notificationData: any): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newNotification = {
      _id: 'notif_' + Date.now(),
      title: notificationData.title || '',
      message: notificationData.message || '',
      type: notificationData.type || 'info',
      priority: notificationData.priority || 'medium',
      sender: notificationData.sender || {
        _id: '1',
        name: 'Nguyễn Văn Admin',
        email: 'admin@company.com'
      },
      recipients: notificationData.recipients || { type: 'all' },
      status: notificationData.scheduledAt ? 'scheduled' : 'sent',
      scheduledAt: notificationData.scheduledAt,
      sentAt: notificationData.scheduledAt ? undefined : new Date().toISOString(),
      readBy: [],
      actions: notificationData.actions || [],
      expiresAt: notificationData.expiresAt,
      isActive: true,
      metadata: {
        totalRecipients: 0,
        readCount: 0,
        clickCount: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      status: 'success',
      message: 'Tạo thông báo thành công',
      data: newNotification
    };
  }

  // Update notification
  static async updateNotification(id: string, notificationData: any): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const notification = mockNotifications.find(n => n._id === id);
    
    if (!notification) {
      throw new Error('Không tìm thấy thông báo');
    }
    
    const updatedNotification = {
      ...notification,
      ...notificationData,
      updatedAt: new Date().toISOString()
    };
    
    return {
      status: 'success',
      message: 'Cập nhật thông báo thành công',
      data: updatedNotification
    };
  }

  // Delete notification
  static async deleteNotification(id: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const notification = mockNotifications.find(n => n._id === id);
    
    if (!notification) {
      throw new Error('Không tìm thấy thông báo');
    }
    
    return {
      status: 'success',
      message: 'Xóa thông báo thành công'
    };
  }

  // Send notification immediately
  static async sendNotification(id: string): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const notification = mockNotifications.find(n => n._id === id);
    
    if (!notification) {
      throw new Error('Không tìm thấy thông báo');
    }
    
    if (notification.status === 'sent') {
      throw new Error('Thông báo đã được gửi');
    }
    
    const updatedNotification = {
      ...notification,
      status: 'sent',
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      status: 'success',
      message: 'Gửi thông báo thành công',
      data: updatedNotification
    };
  }

  // Get notification statistics
  static async getNotificationStats(): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stats = {
      total: mockNotifications.length,
      sent: mockNotifications.filter(n => n.status === 'sent').length,
      scheduled: 0, // Mock scheduled count
      draft: 0, // Mock draft count
      byType: {
        info: mockNotifications.filter(n => n.type === 'info').length,
        success: mockNotifications.filter(n => n.type === 'success').length,
        warning: mockNotifications.filter(n => n.type === 'warning').length,
        error: mockNotifications.filter(n => n.type === 'error').length,
        announcement: mockNotifications.filter(n => n.type === 'announcement').length
      },
      byPriority: {
        low: mockNotifications.filter(n => n.priority === 'low').length,
        medium: mockNotifications.filter(n => n.priority === 'medium').length,
        high: mockNotifications.filter(n => n.priority === 'high').length,
        urgent: mockNotifications.filter(n => n.priority === 'urgent').length
      },
      totalRecipients: mockNotifications.reduce((sum, n) => sum + (n.metadata?.totalRecipients || 0), 0),
      totalReads: mockNotifications.reduce((sum, n) => sum + (n.metadata?.readCount || 0), 0),
      totalClicks: mockNotifications.reduce((sum, n) => sum + (n.metadata?.clickCount || 0), 0)
    };
    
    return {
      status: 'success',
      message: 'Lấy thống kê thông báo thành công',
      data: stats
    };
  }

  // Get user notifications (for regular users)
  static async getUserNotifications(userId: string, params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
  }): Promise<ApiResponse<any[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter notifications for this user
    let userNotifications = mockNotifications
      .filter(n => {
        if (n.recipients.type === 'all') return true;
        if (n.recipients.type === 'specific') return n.recipients.userIds?.includes(userId);
        return false;
      })
      .map(n => ({
        _id: `user_notif_${n._id}_${userId}`,
        notification: n,
        user: { _id: userId },
        isRead: n.readBy.some(r => r.userId === userId),
        readAt: n.readBy.find(r => r.userId === userId)?.readAt,
        isArchived: false,
        createdAt: n.createdAt
      }));
    
    // Apply filters
    if (params?.isRead !== undefined) {
      userNotifications = userNotifications.filter(n => n.isRead === params.isRead);
    }
    
    return {
      status: 'success',
      message: 'Lấy thông báo người dùng thành công',
      data: userNotifications
    };
  }

  // Mark notification as read
  static async markAsRead(notificationId: string, userId: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const notification = mockNotifications.find(n => n._id === notificationId);
    
    if (!notification) {
      throw new Error('Không tìm thấy thông báo');
    }
    
    return {
      status: 'success',
      message: 'Đánh dấu đã đọc thành công'
    };
  }
}
