'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Download, MoreHorizontal, FileText, Calendar, User, Filter } from 'lucide-react';

const reportHistory = [
  {
    id: 1,
    name: 'Báo cáo người dùng tháng 1',
    type: 'Người dùng',
    format: 'PDF',
    status: 'completed',
    createdBy: 'Admin User',
    createdAt: '2024-01-15 10:30',
    size: '2.4 MB',
    downloads: 45,
  },
  {
    id: 2,
    name: 'Phân tích bảo mật tuần 3',
    type: 'Bảo mật',
    format: 'Excel',
    status: 'processing',
    createdBy: 'Security Manager',
    createdAt: '2024-01-14 14:20',
    size: '1.8 MB',
    downloads: 23,
  },
  {
    id: 3,
    name: 'Hiệu suất hệ thống Q1',
    type: 'Hiệu suất',
    format: 'PDF',
    status: 'completed',
    createdBy: 'System Admin',
    createdAt: '2024-01-13 09:15',
    size: '3.2 MB',
    downloads: 67,
  },
  {
    id: 4,
    name: 'Báo cáo tài chính tháng 12',
    type: 'Tài chính',
    format: 'Excel',
    status: 'failed',
    createdBy: 'Finance Manager',
    createdAt: '2024-01-12 16:45',
    size: '0 MB',
    downloads: 0,
  },
  {
    id: 5,
    name: 'Audit log tuần 2',
    type: 'Bảo mật',
    format: 'CSV',
    status: 'completed',
    createdBy: 'Admin User',
    createdAt: '2024-01-11 11:30',
    size: '856 KB',
    downloads: 12,
  },
];

export default function ReportHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredReports = reportHistory.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Đang xử lý</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>;
      case 'scheduled':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Đã lên lịch</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'Người dùng': 'bg-blue-100 text-blue-800',
      'Bảo mật': 'bg-red-100 text-red-800',
      'Hiệu suất': 'bg-green-100 text-green-800',
      'Tài chính': 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <Badge variant="secondary" className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm báo cáo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="scheduled">Đã lên lịch</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="Người dùng">Người dùng</SelectItem>
                <SelectItem value="Bảo mật">Bảo mật</SelectItem>
                <SelectItem value="Hiệu suất">Hiệu suất</SelectItem>
                <SelectItem value="Tài chính">Tài chính</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử báo cáo ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Báo cáo
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Loại
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Người tạo
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Ngày tạo
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Kích thước
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Lượt tải
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr 
                    key={report.id} 
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <FileText className="h-3 w-3" />
                          <span>{report.format}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getTypeBadge(report.type)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{report.createdBy}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{report.createdAt}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {report.size}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {report.downloads}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {report.status === 'completed' && (
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Tải xuống
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {report.status === 'failed' && (
                            <DropdownMenuItem>
                              Tạo lại
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}