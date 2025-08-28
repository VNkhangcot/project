'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, Edit, Trash2, Mail, Phone, MoreHorizontal, FileText, Calendar, Users } from 'lucide-react';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  departmentId: number;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'onleave';
  avatar?: string;
  businessId: number;
}

interface Department {
  id: number;
  name: string;
  businessId: number;
}

interface Business {
  id: number;
  name: string;
}

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Dữ liệu mẫu cho doanh nghiệp
  const businesses: Business[] = [
    { id: 1, name: 'Công ty TNHH ABC' },
    { id: 2, name: 'Nhà hàng XYZ' },
    { id: 3, name: 'Cửa hàng thời trang Fashion' }
  ];
  
  // Dữ liệu mẫu cho phòng ban
  const departments: Department[] = [
    { id: 1, name: 'Ban Giám đốc', businessId: 1 },
    { id: 2, name: 'Phòng Kinh doanh', businessId: 1 },
    { id: 3, name: 'Phòng Kỹ thuật', businessId: 1 },
    { id: 4, name: 'Phòng Marketing', businessId: 1 },
    { id: 5, name: 'Phòng Hành chính', businessId: 1 },
    { id: 6, name: 'Phòng Nhân sự', businessId: 1 },
    { id: 7, name: 'Quản lý', businessId: 2 },
    { id: 8, name: 'Nhân viên phục vụ', businessId: 2 },
    { id: 9, name: 'Đầu bếp', businessId: 2 },
    { id: 10, name: 'Quản lý', businessId: 3 },
    { id: 11, name: 'Nhân viên bán hàng', businessId: 3 },
    { id: 12, name: 'Kho vận', businessId: 3 },
  ];
  
  // Dữ liệu mẫu cho nhân viên
  const employees: Employee[] = [
    { 
      id: 1, 
      name: 'Nguyễn Văn A', 
      position: 'Giám đốc điều hành', 
      department: 'Ban Giám đốc',
      departmentId: 1,
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      joinDate: '01/01/2020',
      status: 'active',
      businessId: 1
    },
    { 
      id: 2, 
      name: 'Trần Thị B', 
      position: 'Trưởng phòng Kinh doanh', 
      department: 'Phòng Kinh doanh',
      departmentId: 2,
      email: 'tranthib@example.com',
      phone: '0901234568',
      joinDate: '01/03/2020',
      status: 'active',
      businessId: 1
    },
    { 
      id: 3, 
      name: 'Lê Văn C', 
      position: 'Trưởng phòng Kỹ thuật', 
      department: 'Phòng Kỹ thuật',
      departmentId: 3,
      email: 'levanc@example.com',
      phone: '0901234569',
      joinDate: '01/04/2020',
      status: 'active',
      businessId: 1
    },
    { 
      id: 4, 
      name: 'Phạm Thị D', 
      position: 'Trưởng phòng Marketing', 
      department: 'Phòng Marketing',
      departmentId: 4,
      email: 'phamthid@example.com',
      phone: '0901234570',
      joinDate: '01/05/2020',
      status: 'active',
      businessId: 1
    },
    { 
      id: 5, 
      name: 'Hoàng Văn E', 
      position: 'Nhân viên Kinh doanh', 
      department: 'Phòng Kinh doanh',
      departmentId: 2,
      email: 'hoangvane@example.com',
      phone: '0901234571',
      joinDate: '01/06/2020',
      status: 'active',
      businessId: 1
    },
    { 
      id: 6, 
      name: 'Vũ Thị F', 
      position: 'Nhân viên Kỹ thuật', 
      department: 'Phòng Kỹ thuật',
      departmentId: 3,
      email: 'vuthif@example.com',
      phone: '0901234572',
      joinDate: '01/07/2020',
      status: 'onleave',
      businessId: 1
    },
    { 
      id: 7, 
      name: 'Đặng Văn G', 
      position: 'Nhân viên Marketing', 
      department: 'Phòng Marketing',
      departmentId: 4,
      email: 'dangvang@example.com',
      phone: '0901234573',
      joinDate: '01/08/2020',
      status: 'inactive',
      businessId: 1
    },
    { 
      id: 8, 
      name: 'Đỗ Văn H', 
      position: 'Quản lý', 
      department: 'Quản lý',
      departmentId: 7,
      email: 'dovanh@example.com',
      phone: '0901234574',
      joinDate: '01/02/2020',
      status: 'active',
      businessId: 2
    },
    { 
      id: 9, 
      name: 'Lý Thị I', 
      position: 'Nhân viên phục vụ', 
      department: 'Nhân viên phục vụ',
      departmentId: 8,
      email: 'lythii@example.com',
      phone: '0901234575',
      joinDate: '01/03/2020',
      status: 'active',
      businessId: 2
    },
    { 
      id: 10, 
      name: 'Mai Văn K', 
      position: 'Quản lý', 
      department: 'Quản lý',
      departmentId: 10,
      email: 'maivank@example.com',
      phone: '0901234576',
      joinDate: '01/04/2020',
      status: 'active',
      businessId: 3
    }
  ];

  // Lọc nhân viên theo từ khóa tìm kiếm, doanh nghiệp và phòng ban
  const filteredEmployees = employees.filter(
    (employee) => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBusiness = businessFilter === 'all' || employee.businessId === parseInt(businessFilter);
      
      const matchesDepartment = departmentFilter === 'all' || employee.departmentId === parseInt(departmentFilter);
      
      return matchesSearch && matchesBusiness && matchesDepartment;
    }
  );

  // Lọc phòng ban theo doanh nghiệp đã chọn
  const filteredDepartments = departments.filter(
    (department) => businessFilter === 'all' || department.businessId === parseInt(businessFilter)
  );

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'onleave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho trạng thái
  const getStatusText = (status: string) => {
    switch(status) {
      case 'active':
        return 'Đang làm việc';
      case 'inactive':
        return 'Đã nghỉ việc';
      case 'onleave':
        return 'Đang nghỉ phép';
      default:
        return 'Không xác định';
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const handleSaveEmployee = () => {
    // Xử lý lưu nhân viên
    setIsDialogOpen(false);
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý nhân viên</h1>
          <Button className="flex items-center gap-2" onClick={handleAddEmployee}>
            <PlusCircle className="h-4 w-4" />
            Thêm nhân viên
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={businessFilter} onValueChange={(value) => {
              setBusinessFilter(value);
              setDepartmentFilter('all'); // Reset department filter when business changes
            }}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Doanh nghiệp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả doanh nghiệp</SelectItem>
                {businesses.map((business) => (
                  <SelectItem key={business.id} value={business.id.toString()}>
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng ban</SelectItem>
                {filteredDepartments.map((department) => (
                  <SelectItem key={department.id} value={department.id.toString()}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Xuất Excel
            </Button>
            <Button variant="outline" size="sm">
              In danh sách
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách nhân viên</CardTitle>
            <CardDescription>
              Quản lý tất cả nhân viên trong doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Ngày vào làm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {employee.avatar ? (
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                          ) : null}
                          <AvatarFallback>
                            {employee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{employee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{employee.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.joinDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(employee.status)}`}>
                        {getStatusText(employee.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewEmployee(employee)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Lịch làm việc
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredEmployees.length} / {employees.length} nhân viên
            </div>
          </CardFooter>
        </Card>

        {/* Dialog thêm/sửa nhân viên */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết về nhân viên. Nhấn lưu khi hoàn tất.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    defaultValue={editingEmployee?.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Chức vụ</Label>
                  <Input
                    id="position"
                    defaultValue={editingEmployee?.position}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={editingEmployee?.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    defaultValue={editingEmployee?.phone}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business">Doanh nghiệp</Label>
                  <Select defaultValue={editingEmployee?.businessId.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn doanh nghiệp" />
                    </SelectTrigger>
                    <SelectContent>
                      {businesses.map((business) => (
                        <SelectItem key={business.id} value={business.id.toString()}>
                          {business.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Phòng ban</Label>
                  <Select defaultValue={editingEmployee?.departmentId.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Ngày vào làm</Label>
                  <Input
                    id="joinDate"
                    defaultValue={editingEmployee?.joinDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select defaultValue={editingEmployee?.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang làm việc</SelectItem>
                      <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
                      <SelectItem value="onleave">Đang nghỉ phép</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveEmployee}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog xem chi tiết nhân viên */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                Thông tin nhân viên
              </DialogTitle>
              <DialogDescription>
                Chi tiết thông tin nhân viên
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
                  <TabsTrigger value="work">Công việc</TabsTrigger>
                  <TabsTrigger value="history">Lịch sử</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-24 w-24">
                        {selectedEmployee.avatar ? (
                          <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                        ) : null}
                        <AvatarFallback className="text-2xl">
                          {selectedEmployee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold">{selectedEmployee.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedEmployee.position}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedEmployee.status)}`}>
                        {getStatusText(selectedEmployee.status)}
                      </span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Số điện thoại</p>
                        <p className="font-medium">{selectedEmployee.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Doanh nghiệp</p>
                        <p className="font-medium">
                          {businesses.find(b => b.id === selectedEmployee.businessId)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phòng ban</p>
                        <p className="font-medium">{selectedEmployee.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày vào làm</p>
                        <p className="font-medium">{selectedEmployee.joinDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Thâm niên</p>
                        <p className="font-medium">3 năm 5 tháng</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="work" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Dự án hiện tại</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Dự án A</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Đang thực hiện</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Dự án B</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Hoàn thành</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Kỹ năng</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-slate-100 px-2 py-1 rounded-full text-xs">Excel</span>
                          <span className="bg-slate-100 px-2 py-1 rounded-full text-xs">Word</span>
                          <span className="bg-slate-100 px-2 py-1 rounded-full text-xs">PowerPoint</span>
                          <span className="bg-slate-100 px-2 py-1 rounded-full text-xs">Tiếng Anh</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Lịch làm việc</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Thứ 2 - Thứ 6</span>
                            <span className="text-sm">8:00 - 17:00</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Nghỉ phép</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Đã sử dụng</span>
                            <span className="text-sm">5 ngày</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Còn lại</span>
                            <span className="text-sm">7 ngày</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Được thăng chức lên Trưởng phòng</p>
                        <p className="text-xs text-muted-foreground">01/01/2022</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-green-100 p-2">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Hoàn thành dự án XYZ</p>
                        <p className="text-xs text-muted-foreground">15/06/2021</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-purple-100 p-2">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Gia nhập công ty</p>
                        <p className="text-xs text-muted-foreground">{selectedEmployee.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </EnterpriseLayout>
  );
}
