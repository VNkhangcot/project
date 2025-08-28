'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Tag, 
  Search, 
  Download, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Percent, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  BarChart3
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

interface Promotion {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed' | 'shipping' | 'bogo';
  value: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  status: 'active' | 'scheduled' | 'expired' | 'disabled';
  products: string[];
  customerTypes: string[];
}

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Dữ liệu mẫu cho khuyến mãi
  const promotionsData: Promotion[] = [
    { 
      id: '1', 
      code: 'SUMMER2024', 
      name: 'Khuyến mãi hè 2024', 
      type: 'percentage', 
      value: 20, 
      minPurchase: 500000, 
      startDate: '2024-06-01', 
      endDate: '2024-08-31', 
      usageLimit: 1000, 
      usageCount: 0, 
      status: 'scheduled', 
      products: ['Tất cả'],
      customerTypes: ['Tất cả']
    },
    { 
      id: '2', 
      code: 'NEWYEAR24', 
      name: 'Khuyến mãi đầu năm', 
      type: 'percentage', 
      value: 15, 
      minPurchase: 300000, 
      startDate: '2024-01-01', 
      endDate: '2024-01-31', 
      usageLimit: 500, 
      usageCount: 320, 
      status: 'active', 
      products: ['Tất cả'],
      customerTypes: ['Tất cả']
    },
    { 
      id: '3', 
      code: 'FREESHIP', 
      name: 'Miễn phí vận chuyển', 
      type: 'shipping', 
      value: 100, 
      minPurchase: 200000, 
      startDate: '2024-01-01', 
      endDate: '2024-12-31', 
      usageLimit: 2000, 
      usageCount: 450, 
      status: 'active', 
      products: ['Tất cả'],
      customerTypes: ['Tất cả']
    },
    { 
      id: '4', 
      code: 'VIP100K', 
      name: 'Giảm 100K cho VIP', 
      type: 'fixed', 
      value: 100000, 
      minPurchase: 1000000, 
      startDate: '2024-01-01', 
      endDate: '2024-12-31', 
      usageLimit: 1000, 
      usageCount: 120, 
      status: 'active', 
      products: ['Tất cả'],
      customerTypes: ['VIP']
    },
    { 
      id: '5', 
      code: 'BUY1GET1', 
      name: 'Mua 1 tặng 1', 
      type: 'bogo', 
      value: 100, 
      minPurchase: 0, 
      startDate: '2023-12-01', 
      endDate: '2023-12-31', 
      usageLimit: 300, 
      usageCount: 300, 
      status: 'expired', 
      products: ['Thời trang'],
      customerTypes: ['Tất cả']
    },
    { 
      id: '6', 
      code: 'TECH30', 
      name: 'Giảm 30% thiết bị điện tử', 
      type: 'percentage', 
      value: 30, 
      minPurchase: 1000000, 
      startDate: '2024-02-01', 
      endDate: '2024-02-29', 
      usageLimit: 200, 
      usageCount: 0, 
      status: 'scheduled', 
      products: ['Điện tử'],
      customerTypes: ['Tất cả']
    },
    { 
      id: '7', 
      code: 'WELCOME50', 
      name: 'Giảm 50K cho khách hàng mới', 
      type: 'fixed', 
      value: 50000, 
      minPurchase: 200000, 
      startDate: '2024-01-01', 
      endDate: '2024-12-31', 
      usageLimit: 1000, 
      usageCount: 180, 
      status: 'active', 
      products: ['Tất cả'],
      customerTypes: ['Mới']
    }
  ];

  // Lọc dữ liệu theo các bộ lọc
  const filteredPromotions = promotionsData.filter(promotion => {
    const matchesSearch = 
      promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    const matchesType = typeFilter === 'all' || promotion.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sắp xếp dữ liệu
  const sortedPromotions = [...filteredPromotions].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'code':
        return a.code.localeCompare(b.code);
      case 'start_date':
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case 'end_date':
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      case 'usage':
        return b.usageCount - a.usageCount;
      default:
        return 0;
    }
  });

  // Tính tổng số liệu
  const totalPromotions = filteredPromotions.length;
  const activePromotions = filteredPromotions.filter(p => p.status === 'active').length;
  const scheduledPromotions = filteredPromotions.filter(p => p.status === 'scheduled').length;
  const expiredPromotions = filteredPromotions.filter(p => p.status === 'expired').length;

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm lấy màu cho loại khuyến mãi
  const getPromotionTypeColor = (type: string) => {
    switch(type) {
      case 'percentage':
        return 'bg-blue-100 text-blue-800';
      case 'fixed':
        return 'bg-green-100 text-green-800';
      case 'shipping':
        return 'bg-purple-100 text-purple-800';
      case 'bogo':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho loại khuyến mãi
  const getPromotionTypeText = (type: string) => {
    switch(type) {
      case 'percentage':
        return 'Giảm %';
      case 'fixed':
        return 'Giảm tiền';
      case 'shipping':
        return 'Miễn phí vận chuyển';
      case 'bogo':
        return 'Mua 1 tặng 1';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy màu cho trạng thái khuyến mãi
  const getPromotionStatusColor = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'disabled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho trạng thái khuyến mãi
  const getPromotionStatusText = (status: string) => {
    switch(status) {
      case 'active':
        return 'Đang hoạt động';
      case 'scheduled':
        return 'Lên lịch';
      case 'expired':
        return 'Đã hết hạn';
      case 'disabled':
        return 'Đã tắt';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy icon cho trạng thái khuyến mãi
  const getPromotionStatusIcon = (status: string) => {
    switch(status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'disabled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  // Hàm lấy giá trị hiển thị cho khuyến mãi
  const getPromotionValueText = (promotion: Promotion) => {
    switch(promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed':
        return formatCurrency(promotion.value);
      case 'shipping':
        return 'Miễn phí';
      case 'bogo':
        return 'Mua 1 tặng 1';
      default:
        return '';
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khuyến mãi</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm khuyến mãi
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Tổng số khuyến mãi</p>
                <p className="text-2xl font-bold">{totalPromotions}</p>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-800">
                    {activePromotions} đang hoạt động
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Khuyến mãi sắp tới</p>
                <p className="text-2xl font-bold text-blue-600">{scheduledPromotions}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Đã lên lịch
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Khuyến mãi đã hết hạn</p>
                <p className="text-2xl font-bold text-gray-600">{expiredPromotions}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Trong 30 ngày qua
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Tổng lượt sử dụng</p>
                <p className="text-2xl font-bold">
                  {filteredPromotions.reduce((sum, p) => sum + p.usageCount, 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Lượt sử dụng mã giảm giá
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khuyến mãi..."
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
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="scheduled">Lên lịch</SelectItem>
              <SelectItem value="expired">Đã hết hạn</SelectItem>
              <SelectItem value="disabled">Đã tắt</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Loại khuyến mãi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="percentage">Giảm %</SelectItem>
              <SelectItem value="fixed">Giảm tiền</SelectItem>
              <SelectItem value="shipping">Miễn phí vận chuyển</SelectItem>
              <SelectItem value="bogo">Mua 1 tặng 1</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Tên</SelectItem>
              <SelectItem value="code">Mã</SelectItem>
              <SelectItem value="start_date">Ngày bắt đầu</SelectItem>
              <SelectItem value="end_date">Ngày kết thúc</SelectItem>
              <SelectItem value="usage">Lượt sử dụng</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Promotions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khuyến mãi</CardTitle>
            <CardDescription>
              Quản lý tất cả khuyến mãi của doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã khuyến mãi</TableHead>
                  <TableHead>Tên khuyến mãi</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Lượt sử dụng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">{promotion.code}</TableCell>
                    <TableCell>
                      <div>
                        <p>{promotion.name}</p>
                        <p className="text-xs text-slate-500">
                          Tối thiểu: {formatCurrency(promotion.minPurchase)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPromotionTypeColor(promotion.type)}>
                        {getPromotionTypeText(promotion.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {getPromotionValueText(promotion)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          <span>Từ: {new Date(promotion.startDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          <span>Đến: {new Date(promotion.endDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{promotion.usageCount}/{promotion.usageLimit}</span>
                          <span>{Math.round((promotion.usageCount / promotion.usageLimit) * 100)}%</span>
                        </div>
                        <Progress 
                          value={Math.round((promotion.usageCount / promotion.usageLimit) * 100)} 
                          className="h-2" 
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getPromotionStatusIcon(promotion.status)}
                        <Badge className={getPromotionStatusColor(promotion.status)}>
                          {getPromotionStatusText(promotion.status)}
                        </Badge>
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
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Xem thống kê
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
            {sortedPromotions.length === 0 && (
              <div className="py-8 text-center">
                <Tag className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Không tìm thấy khuyến mãi nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
