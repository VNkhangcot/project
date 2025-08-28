'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DollarSign, 
  Search, 
  Download, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  Users
} from 'lucide-react';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  period: string;
  basicSalary: number;
  allowances: number;
  overtime: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending' | 'processing';
}

export default function PayrollPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setperiodFilter] = useState('current');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Dữ liệu mẫu cho phòng ban
  const departments = [
    { id: '1', name: 'Ban Giám đốc' },
    { id: '2', name: 'Phòng Kinh doanh' },
    { id: '3', name: 'Phòng Kỹ thuật' },
    { id: '4', name: 'Phòng Marketing' },
    { id: '5', name: 'Phòng Hành chính' },
    { id: '6', name: 'Phòng Nhân sự' }
  ];
  
  // Dữ liệu mẫu cho bảng lương
  const payrollData: PayrollRecord[] = [
    { 
      id: '1', 
      employeeId: '001', 
      employeeName: 'Nguyễn Văn A', 
      department: 'Ban Giám đốc', 
      position: 'Giám đốc điều hành',
      period: '01/2024', 
      basicSalary: 30000000, 
      allowances: 5000000, 
      overtime: 0, 
      bonus: 10000000, 
      deductions: 3000000, 
      netSalary: 42000000, 
      status: 'paid' 
    },
    { 
      id: '2', 
      employeeId: '002', 
      employeeName: 'Trần Thị B', 
      department: 'Phòng Kinh doanh', 
      position: 'Trưởng phòng',
      period: '01/2024', 
      basicSalary: 20000000, 
      allowances: 3000000, 
      overtime: 1500000, 
      bonus: 5000000, 
      deductions: 2000000, 
      netSalary: 27500000, 
      status: 'paid' 
    },
    { 
      id: '3', 
      employeeId: '003', 
      employeeName: 'Lê Văn C', 
      department: 'Phòng Kỹ thuật', 
      position: 'Trưởng phòng',
      period: '01/2024', 
      basicSalary: 20000000, 
      allowances: 3000000, 
      overtime: 2000000, 
      bonus: 4000000, 
      deductions: 2000000, 
      netSalary: 27000000, 
      status: 'paid' 
    },
    { 
      id: '4', 
      employeeId: '004', 
      employeeName: 'Phạm Thị D', 
      department: 'Phòng Marketing', 
      position: 'Trưởng phòng',
      period: '01/2024', 
      basicSalary: 18000000, 
      allowances: 2500000, 
      overtime: 0, 
      bonus: 3000000, 
      deductions: 1800000, 
      netSalary: 21700000, 
      status: 'paid' 
    },
    { 
      id: '5', 
      employeeId: '005', 
      employeeName: 'Hoàng Văn E', 
      department: 'Phòng Kinh doanh', 
      position: 'Nhân viên',
      period: '01/2024', 
      basicSalary: 12000000, 
      allowances: 1500000, 
      overtime: 1000000, 
      bonus: 2000000, 
      deductions: 1200000, 
      netSalary: 15300000, 
      status: 'pending' 
    },
    { 
      id: '6', 
      employeeId: '006', 
      employeeName: 'Vũ Thị F', 
      department: 'Phòng Kỹ thuật', 
      position: 'Nhân viên',
      period: '01/2024', 
      basicSalary: 12000000, 
      allowances: 1500000, 
      overtime: 2500000, 
      bonus: 1500000, 
      deductions: 1200000, 
      netSalary: 16300000, 
      status: 'processing' 
    },
    { 
      id: '7', 
      employeeId: '007', 
      employeeName: 'Đặng Văn G', 
      department: 'Phòng Marketing', 
      position: 'Nhân viên',
      period: '01/2024', 
      basicSalary: 10000000, 
      allowances: 1200000, 
      overtime: 800000, 
      bonus: 1000000, 
      deductions: 1000000, 
      netSalary: 12000000, 
      status: 'processing' 
    }
  ];

  // Lọc dữ liệu theo các bộ lọc
  const filteredPayroll = payrollData.filter(record => {
    const matchesSearch = 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || record.department === departments.find(d => d.id === departmentFilter)?.name;
    
    // Lọc theo kỳ lương
    let matchesPeriod = true;
    if (periodFilter === 'current') {
      matchesPeriod = record.period === '01/2024'; // Giả sử kỳ lương hiện tại là 01/2024
    } else if (periodFilter === 'previous') {
      matchesPeriod = record.period === '12/2023'; // Giả sử kỳ lương trước là 12/2023
    }
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesPeriod;
  });

  // Tính tổng lương
  const totalSalary = filteredPayroll.reduce((sum, record) => sum + record.netSalary, 0);
  const paidSalary = filteredPayroll.filter(r => r.status === 'paid').reduce((sum, record) => sum + record.netSalary, 0);
  const pendingSalary = filteredPayroll.filter(r => r.status === 'pending' || r.status === 'processing').reduce((sum, record) => sum + record.netSalary, 0);

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho trạng thái
  const getStatusText = (status: string) => {
    switch(status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'processing':
        return 'Đang xử lý';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy icon cho trạng thái
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý lương thưởng</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Tạo kỳ lương mới
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm bảng lương
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Tổng lương</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSalary)}</p>
                <p className="text-xs text-slate-500 mt-1">{filteredPayroll.length} nhân viên</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Đã thanh toán</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(paidSalary)}</p>
                <p className="text-xs text-slate-500 mt-1">{filteredPayroll.filter(r => r.status === 'paid').length} nhân viên</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Chờ thanh toán</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingSalary)}</p>
                <p className="text-xs text-slate-500 mt-1">{filteredPayroll.filter(r => r.status === 'pending' || r.status === 'processing').length} nhân viên</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Tiến độ thanh toán lương tháng 01/2024</p>
                <p className="text-sm font-medium">{Math.round((paidSalary / totalSalary) * 100)}%</p>
              </div>
              <Progress value={Math.round((paidSalary / totalSalary) * 100)} className="h-2" />
              <p className="text-xs text-slate-500">
                {filteredPayroll.filter(r => r.status === 'paid').length} / {filteredPayroll.length} nhân viên đã được thanh toán
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
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
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phòng ban</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="paid">Đã thanh toán</SelectItem>
              <SelectItem value="pending">Chờ thanh toán</SelectItem>
              <SelectItem value="processing">Đang xử lý</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodFilter} onValueChange={setperiodFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Kỳ lương" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Tháng hiện tại (01/2024)</SelectItem>
              <SelectItem value="previous">Tháng trước (12/2023)</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Payroll Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bảng lương</CardTitle>
            <CardDescription>
              Quản lý lương thưởng của nhân viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead>Lương cơ bản</TableHead>
                  <TableHead>Phụ cấp</TableHead>
                  <TableHead>Thưởng</TableHead>
                  <TableHead>Khấu trừ</TableHead>
                  <TableHead>Thực lãnh</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayroll.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{record.employeeName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{record.employeeName}</p>
                          <p className="text-xs text-slate-500">{record.position}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{formatCurrency(record.basicSalary)}</TableCell>
                    <TableCell>{formatCurrency(record.allowances)}</TableCell>
                    <TableCell>{formatCurrency(record.bonus + record.overtime)}</TableCell>
                    <TableCell>{formatCurrency(record.deductions)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(record.netSalary)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(record.status)}
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </div>
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Xuất phiếu lương
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
            {filteredPayroll.length === 0 && (
              <div className="py-8 text-center">
                <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Không tìm thấy dữ liệu lương</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
