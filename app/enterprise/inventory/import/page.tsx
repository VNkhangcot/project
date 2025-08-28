'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  PackagePlus, 
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
  Filter
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

interface ImportRecord {
  id: string;
  code: string;
  supplier: string;
  date: string;
  totalItems: number;
  totalValue: number;
  status: 'completed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'partial';
}

export default function InventoryImportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Dữ liệu mẫu cho phiếu nhập kho
  const importData: ImportRecord[] = [
    { 
      id: '1', 
      code: 'NK-2024-001', 
      supplier: 'Công ty TNHH ABC', 
      date: '2024-01-05', 
      totalItems: 150, 
      totalValue: 45000000, 
      status: 'completed', 
      paymentStatus: 'paid' 
    },
    { 
      id: '2', 
      code: 'NK-2024-002', 
      supplier: 'Công ty XYZ', 
      date: '2024-01-10', 
      totalItems: 80, 
      totalValue: 25000000, 
      status: 'completed', 
      paymentStatus: 'paid' 
    },
    { 
      id: '3', 
      code: 'NK-2024-003', 
      supplier: 'Nhà cung cấp DEF', 
      date: '2024-01-15', 
      totalItems: 200, 
      totalValue: 60000000, 
      status: 'pending', 
      paymentStatus: 'unpaid' 
    },
    { 
      id: '4', 
      code: 'NK-2024-004', 
      supplier: 'Công ty GHI', 
      date: '2024-01-20', 
      totalItems: 50, 
      totalValue: 15000000, 
      status: 'completed', 
      paymentStatus: 'partial' 
    },
    { 
      id: '5', 
      code: 'NK-2024-005', 
      supplier: 'Nhà cung cấp JKL', 
      date: '2024-01-25', 
      totalItems: 100, 
      totalValue: 30000000, 
      status: 'cancelled', 
      paymentStatus: 'unpaid' 
    }
  ];

  // Lọc dữ liệu theo các bộ lọc
  const filteredImports = importData.filter(record => {
    const matchesSearch = 
      record.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || record.paymentStatus === paymentFilter;
    
    // Lọc theo thời gian
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = record.date === today;
    } else if (dateFilter === 'this_week') {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split('T')[0];
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6)).toISOString().split('T')[0];
      matchesDate = record.date >= weekStart && record.date <= weekEnd;
    } else if (dateFilter === 'this_month') {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
      matchesDate = record.date >= monthStart && record.date <= monthEnd;
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  // Tính tổng giá trị
  const totalValue = filteredImports.reduce((sum, record) => sum + record.totalValue, 0);
  const totalItems = filteredImports.reduce((sum, record) => sum + record.totalItems, 0);
  const completedValue = filteredImports.filter(r => r.status === 'completed').reduce((sum, record) => sum + record.totalValue, 0);
  const pendingValue = filteredImports.filter(r => r.status === 'pending').reduce((sum, record) => sum + record.totalValue, 0);

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho trạng thái
  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy màu cho trạng thái thanh toán
  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho trạng thái thanh toán
  const getPaymentStatusText = (status: string) => {
    switch(status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'unpaid':
        return 'Chưa thanh toán';
      case 'partial':
        return 'Thanh toán một phần';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy icon cho trạng thái
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý nhập kho</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiếu nhập kho
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Tổng giá trị nhập</p>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                <p className="text-xs text-slate-500 mt-1">{totalItems} sản phẩm</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(completedValue)}</p>
                <p className="text-xs text-slate-500 mt-1">{filteredImports.filter(r => r.status === 'completed').length} phiếu nhập</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingValue)}</p>
                <p className="text-xs text-slate-500 mt-1">{filteredImports.filter(r => r.status === 'pending').length} phiếu nhập</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Số lượng nhà cung cấp</p>
                <p className="text-2xl font-bold">
                  {new Set(filteredImports.map(r => r.supplier)).size}
                </p>
                <p className="text-xs text-slate-500 mt-1">Nhà cung cấp</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm phiếu nhập..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="pending">Đang xử lý</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="paid">Đã thanh toán</SelectItem>
              <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
              <SelectItem value="partial">Thanh toán một phần</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thời gian</SelectItem>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="this_week">Tuần này</SelectItem>
              <SelectItem value="this_month">Tháng này</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Import Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách phiếu nhập kho</CardTitle>
            <CardDescription>
              Quản lý tất cả phiếu nhập kho của doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Ngày nhập</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredImports.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.code}</TableCell>
                    <TableCell>{record.supplier}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{record.totalItems.toLocaleString()} SP</TableCell>
                    <TableCell>{formatCurrency(record.totalValue)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(record.status)}
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(record.paymentStatus)}`}>
                        {getPaymentStatusText(record.paymentStatus)}
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
                            Tải xuống
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
            {filteredImports.length === 0 && (
              <div className="py-8 text-center">
                <PackagePlus className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Không tìm thấy phiếu nhập kho nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
