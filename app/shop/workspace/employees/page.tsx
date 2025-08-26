'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  MoreVertical,
  MessageSquare,
  UserPlus
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';

// Mock data cho employees
const mockEmployees = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@abc.com',
    phone: '0123456789',
    role: 'Trưởng phòng IT',
    department: 'Phòng Công nghệ thông tin',
    avatar: '',
    status: 'active',
    joinDate: '2023-01-15',
    location: 'TP.HCM',
    permissions: ['view_reports', 'manage_tasks', 'view_employees', 'create_documents', 'manage_employees'],
    currentTasks: 5,
    completedTasks: 28,
    skills: ['React', 'Node.js', 'Python', 'Management']
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'tranthib@abc.com',
    phone: '0987654321',
    role: 'Nhân viên IT',
    department: 'Phòng Công nghệ thông tin',
    avatar: '',
    status: 'active',
    joinDate: '2023-03-20',
    location: 'TP.HCM',
    permissions: ['view_reports', 'manage_tasks', 'view_employees', 'create_documents'],
    currentTasks: 3,
    completedTasks: 15,
    skills: ['JavaScript', 'Vue.js', 'CSS', 'UI/UX']
  },
  {
    id: '3',
    name: 'Lê Văn C',
    email: 'levanc@abc.com',
    phone: '0369852147',
    role: 'Nhân viên Marketing',
    department: 'Phòng Marketing',
    avatar: '',
    status: 'active',
    joinDate: '2023-02-10',
    location: 'Hà Nội',
    permissions: ['view_reports', 'create_documents'],
    currentTasks: 4,
    completedTasks: 22,
    skills: ['Digital Marketing', 'Content Writing', 'SEO', 'Social Media']
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    email: 'phamthid@abc.com',
    phone: '0741852963',
    role: 'Kế toán viên',
    department: 'Phòng Kế toán',
    avatar: '',
    status: 'inactive',
    joinDate: '2022-11-05',
    location: 'TP.HCM',
    permissions: ['view_reports'],
    currentTasks: 0,
    completedTasks: 45,
    skills: ['Excel', 'Accounting', 'Financial Analysis', 'Tax']
  }
];

const departments = [
  'Tất cả phòng ban',
  'Phòng Công nghệ thông tin',
  'Phòng Marketing',
  'Phòng Kế toán',
  'Phòng Nhân sự',
  'Phòng Kinh doanh'
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Tất cả phòng ban');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang làm việc';
      case 'inactive':
        return 'Nghỉ việc';
      case 'on_leave':
        return 'Nghỉ phép';
      default:
        return 'Không xác định';
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'Tất cả phòng ban' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Danh sách nhân viên
              </h1>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm nhân viên
            </Button>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý thông tin và quyền hạn của các thành viên trong công ty
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {employees.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tổng nhân viên
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {employees.filter(emp => emp.status === 'active').length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đang làm việc
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {new Set(employees.map(emp => emp.department)).size}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Phòng ban
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {employees.reduce((sum, emp) => sum + emp.currentTasks, 0)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Công việc hiện tại
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    placeholder="Tìm kiếm nhân viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang làm việc</SelectItem>
                  <SelectItem value="inactive">Nghỉ việc</SelectItem>
                  <SelectItem value="on_leave">Nghỉ phép</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {employee.role}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(employee.status)}>
                    {getStatusText(employee.status)}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <Briefcase className="h-4 w-4" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <span>{employee.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {employee.currentTasks}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Công việc hiện tại
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {employee.completedTasks}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Đã hoàn thành
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {employee.permissions.length}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Quyền hạn
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                        Xem chi tiết
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedEmployee?.avatar} alt={selectedEmployee?.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {selectedEmployee && getInitials(selectedEmployee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span>{selectedEmployee?.name}</span>
                            <p className="text-sm text-slate-600 font-normal">
                              {selectedEmployee?.role}
                            </p>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      
                      {selectedEmployee && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Thông tin liên hệ</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-slate-500" />
                                  <span>{selectedEmployee.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-slate-500" />
                                  <span>{selectedEmployee.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-slate-500" />
                                  <span>{selectedEmployee.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-slate-500" />
                                  <span>Gia nhập: {new Date(selectedEmployee.joinDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Thống kê công việc</h4>
                              <div className="space-y-2 text-sm">
                                <p><strong>Công việc hiện tại:</strong> {selectedEmployee.currentTasks}</p>
                                <p><strong>Đã hoàn thành:</strong> {selectedEmployee.completedTasks}</p>
                                <p><strong>Phòng ban:</strong> {selectedEmployee.department}</p>
                                <p><strong>Trạng thái:</strong> 
                                  <Badge className={`ml-2 ${getStatusColor(selectedEmployee.status)}`}>
                                    {getStatusText(selectedEmployee.status)}
                                  </Badge>
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Kỹ năng</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedEmployee.skills.map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Quyền hạn</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedEmployee.permissions.map((permission: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                  <Shield className="h-4 w-4 text-green-600" />
                                  <span>{permission}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Không tìm thấy nhân viên
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
