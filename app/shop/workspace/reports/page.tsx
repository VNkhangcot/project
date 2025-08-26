'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';

// Mock data cho reports
const mockReportData = {
  overview: {
    totalTasks: 45,
    completedTasks: 32,
    inProgressTasks: 8,
    pendingTasks: 5,
    completionRate: 71,
    averageCompletionTime: 2.5
  },
  monthlyStats: [
    { month: 'Tháng 1', completed: 12, assigned: 15 },
    { month: 'Tháng 2', completed: 18, assigned: 20 },
    { month: 'Tháng 3', completed: 22, assigned: 25 },
    { month: 'Tháng 4', completed: 16, assigned: 18 }
  ],
  projectStats: [
    { project: 'Dự án CRM', completed: 8, total: 12, progress: 67 },
    { project: 'Bảo mật hệ thống', completed: 15, total: 15, progress: 100 },
    { project: 'Website mới', completed: 5, total: 10, progress: 50 },
    { project: 'Mobile App', completed: 4, total: 8, progress: 50 }
  ],
  performanceMetrics: {
    productivity: 85,
    quality: 92,
    onTimeDelivery: 78,
    teamCollaboration: 88
  }
};

export default function ReportsPage() {
  const [reportData, setReportData] = useState(mockReportData);
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 75) return 'text-blue-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Báo cáo & Thống kê
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_week">Tuần này</SelectItem>
                  <SelectItem value="this_month">Tháng này</SelectItem>
                  <SelectItem value="this_quarter">Quý này</SelectItem>
                  <SelectItem value="this_year">Năm này</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Theo dõi hiệu suất công việc và tiến độ dự án
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {reportData.overview.totalTasks}
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
                    {reportData.overview.completedTasks}
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
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {reportData.overview.inProgressTasks}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đang thực hiện
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {reportData.overview.completionRate}%
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tỷ lệ hoàn thành
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất theo tháng</CardTitle>
              <CardDescription>
                So sánh công việc được giao và hoàn thành
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="font-medium">{stat.month}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-slate-600">
                        {stat.completed}/{stat.assigned}
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(stat.completed / stat.assigned) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium">
                        {Math.round((stat.completed / stat.assigned) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Tiến độ dự án</CardTitle>
              <CardDescription>
                Tình trạng hoàn thành các dự án
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.projectStats.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{project.project}</span>
                      <Badge className={`${getProgressColor(project.progress)} text-white`}>
                        {project.progress}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{project.completed}/{project.total} công việc</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getProgressColor(project.progress)} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Chỉ số hiệu suất</CardTitle>
            <CardDescription>
              Đánh giá tổng quan về hiệu suất làm việc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-600"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${reportData.performanceMetrics.productivity}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getMetricColor(reportData.performanceMetrics.productivity)}`}>
                      {reportData.performanceMetrics.productivity}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium">Năng suất</p>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-green-600"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${reportData.performanceMetrics.quality}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getMetricColor(reportData.performanceMetrics.quality)}`}>
                      {reportData.performanceMetrics.quality}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium">Chất lượng</p>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-orange-600"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${reportData.performanceMetrics.onTimeDelivery}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getMetricColor(reportData.performanceMetrics.onTimeDelivery)}`}>
                      {reportData.performanceMetrics.onTimeDelivery}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium">Đúng hạn</p>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-600"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${reportData.performanceMetrics.teamCollaboration}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getMetricColor(reportData.performanceMetrics.teamCollaboration)}`}>
                      {reportData.performanceMetrics.teamCollaboration}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium">Hợp tác</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các hoạt động và thay đổi trong tuần qua
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Hoàn thành "Cập nhật hệ thống quản lý"</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">2 giờ trước</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium">Bắt đầu "Phát triển tính năng mới"</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">1 ngày trước</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">Tham gia dự án "Mobile App"</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">3 ngày trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}
