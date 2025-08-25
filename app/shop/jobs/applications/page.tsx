'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Calendar, 
  Building2, 
  Briefcase,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';

// Mock applications data
const mockApplications = [
  {
    id: '1',
    jobTitle: 'Nhân viên bán hàng',
    company: 'Cửa hàng điện tử ABC',
    appliedDate: '2024-01-15',
    status: 'pending',
    statusText: 'Đang xem xét',
    lastUpdate: '2024-01-16',
    notes: 'Hồ sơ đã được nhận và đang trong quá trình xem xét.',
    interviewDate: null,
    salary: '8-12 triệu VNĐ',
    location: 'Quận 1, TP.HCM'
  },
  {
    id: '2',
    jobTitle: 'Lập trình viên Frontend',
    company: 'Công ty TNHH Công nghệ XYZ',
    appliedDate: '2024-01-14',
    status: 'interview',
    statusText: 'Mời phỏng vấn',
    lastUpdate: '2024-01-17',
    notes: 'Bạn đã được mời tham gia phỏng vấn vòng 1. Vui lòng chuẩn bị kỹ thuật.',
    interviewDate: '2024-01-20T09:00:00',
    salary: '15-25 triệu VNĐ',
    location: 'Quận 7, TP.HCM'
  },
  {
    id: '3',
    jobTitle: 'Nhân viên kế toán',
    company: 'Công ty Cổ phần Thương mại DEF',
    appliedDate: '2024-01-13',
    status: 'rejected',
    statusText: 'Không phù hợp',
    lastUpdate: '2024-01-18',
    notes: 'Cảm ơn bạn đã quan tâm. Hiện tại chúng tôi đã tìm được ứng viên phù hợp hơn.',
    interviewDate: null,
    salary: '10-15 triệu VNĐ',
    location: 'Quận 3, TP.HCM'
  },
  {
    id: '4',
    jobTitle: 'Nhân viên marketing',
    company: 'Cửa hàng thời trang GHI',
    appliedDate: '2024-01-12',
    status: 'accepted',
    statusText: 'Được nhận',
    lastUpdate: '2024-01-19',
    notes: 'Chúc mừng! Bạn đã được nhận vào vị trí này. Vui lòng liên hệ HR để hoàn tất thủ tục.',
    interviewDate: '2024-01-18T14:00:00',
    salary: '8-15 triệu VNĐ',
    location: 'Quận 10, TP.HCM'
  }
];

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Đang xem xét' },
  { value: 'interview', label: 'Mời phỏng vấn' },
  { value: 'accepted', label: 'Được nhận' },
  { value: 'rejected', label: 'Không phù hợp' }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'interview':
      return <AlertCircle className="h-4 w-4" />;
    case 'accepted':
      return <CheckCircle className="h-4 w-4" />;
    case 'rejected':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'interview':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'accepted':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getStatusStats = () => {
    return {
      total: mockApplications.length,
      pending: mockApplications.filter(app => app.status === 'pending').length,
      interview: mockApplications.filter(app => app.status === 'interview').length,
      accepted: mockApplications.filter(app => app.status === 'accepted').length,
      rejected: mockApplications.filter(app => app.status === 'rejected').length
    };
  };

  const stats = getStatusStats();

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Đơn ứng tuyển của tôi
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Theo dõi trạng thái các đơn ứng tuyển đã nộp
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.total}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tổng đơn
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
                    {stats.pending}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đang xem xét
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.interview}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Phỏng vấn
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
                    {stats.accepted}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Được nhận
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.rejected}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Từ chối
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm kiếm theo vị trí, công ty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {application.jobTitle}
                          </h3>
                          <Badge className={`text-xs flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span>{application.statusText}</span>
                          </Badge>
                        </div>
                        <p className="text-blue-600 font-medium">{application.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Nộp: {formatDate(application.appliedDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-4 w-4" />
                        <span>{application.location}</span>
                      </div>
                      {application.interviewDate && (
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>PV: {formatDateTime(application.interviewDate)}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                      {application.notes}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2 md:ml-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <span>{application.jobTitle}</span>
                            <Badge className={`text-xs flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              <span>{application.statusText}</span>
                            </Badge>
                          </DialogTitle>
                          <DialogDescription>
                            {application.company} • {application.location}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Ngày nộp đơn:</strong> {formatDate(application.appliedDate)}
                            </div>
                            <div>
                              <strong>Cập nhật lần cuối:</strong> {formatDate(application.lastUpdate)}
                            </div>
                            <div>
                              <strong>Mức lương:</strong> {application.salary}
                            </div>
                            <div>
                              <strong>Địa điểm:</strong> {application.location}
                            </div>
                            {application.interviewDate && (
                              <div className="col-span-2">
                                <strong>Lịch phỏng vấn:</strong> {formatDateTime(application.interviewDate)}
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Ghi chú từ nhà tuyển dụng</h4>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                              <p className="text-slate-700 dark:text-slate-300">{application.notes}</p>
                            </div>
                          </div>

                          {application.status === 'interview' && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                Chuẩn bị phỏng vấn
                              </h4>
                              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                <li>• Xem lại CV và thư xin việc</li>
                                <li>• Tìm hiểu về công ty và vị trí ứng tuyển</li>
                                <li>• Chuẩn bị câu trả lời cho các câu hỏi thường gặp</li>
                                <li>• Đến đúng giờ và ăn mặc phù hợp</li>
                              </ul>
                            </div>
                          )}

                          {application.status === 'accepted' && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                Chúc mừng! Bạn đã được nhận việc
                              </h4>
                              <p className="text-sm text-green-700 dark:text-green-300">
                                Vui lòng liên hệ với bộ phận HR để hoàn tất các thủ tục nhập việc.
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {application.status === 'interview' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Liên hệ HR
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Không tìm thấy đơn ứng tuyển nào
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
              <Button onClick={() => window.location.href = '/shop/jobs'}>
                Tìm việc làm mới
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </UserLayout>
  );
}
