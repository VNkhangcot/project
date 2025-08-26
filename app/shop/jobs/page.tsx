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
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Filter,
  Briefcase,
  Users,
  Calendar
} from 'lucide-react';
import JobApplicationWizard from '@/components/jobs/JobApplicationWizard';
import UserLayout from '@/components/layout/UserLayout';

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Nhân viên bán hàng',
    company: 'Cửa hàng điện tử ABC',
    location: 'Quận 1, TP.HCM',
    salary: '8-12 triệu VNĐ',
    type: 'Toàn thời gian',
    experience: '1-2 năm',
    postedDate: '2024-01-15',
    description: 'Tư vấn và bán các sản phẩm điện tử cho khách hàng. Yêu cầu có kinh nghiệm bán hàng và giao tiếp tốt.',
    requirements: [
      'Tốt nghiệp THPT trở lên',
      'Có kinh nghiệm bán hàng 1-2 năm',
      'Giao tiếp tốt, nhiệt tình',
      'Biết sử dụng máy tính cơ bản'
    ],
    benefits: [
      'Lương cơ bản + hoa hồng',
      'Bảo hiểm xã hội đầy đủ',
      'Thưởng tháng 13',
      'Môi trường làm việc thân thiện'
    ],
    category: 'ban-hang',
    urgent: true
  },
  {
    id: '2',
    title: 'Lập trình viên Frontend',
    company: 'Công ty TNHH Công nghệ XYZ',
    location: 'Quận 7, TP.HCM',
    salary: '15-25 triệu VNĐ',
    type: 'Toàn thời gian',
    experience: '2-3 năm',
    postedDate: '2024-01-14',
    description: 'Phát triển giao diện người dùng cho các ứng dụng web và mobile. Làm việc với React, Next.js và TypeScript.',
    requirements: [
      'Tốt nghiệp Đại học chuyên ngành IT',
      'Có kinh nghiệm 2+ năm với React/Next.js',
      'Thành thạo HTML, CSS, JavaScript',
      'Biết sử dụng Git, RESTful API'
    ],
    benefits: [
      'Lương cạnh tranh theo năng lực',
      'Làm việc hybrid',
      'Đào tạo và phát triển kỹ năng',
      'Team building định kỳ'
    ],
    category: 'cong-nghe',
    urgent: false
  },
  {
    id: '3',
    title: 'Nhân viên kế toán',
    company: 'Công ty Cổ phần Thương mại DEF',
    location: 'Quận 3, TP.HCM',
    salary: '10-15 triệu VNĐ',
    type: 'Toàn thời gian',
    experience: '1-3 năm',
    postedDate: '2024-01-13',
    description: 'Thực hiện các công việc kế toán tổng hợp, lập báo cáo tài chính và quản lý sổ sách kế toán.',
    requirements: [
      'Tốt nghiệp Đại học chuyên ngành Kế toán',
      'Có chứng chỉ kế toán trưởng',
      'Thành thạo Excel, phần mềm kế toán',
      'Tỉ mỉ, cẩn thận trong công việc'
    ],
    benefits: [
      'Lương thỏa thuận theo năng lực',
      'Chế độ phúc lợi tốt',
      'Nghỉ phép có lương',
      'Cơ hội thăng tiến'
    ],
    category: 'ke-toan',
    urgent: false
  },
  {
    id: '4',
    title: 'Nhân viên marketing',
    company: 'Cửa hàng thời trang GHI',
    location: 'Quận 10, TP.HCM',
    salary: '8-15 triệu VNĐ',
    type: 'Toàn thời gian',
    experience: 'Không yêu cầu',
    postedDate: '2024-01-12',
    description: 'Lập kế hoạch marketing, quản lý mạng xã hội và tổ chức các chương trình khuyến mãi.',
    requirements: [
      'Tốt nghiệp Đại học các ngành liên quan',
      'Có hiểu biết về marketing digital',
      'Sáng tạo, năng động',
      'Biết sử dụng Photoshop, Canva'
    ],
    benefits: [
      'Lương cơ bản + KPI',
      'Môi trường trẻ, năng động',
      'Học hỏi kinh nghiệm thực tế',
      'Cơ hội phát triển nghề nghiệp'
    ],
    category: 'marketing',
    urgent: true
  }
];

const jobCategories = [
  { value: 'all', label: 'Tất cả ngành nghề' },
  { value: 'ban-hang', label: 'Bán hàng' },
  { value: 'cong-nghe', label: 'Công nghệ thông tin' },
  { value: 'ke-toan', label: 'Kế toán' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'nhan-su', label: 'Nhân sự' },
  { value: 'dich-vu', label: 'Dịch vụ khách hàng' }
];

const experienceLevels = [
  { value: 'all', label: 'Tất cả kinh nghiệm' },
  { value: 'khong-yeu-cau', label: 'Không yêu cầu' },
  { value: '1-2-nam', label: '1-2 năm' },
  { value: '2-3-nam', label: '2-3 năm' },
  { value: '3-5-nam', label: '3-5 năm' },
  { value: 'tren-5-nam', label: 'Trên 5 năm' }
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyJob = (job: any) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays <= 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Tìm việc làm
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Khám phá các cơ hội nghề nghiệp từ các công ty và cửa hàng uy tín
          </p>
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
                    placeholder="Tìm kiếm công việc, công ty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
<Select value={selectedCategory} onValueChange={(value) => {
  console.log("Selected Category:", value); // Debug log
  setSelectedCategory(value);
}}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Chọn ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Experience Filter */}
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Kinh nghiệm" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {filteredJobs.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Việc làm phù hợp
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {new Set(mockJobs.map(job => job.company)).size}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Công ty tuyển dụng
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
                    {mockJobs.filter(job => job.urgent).length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tuyển gấp
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {job.title}
                          </h3>
                          {job.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Tuyển gấp
                            </Badge>
                          )}
                        </div>
                        <p className="text-blue-600 font-medium">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(job.postedDate)}</span>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2 md:ml-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <span>{job.title}</span>
                            {job.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Tuyển gấp
                              </Badge>
                            )}
                          </DialogTitle>
                          <DialogDescription>
                            {job.company} • {job.location}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-slate-500" />
                              <span><strong>Mức lương:</strong> {job.salary}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-slate-500" />
                              <span><strong>Kinh nghiệm:</strong> {job.experience}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-slate-500" />
                              <span><strong>Loại hình:</strong> {job.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-slate-500" />
                              <span><strong>Đăng:</strong> {formatDate(job.postedDate)}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Mô tả công việc</h4>
                            <p className="text-slate-700 dark:text-slate-300">{job.description}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Yêu cầu công việc</h4>
                            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                              {job.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Quyền lợi</h4>
                            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                              {job.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </div>

                          <Button 
                            onClick={() => handleApplyJob(job)}
                            className="w-full"
                          >
                            Nộp đơn ứng tuyển
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      onClick={() => handleApplyJob(job)}
                      size="sm"
                    >
                      Ứng tuyển ngay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Không tìm thấy việc làm phù hợp
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thêm cơ hội việc làm
              </p>
            </CardContent>
          </Card>
        )}

        {/* Job Application Wizard */}
        {showApplicationForm && selectedJob && (
          <JobApplicationWizard 
            job={selectedJob}
            isOpen={showApplicationForm}
            onClose={() => {
              setShowApplicationForm(false);
              setSelectedJob(null);
            }}
          />
        )}
      </div>
    </UserLayout>
  );
}
