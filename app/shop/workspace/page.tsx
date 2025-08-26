'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';

// Mock data cho workspace
const mockWorkspaceData = {
  company: {
    name: 'Công ty TNHH ABC',
    role: 'Nhân viên IT',
    department: 'Phòng Công nghệ thông tin',
    permissions: ['view_reports', 'manage_tasks', 'view_employees', 'create_documents']
  },
  stats: {
    totalTasks: 12,
    completedTasks: 8,
    pendingTasks: 4,
    totalProjects: 3
  },
  recentTasks: [
    {
      id: '1',
      title: 'Cập nhật hệ thống quản lý',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-01-20',
      assignedBy: 'Nguyễn Văn A'
    },
    {
      id: '2',
      title: 'Kiểm tra bảo mật',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-01-18',
      assignedBy: 'Trần Thị B'
    },
    {
      id: '3',
      title: 'Báo cáo tuần',
      status: 'pending',
      priority: 'low',
      dueDate: '2024-01-22',
      assignedBy: 'Lê Văn C'
    }
  ]
};

const workspaceModules = [
  {
    id: 'tasks',
    name: 'Quản lý công việc',
    description: 'Xem và quản lý các công việc được giao',
    icon: CheckCircle,
    href: '/shop/workspace/tasks',
    permission: 'manage_tasks',
    color: 'bg-blue-500'
  },
  {
    id: 'reports',
    name: 'Báo cáo',
    description: 'Xem báo cáo và thống kê',
    icon: BarChart3,
    href: '/shop/workspace/reports',
    permission: 'view_reports',
    color: 'bg-green-500'
  },
  {
    id: 'employees',
    name: 'Danh sách nhân viên',
    description: 'Xem thông tin đồng nghiệp',
    icon: Users,
    href: '/shop/workspace/employees',
    permission: 'view_employees',
    color: 'bg-purple-500'
  },
  {
    id: 'documents',
    name: 'Tài liệu',
    description: 'Quản lý tài liệu công ty',
    icon: FileText,
    href: '/shop/workspace/documents',
    permission: 'create_documents',
    color: 'bg-orange-500'
  },
  {
    id: 'calendar',
    name: 'Lịch làm việc',
    description: 'Xem lịch và cuộc họp',
    icon: Calendar,
    href: '/shop/workspace/calendar',
    permission: 'view_calendar',
    color: 'bg-red-500'
  },
  {
    id: 'messages',
    name: 'Tin nhắn',
    description: 'Giao tiếp nội bộ',
    icon: MessageSquare,
    href: '/shop/workspace/messages',
    permission: 'send_messages',
    color: 'bg-indigo-500'
  }
];

export default function WorkspacePage() {
  const [workspaceData, setWorkspaceData] = useState(mockWorkspaceData);

  const hasPermission = (permission: string) => {
    return workspaceData.company.permissions.includes(permission);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Filter modules based on permissions
  const availableModules = workspaceModules.filter(module => 
    hasPermission(module.permission)
  );

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Không gian làm việc
            </h1>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              {workspaceData.company.name}
            </h2>
            <p className="text-blue-700 dark:text-blue-200">
              {workspaceData.company.role} - {workspaceData.company.department}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {workspaceData.stats.totalTasks}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tổng công việc
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {workspaceData.stats.completedTasks}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đã hoàn thành
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {workspaceData.stats.pendingTasks}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đang chờ
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {workspaceData.stats.totalProjects}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Dự án
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Modules */}
        <Card>
          <CardHeader>
            <CardTitle>Chức năng có sẵn</CardTitle>
            <CardDescription>
              Các chức năng bạn có thể truy cập dựa trên quyền được cấp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableModules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <Card key={module.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`${module.color} p-2 rounded-lg`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {module.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {module.description}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3"
                            onClick={() => window.location.href = module.href}
                          >
                            Truy cập
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Công việc gần đây</CardTitle>
            <CardDescription>
              Các công việc được giao gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workspaceData.recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {task.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Giao bởi: {task.assignedBy} • Hạn: {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status === 'completed' ? 'Hoàn thành' : 
                       task.status === 'in_progress' ? 'Đang thực hiện' : 'Chờ xử lý'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}
