'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Check, 
  X, 
  ShoppingCart, 
  Package, 
  Star, 
  Gift,
  AlertCircle,
  Info,
  CheckCircle
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'review' | 'system' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon?: React.ReactNode;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng đã được giao',
    message: 'Đơn hàng #ORDER_1 đã được giao thành công',
    time: '2 phút trước',
    isRead: false,
    icon: <Package className="h-4 w-4" />
  },
  {
    id: '2',
    type: 'promotion',
    title: 'Khuyến mãi đặc biệt',
    message: 'Giảm 20% cho tất cả sản phẩm điện tử',
    time: '1 giờ trước',
    isRead: false,
    icon: <Gift className="h-4 w-4" />
  },
  {
    id: '3',
    type: 'review',
    title: 'Đánh giá sản phẩm',
    message: 'Hãy đánh giá sản phẩm iPhone 15 Pro Max bạn đã mua',
    time: '3 giờ trước',
    isRead: true,
    icon: <Star className="h-4 w-4" />
  },
  {
    id: '4',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai',
    time: '1 ngày trước',
    isRead: true,
    icon: <AlertCircle className="h-4 w-4" />
  },
  {
    id: '5',
    type: 'info',
    title: 'Chào mừng bạn đến ShopPro',
    message: 'Cảm ơn bạn đã đăng ký tài khoản. Khám phá ngay!',
    time: '2 ngày trước',
    isRead: true,
    icon: <Info className="h-4 w-4" />
  }
];

export default function NotificationPopup() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-green-600 bg-green-100';
      case 'promotion':
        return 'text-purple-600 bg-purple-100';
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      case 'system':
        return 'text-red-600 bg-red-100';
      case 'info':
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Thông báo</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">
                Bạn có {unreadCount} thông báo chưa đọc
              </p>
            )}
          </CardHeader>
          
          <Separator />
          
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mb-2 opacity-50" />
                  <p>Không có thông báo nào</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          {notification.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                      
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          
          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="p-3">
                <Button 
                  variant="ghost" 
                  className="w-full text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Xem tất cả thông báo
                </Button>
              </div>
            </>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
}
