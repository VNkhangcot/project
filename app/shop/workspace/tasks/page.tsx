'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';

// Mock data cho tasks
const mockTasks = [
  {
    id: '1',
    title: 'Cập nhật hệ thống quản lý',
    description: 'Cập nhật phiên bản mới của hệ thống quản lý khách hàng',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-01-20',
    assignedBy: 'Nguyễn Văn A',
    assignedTo: 'Tôi',
    project: 'Dự án CRM',
    estimatedHours: 8,
    completedHours: 4
  },
  {
    id: '2',
    title: 'Kiểm tra bảo mật',
    description: 'Thực hiện kiểm tra bảo mật hệ thống và báo cáo các lỗ hổng',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-01-18',
    assignedBy: 'Trần Thị B',
    assignedTo: 'Tôi',
    project: 'Bảo mật hệ thống',
    estimatedHours: 6,
    completedHours: 6
  },
  {
    id: '3',
    title: 'Báo cáo tuần',
    description: 'Lập báo cáo tiến độ công việc tuần này',
    status: 'pending',
    priority: 'low',
    dueDate: '2024-01-22',
    assignedBy: 'Lê Văn C',
    assignedTo: 'Tôi',
    project: 'Báo cáo định kỳ',
    estimatedHours: 2,
    completedHours: 0
  },
  {
    id: '4',
    title: 'Phát triển tính năng mới',
    description: 'Phát triển tính năng thông báo real-time',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-01-25',
    assignedBy: 'Nguyễn Văn A',
    assignedTo: 'Tôi',
    project: 'Dự án CRM',
    estimatedHours: 12,
    completedHours: 3
  }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);

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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getProgressPercentage = (task: any) => {
    return Math.round((task.completedHours / task.estimatedHours) * 100);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Quản lý công việc
              </h1>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm công việc
            </Button>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý và theo dõi tiến độ các công việc được giao
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm kiếm công việc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả độ ưu tiên</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {task.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'Cao' : 
                           task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === 'completed' ? 'Hoàn thành' : 
                           task.status === 'in_progress' ? 'Đang thực hiện' : 'Chờ xử lý'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Giao bởi: {task.assignedBy}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Hạn: {new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Dự án: {task.project}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Tiến độ: {task.completedHours}/{task.estimatedHours}h ({getProgressPercentage(task)}%)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(task)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 md:ml-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTask(task)}>
                          Xem chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedTask?.title}</DialogTitle>
                          <DialogDescription>
                            Chi tiết công việc và cập nhật tiến độ
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedTask && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Mô tả</h4>
                              <p className="text-slate-700 dark:text-slate-300">{selectedTask.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Thông tin cơ bản</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Dự án:</strong> {selectedTask.project}</p>
                                  <p><strong>Giao bởi:</strong> {selectedTask.assignedBy}</p>
                                  <p><strong>Hạn chót:</strong> {new Date(selectedTask.dueDate).toLocaleDateString('vi-VN')}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Tiến độ</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Ước tính:</strong> {selectedTask.estimatedHours} giờ</p>
                                  <p><strong>Đã hoàn thành:</strong> {selectedTask.completedHours} giờ</p>
                                  <p><strong>Tiến độ:</strong> {getProgressPercentage(selectedTask)}%</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Cập nhật trạng thái</h4>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant={selectedTask.status === 'pending' ? 'default' : 'outline'}
                                  onClick={() => updateTaskStatus(selectedTask.id, 'pending')}
                                >
                                  Chờ xử lý
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant={selectedTask.status === 'in_progress' ? 'default' : 'outline'}
                                  onClick={() => updateTaskStatus(selectedTask.id, 'in_progress')}
                                >
                                  Đang thực hiện
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant={selectedTask.status === 'completed' ? 'default' : 'outline'}
                                  onClick={() => updateTaskStatus(selectedTask.id, 'completed')}
                                >
                                  Hoàn thành
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Không tìm thấy công việc
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </UserLayout>
  );
}
