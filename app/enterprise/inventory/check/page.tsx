'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ClipboardCheck, 
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
  Filter,
  AlertTriangle
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
import { Progress } from '@/components/ui/progress';

interface StocktakeRecord {
  id: string;
  code: string;
  warehouse: string;
  startDate: string;
  endDate: string | null;
  totalItems: number;
  checkedItems: number;
  discrepancies: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string[];
}

export default function InventoryCheckPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Dữ liệu mẫu cho kho
  const warehouses = [
    { id: '1', name: 'Kho chính' },
    { id: '2', name: 'Kho chi nhánh 1' },
    { id: '3', name: 'Kho chi nhánh 2' }
  ];
  
  // Dữ liệu mẫu cho phiếu kiểm kê
  const stocktakeData: StocktakeRecord[] = [
    { 
      id: '1', 
      code: 'KK-2024-001', 
      warehouse: 'Kho chính', 
      startDate: '2024-01-05', 
      endDate: '2024-01-07', 
      totalItems: 500, 
      checkedItems: 500, 
      discrepancies: 12, 
      status: 'completed', 
      assignedTo: ['Nguyễn Văn A', 'Trần Thị B'] 
    },
    { 
      id: '2', 
      code: 'KK-2024-002', 
      warehouse: 'Kho chi nhánh 1', 
      startDate: '2024-01-10', 
      endDate: '2024-01-12', 
      totalItems: 300, 
      checkedItems: 300, 
      discrepancies: 5, 
      status: 'completed', 
      assignedTo: ['Lê Văn C'] 
    },
    { 
      id: '3', 
      code: 'KK-2024-003', 
      warehouse: 'Kho chi nhánh 2', 
      startDate: '2024-01-15', 
      endDate: null, 
      totalItems: 400, 
      checkedItems: 250, 
      discrepancies: 8, 
      status: 'in_progress', 
      assignedTo: ['Phạm Thị D', 'Hoàng Văn E'] 
    },
    { 
      id: '4', 
      code: 'KK-2024-004', 
      warehouse: 'Kho chính', 
      startDate: '2024-01-20', 
      endDate: null, 
      totalItems: 600, 
      checkedItems: 0, 
      discrepancies: 0, 
      status: 'cancelled', 
      assignedTo: ['Nguyễn Văn A', 'Vũ Thị F'] 
    },
    { 
      id: '5', 
      code: 'KK-2024-005', 
      warehouse: 'Kho chi nhánh 1', 
      startDate: '2024-01-25', 
      endDate: null, 
      totalItems: 350, 
      checkedItems: 120, 
      discrepancies: 3, 
      status: 'in_progress', 
      assignedTo: ['Đặng Văn G'] 
    }
  ];

  // Lọc dữ liệu theo các bộ lọc
  const filteredStocktakes = stocktakeData.filter(record => {
    const matchesSearch = 
      record.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.assignedTo.some(person => person.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesWarehouse = warehouseFilter === 'all' || record.warehouse === warehouses.find(w => w.id === warehouseFilter)?.name;
    
    // Lọc theo thời gian
    let matchesDate = true;
    if (dateFilter === 'this_week') {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split('T')[0];
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6)).toISOString().split('T')[0];
      matchesDate = record.startDate >= weekStart && record.startDate <= weekEnd;
    } else if (dateFilter === 'this_month') {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
      matchesDate = record.startDate >= monthStart && record.startDate <= monthEnd;
    }
    
    return matchesSearch && matchesStatus && matchesWarehouse && matchesDate;
  });

  // Tính tổng số lượng
  const totalItems = filteredStocktakes.reduce((sum, record) => sum + record.totalItems, 0);
  const checkedItems = filteredStocktakes.reduce((sum, record) => sum + record.checkedItems, 0);
  const totalDiscrepancies = filteredStocktakes.reduce((sum, record) => sum + record.discrepancies, 0);

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
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
      case 'in_progress':
        return 'Đang thực hiện';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy icon cho trạng thái
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  // Hàm tính phần trăm hoàn thành
  const getCompletionPercentage = (record: StocktakeRecord) => {
    return Math.round((record.checkedItems / record.totalItems) * 100);
  };

  // Lấy danh sách nhân viên đang thực hiện kiểm kê
  const activeStaff = Array.from(new Set(stocktakeData
    .filter(r => r.status === 'in_progress')
    .flatMap(r => r.assignedTo)));

  // Kiểm tra xem có nhân viên nào đang thực hiện kiểm kê không
  const hasActiveStaff = stocktakeData.some(r => r.status === 'in_progress');

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý kiểm kê kho</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiếu kiểm kê
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Tổng số phiếu kiểm kê</p>
                <p className="text-2xl font-bold">{filteredStocktakes.length}</p>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-800">
                    {filteredStocktakes.filter(r => r.status === 'completed').length} hoàn thành
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {filteredStocktakes.filter(r => r.status === 'in_progress').length} đang thực hiện
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Tổng số sản phẩm kiểm kê</p>
                <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Đã kiểm tra: {checkedItems.toLocaleString()} ({Math.round((checkedItems / totalItems) * 100)}%)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Số lượng chênh lệch</p>
                <p className="text-2xl font-bold text-amber-600">{totalDiscrepancies.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Tỷ lệ: {Math.round((totalDiscrepancies / checkedItems) * 100)}% sản phẩm
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Số lượng kho đã kiểm kê</p>
                <p className="text-2xl font-bold">
                  {new Set(filteredStocktakes.map(r => r.warehouse)).size}
                </p>
                <p className="text-xs text-slate-500 mt-1">Kho</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm phiếu kiểm kê..."
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
              <SelectItem value="in_progress">Đang thực hiện</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả kho</SelectItem>
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thời gian</SelectItem>
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

        {/* Stocktake Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách phiếu kiểm kê</CardTitle>
            <CardDescription>
              Quản lý tất cả phiếu kiểm kê kho của doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Ngày kết thúc</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Chênh lệch</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocktakes.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.code}</TableCell>
                    <TableCell>{record.warehouse}</TableCell>
                    <TableCell>{new Date(record.startDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      {record.endDate ? new Date(record.endDate).toLocaleDateString('vi-VN') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>{record.checkedItems}/{record.totalItems}</span>
                          <span>{getCompletionPercentage(record)}%</span>
                        </div>
                        <Progress value={getCompletionPercentage(record)} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {record.discrepancies > 0 && (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                        <span>{record.discrepancies} SP</span>
                      </div>
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
            {filteredStocktakes.length === 0 && (
              <div className="py-8 text-center">
                <ClipboardCheck className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Không tìm thấy phiếu kiểm kê nào</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assigned Staff */}
        <Card>
          <CardHeader>
            <CardTitle>Nhân viên được phân công kiểm kê</CardTitle>
            <CardDescription>
              Danh sách nhân viên đang thực hiện kiểm kê
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeStaff.map((staff, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{staff.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{staff}</p>
                        <p className="text-xs text-slate-500">
                          {stocktakeData
                            .filter(r => r.status === 'in_progress' && r.assignedTo.includes(staff))
                            .map(r => r.code)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {!hasActiveStaff && (
              <div className="py-4 text-center">
                <p className="text-slate-500">Không có nhân viên nào đang thực hiện kiểm kê</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
