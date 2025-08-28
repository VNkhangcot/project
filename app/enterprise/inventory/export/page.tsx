'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  PackageMinus, 
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

interface ExportRecord {
  id: string;
  code: string;
  recipient: string;
  date: string;
  totalItems: number;
  totalValue: number;
  status: 'completed' | 'pending' | 'cancelled';
  type: 'sale' | 'transfer' | 'return' | 'other';
}

export default function InventoryExportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Dữ liệu mẫu cho phiếu xuất kho
  const exportData: ExportRecord[] = [
    { 
      id: '1', 
      code: 'XK-2024-001', 
      recipient: 'Cửa hàng Chi nhánh 1', 
      date: '2024-01-05', 
      totalItems: 100, 
      totalValue: 30000000, 
      status: 'completed', 
      type: 'transfer' 
    },
    { 
      id: '2', 
      code: 'XK-2024-002', 
      recipient: 'Khách hàng ABC', 
      date: '2024-01-10', 
      totalItems: 50, 
      totalValue: 15000000, 
      status: 'completed', 
      type: 'sale' 
    },
    { 
      id: '3', 
      code: 'XK-2024-003', 
      recipient: 'Nhà cung cấp XYZ', 
      date: '2024-01-15', 
      totalItems: 20, 
      totalValue: 5000000, 
      status: 'completed', 
      type: 'return' 
    },
    { 
      id: '4', 
      code: 'XK-2024-004', 
      recipient: 'Cửa hàng Chi nhánh 2', 
      date: '2024-01-20', 
      totalItems: 80, 
      totalValue: 24000000, 
      status: 'pending', 
      type: 'transfer' 
    },
    { 
      id: '5', 
      code: 'XK-2024-005', 
      recipient: 'Khách hàng DEF', 
      date: '2024-01-25', 
      totalItems: 30, 
      totalValue: 9000000, 
      status: 'cancelled', 
      type: 'sale' 
    }
  ];

  // Lọc dữ liệu theo các bộ lọc
  const filteredExports = exportData.filter(record => {
    const matchesSearch = 
      record.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    
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
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Tính tổng giá trị
  const totalValue = filteredExports.reduce((sum, record) => sum + record.totalValue, 0);
  const totalItems = filteredExports.reduce((sum, record) => sum + record.totalItems, 0);
  const completedValue = filteredExports.filter(r => r.status === 'completed').reduce((sum, record) => sum + record.totalValue, 0);
  const pendingValue = filteredExports.filter(r => r.status === 'pending').reduce((sum, record) => sum + record.totalValue, 0);

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

  // Hàm lấy màu cho loại xuất kho
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'sale':
        return 'bg-blue-100 text-blue-800';
      case 'transfer':
        return 'bg-purple-100 text-purple-800';
      case 'return':
        return 'bg-orange-100 text-orange-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho loại xuất kho
  const getTypeText = (type: string) => {
    switch(type) {
      case 'sale':
        return 'Bán hàng';
      case 'transfer':
        return 'Chuyển kho';
      case 'return':
        return 'Trả hàng';
      case 'other':
        return 'Khác';
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
          <h1 className="text-3xl font-bold tracking-tight">Quản lý xuất kho</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiếu xuất kho
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Tổng giá trị xuất</p>
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
                <p className="text-xs text-slate-500 mt-1">{filteredExports.filter(r => r.status === 'completed').length} phiếu xuất</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingValue)}</p>
                <p className="text-xs text-slate-500 mt-1">{filteredExports.filter(r => r.status === 'pending').length} phiếu xuất</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Số lượng đơn vị nhận</p>
                <p className="text-2xl font-bold">
                  {new Set(filteredExports.map(r => r.recipient)).size}
                </p>
                <p className="text-xs text-slate-500 mt-1">Đơn vị nhận</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm phiếu xuất..."
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Loại xuất kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="sale">Bán hàng</SelectItem>
              <SelectItem value="transfer">Chuyển kho</SelectItem>
              <SelectItem value="return">Trả hàng</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
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

        {/* Export Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách phiếu xuất kho</CardTitle>
            <CardDescription>
              Quản lý tất cả phiếu xuất kho của doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Đơn vị nhận</TableHead>
                  <TableHead>Ngày xuất</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Loại xuất</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExports.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.code}</TableCell>
                    <TableCell>{record.recipient}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{record.totalItems.toLocaleString()} SP</TableCell>
                    <TableCell>{formatCurrency(record.totalValue)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(record.type)}`}>
                        {getTypeText(record.type)}
                      </span>
                    </TableCell>
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
            {filteredExports.length === 0 && (
              <div className="py-8 text-center">
                <PackageMinus className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Không tìm thấy phiếu xuất kho nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
