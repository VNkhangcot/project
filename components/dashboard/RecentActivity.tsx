'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const activities = [
  {
    id: 1,
    user: 'Nguyễn Văn A',
    action: 'Đăng nhập hệ thống',
    time: '2 phút trước',
    type: 'login',
    ip: '192.168.1.100'
  },
  {
    id: 2,
    user: 'Trần Thị B',
    action: 'Cập nhật quyền người dùng',
    time: '5 phút trước',
    type: 'permission',
    ip: '192.168.1.101'
  },
  {
    id: 3,
    user: 'Lê Văn C',
    action: 'Tạo báo cáo mới',
    time: '10 phút trước',
    type: 'create',
    ip: '192.168.1.102'
  },
  {
    id: 4,
    user: 'Phạm Thị D',
    action: 'Xóa người dùng',
    time: '15 phút trước',
    type: 'delete',
    ip: '192.168.1.103'
  },
  {
    id: 5,
    user: 'Hoàng Văn E',
    action: 'Đăng xuất hệ thống',
    time: '20 phút trước',
    type: 'logout',
    ip: '192.168.1.104'
  },
];

const getActionBadge = (type: string) => {
  switch (type) {
    case 'login':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Đăng nhập</Badge>;
    case 'logout':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Đăng xuất</Badge>;
    case 'permission':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Quyền</Badge>;
    case 'create':
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Tạo mới</Badge>;
    case 'delete':
      return <Badge variant="destructive">Xóa</Badge>;
    default:
      return <Badge variant="secondary">Khác</Badge>;
  }
};

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={activity.user} />
                  <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{activity.action}</p>
                  <p className="text-xs text-slate-500">IP: {activity.ip}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getActionBadge(activity.type)}
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}