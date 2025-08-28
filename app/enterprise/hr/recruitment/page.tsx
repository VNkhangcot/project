'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Users, 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';

// Dữ liệu mẫu cho tuyển dụng
const jobPostings = [
  {
    id: 1,
    title: 'Nhân viên kinh doanh',
    department: 'Phòng Kinh doanh',
    location: 'Hồ Chí Minh',
    type: 'Toàn thời gian',
    salary: '15-20 triệu',
    postedDate: '15/05/2023',
    closingDate: '15/06/2023',
    status: 'active',
    applications: 12
  },
  {
    id: 2,
    title: 'Kỹ sư phần mềm',
    department: 'Phòng Kỹ thuật',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    salary: '25-35 triệu',
    postedDate: '10/05/2023',
    closingDate: '10/06/2023',
    status: 'active',
    applications: 8
  },
  {
    id: 3,
    title: 'Nhân viên marketing',
    department: 'Phòng Marketing',
    location: 'Hồ Chí Minh',
    type: 'Toàn thời gian',
    salary: '12-18 triệu',
    postedDate: '05/05/2023',
    closingDate: '05/06/2023',
    status: 'active',
    applications: 15
  },
  {
    id: 4,
    title: 'Kế toán viên',
    department: 'Phòng Tài chính',
    location: 'Đà Nẵng',
    type: 'Toàn thời gian',
    salary: '10-15 triệu',
    postedDate: '01/05/2023',
    closingDate: '01/06/2023',
    status: 'closed',
    applications: 20
  },
  {
    id: 5,
    title: 'Trưởng phòng nhân sự',
    department: 'Phòng Nhân sự',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    salary: '30-40 triệu',
    postedDate: '20/04/2023',
    closingDate: '20/05/2023',
    status: 'closed',
    applications: 6
  }
];

// Dữ liệu mẫu cho ứng viên
const candidates = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    position: 'Nhân viên kinh doanh',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    experience: '3 năm',
    education: 'Đại học Kinh tế',
    status: 'new',
    appliedDate: '16/05/2023',
    resumeUrl: '#'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    position: 'Kỹ sư phần mềm',
    email: 'tranthib@example.com',
    phone: '0912345678',
    experience: '5 năm',
    education: 'Đại học Bách Khoa',
    status: 'interviewing',
    appliedDate: '12/05/2023',
    resumeUrl: '#'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    position: 'Nhân viên marketing',
    email: 'levanc@example.com',
    phone: '0923456789',
    experience: '2 năm',
    education: 'Đại học Ngoại thương',
    status: 'rejected',
    appliedDate: '08/05/2023',
    resumeUrl: '#'
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    position: 'Kế toán viên',
    email: 'phamthid@example.com',
    phone: '0934567890',
    experience: '4 năm',
    education: 'Đại học Kinh tế',
    status: 'hired',
    appliedDate: '05/05/2023',
    resumeUrl: '#'
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    position: 'Trưởng phòng nhân sự',
    email: 'hoangvane@example.com',
    phone: '0945678901',
    experience: '8 năm',
    education: 'Thạc sĩ Quản trị nhân lực',
    status: 'interviewing',
    appliedDate: '25/04/2023',
    resumeUrl: '#'
  }
];

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState('job-postings');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Lọc tin tuyển dụng
  const filteredJobPostings = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Lọc ứng viên
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Hiển thị trạng thái tin tuyển dụng
  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Đang tuyển</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">Đã đóng</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Hiển thị trạng thái ứng viên
  const getCandidateStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">Mới</Badge>;
      case 'interviewing':
        return <Badge className="bg-yellow-100 text-yellow-800">Đang phỏng vấn</Badge>;
      case 'hired':
        return <Badge className="bg-green-100 text-green-800">Đã tuyển</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Hiển thị icon trạng thái ứng viên
  const getCandidateStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case 'interviewing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'hired':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Quản lý tuyển dụng</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo tin tuyển dụng
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang tuyển</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
                <SelectItem value="new">Mới</SelectItem>
                <SelectItem value="interviewing">Đang phỏng vấn</SelectItem>
                <SelectItem value="hired">Đã tuyển</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng ban</SelectItem>
                <SelectItem value="Phòng Kinh doanh">Phòng Kinh doanh</SelectItem>
                <SelectItem value="Phòng Kỹ thuật">Phòng Kỹ thuật</SelectItem>
                <SelectItem value="Phòng Marketing">Phòng Marketing</SelectItem>
                <SelectItem value="Phòng Tài chính">Phòng Tài chính</SelectItem>
                <SelectItem value="Phòng Nhân sự">Phòng Nhân sự</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="job-postings">Tin tuyển dụng</TabsTrigger>
            <TabsTrigger value="candidates">Ứng viên</TabsTrigger>
            <TabsTrigger value="interviews">Lịch phỏng vấn</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="job-postings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobPostings.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      {getJobStatusBadge(job.status)}
                    </div>
                    <CardDescription>{job.department}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Địa điểm:</span>
                        <span className="font-medium">{job.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Loại hình:</span>
                        <span className="font-medium">{job.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mức lương:</span>
                        <span className="font-medium">{job.salary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Ngày đăng:</span>
                        <span className="font-medium">{job.postedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hạn nộp:</span>
                        <span className="font-medium">{job.closingDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Số hồ sơ:</span>
                        <Badge variant="outline">{job.applications}</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex space-x-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>
                      {job.status === 'active' ? (
                        <Button variant="outline" size="sm" className="flex-1">
                          <XCircle className="h-4 w-4 mr-2" />
                          Đóng
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mở lại
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {filteredJobPostings.length === 0 && (
              <div className="text-center py-10">
                <Briefcase className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Không tìm thấy tin tuyển dụng nào</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="candidates" className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ứng viên</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Vị trí</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Liên hệ</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Kinh nghiệm</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày nộp</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredCandidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">{candidate.name}</div>
                          <div className="text-xs text-slate-500">{candidate.education}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {candidate.position}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-600 dark:text-slate-400">{candidate.email}</div>
                          <div className="text-xs text-slate-500">{candidate.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {candidate.experience}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {candidate.appliedDate}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {getCandidateStatusIcon(candidate.status)}
                            {getCandidateStatusBadge(candidate.status)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredCandidates.length === 0 && (
                <div className="py-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy ứng viên nào</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="interviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lịch phỏng vấn</CardTitle>
                <CardDescription>
                  Lịch phỏng vấn trong tuần
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Trần Thị B - Kỹ sư phần mềm</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Phòng Kỹ thuật</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Đang phỏng vấn</Badge>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>20/05/2023 - 10:00 AM</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span>Phòng họp 3, Tầng 5</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Người phỏng vấn: Nguyễn Văn X, Lê Thị Y</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Hoàng Văn E - Trưởng phòng nhân sự</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Phòng Nhân sự</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Đang phỏng vấn</Badge>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>21/05/2023 - 14:30 PM</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Building2 className="h-4 w-4 mr-2" />
                      <span>Phòng họp 1, Tầng 7</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Người phỏng vấn: Trần Văn Z, Phạm Thị W</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê tuyển dụng</CardTitle>
                  <CardDescription>
                    Số liệu tuyển dụng trong 6 tháng gần nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ thống kê tuyển dụng (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Hiệu quả tuyển dụng</CardTitle>
                  <CardDescription>
                    Tỷ lệ chuyển đổi từ ứng viên đến nhân viên
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ hiệu quả tuyển dụng (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo chi tiết</CardTitle>
                <CardDescription>
                  Báo cáo tuyển dụng theo phòng ban
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Phòng Kinh doanh</h3>
                      <p className="text-sm text-slate-600">Vị trí đang tuyển: 2</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">15 ứng viên</p>
                      <p className="text-sm text-green-600">3 đã tuyển</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Phòng Kỹ thuật</h3>
                      <p className="text-sm text-slate-600">Vị trí đang tuyển: 1</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">8 ứng viên</p>
                      <p className="text-sm text-yellow-600">Đang phỏng vấn</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Phòng Marketing</h3>
                      <p className="text-sm text-slate-600">Vị trí đang tuyển: 1</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">15 ứng viên</p>
                      <p className="text-sm text-green-600">2 đã tuyển</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EnterpriseLayout>
  );
}
