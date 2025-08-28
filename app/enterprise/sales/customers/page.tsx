'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Download, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag,
  Star,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  status: 'active' | 'inactive';
  type: 'retail' | 'wholesale' | 'vip';
  joinDate: string;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Dữ liệu mẫu cho khách hàng
  const customersData: Customer[] = [
    { 
      id: '1', 
      name: 'Nguyễn Văn A', 
      email: 'nguyenvana@example.com', 
      phone: '0901234567', 
      address: 'Quận 1, TP.HCM', 
      totalOrders: 15, 
      totalSpent: 12500000, 
      lastOrderDate: '2024-01-15', 
      status: 'active', 
      type: 'vip',
      joinDate: '2023-01-10'
    },
    { 
      id: '2', 
      name: 'Trần Thị B', 
      email: 'tranthib@example.com', 
      phone: '0912345678', 
      address: 'Quận 2, TP.HCM', 
      totalOrders: 8, 
      totalSpent: 5800000, 
      lastOrderDate: '2024-01-05', 
      status: 'active', 
      type: 'retail',
      joinDate: '2023-03-15'
    },
    { 
      id: '3', 
      name: 'Lê Văn C', 
      email: 'levanc@example.com', 
      phone: '0923456789', 
      address: 'Quận 3, TP.HCM', 
      totalOrders: 20, 
      totalSpent: 18000000, 
      lastOrderDate: '2024-01-20', 
      status: 'active', 
      type: 'wholesale',
      joinDate: '2022-11-20'
    },
    { 
      id: '4', 
      name: 'Phạm Thị D', 
      email: 'phamthid@example.com', 
      phone: '0934567890', 
      address: 'Quận 4, TP.HCM', 
      totalOrders: 5, 
      totalSpent: 3200000, 
      lastOrderDate: '2023-12-10', 
      status: 'inactive', 
      type: 'retail',
      joinDate: '2023-05-05'
    },
    { 
      id: '5', 
      name: 'Hoàng Văn E', 
      email: 'hoangvane@example.com', 
      phone: '0945678901', 
      address: 'Quận 5, TP.HCM', 
      totalOrders: 12, 
      totalSpent: 9500000, 
      lastOrderDate: '2024-01-18', 
      status: 'active', 
      type: 'retail',
      joinDate: '2023-02-28'
    },
    { 
      id: '6', 
      name: 'Vũ Thị F', 
      email: 'vuthif@example.com', 
      phone: '0956789012', 
      address: 'Quận 6, TP.HCM', 
      totalOrders: 0, 
      totalSpent: 0, 
      lastOrderDate: null, 
      status: 'inactive', 
      type: 'retail',
      joinDate: '2023-12-01'
    },
    { 
      id: '7', 
      name: 'Đặng Văn G', 
      email: 'dangvang@example.com', 
      phone: '0967890123', 
      address: 'Quận 7, TP.HCM', 
      totalOrders: 18, 
      totalSpent: 15000000, 
      lastOrderDate: '2024-01-12', 
      status: 'active', 
      type: 'vip',
      joinDate: '2022-10-15'
    }
  ];

  // Lọc dữ liệu theo các bộ lọc
  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesType = typeFilter === 'all' || customer.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sắp xếp dữ liệu
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'orders':
        return b.totalOrders - a.totalOrders;
      case 'spent':
        return b.totalSpent - a.totalSpent;
      case 'recent':
        if (!a.lastOrderDate) return 1;
        if (!b.lastOrderDate) return -1;
        return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
      case 'join_date':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      default:
        return 0;
    }
  });

  // Tính tổng số liệu
  const totalCustomers = filteredCustomers.length;
  const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length;
  const totalRevenue = filteredCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const totalOrders = filteredCustomers.reduce((sum, customer) => sum + customer.totalOrders, 0);

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm lấy màu cho loại khách hàng
  const getCustomerTypeColor = (type: string) => {
    switch(type) {
      case 'retail':
        return 'bg-blue-100 text-blue-800';
      case 'wholesale':
        return 'bg-purple-100 text-purple-800';
      case 'vip':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho loại khách hàng
  const getCustomerTypeText = (type: string) => {
    switch(type) {
      case 'retail':
        return 'Bán lẻ';
      case 'wholesale':
        return 'Bán sỉ';
      case 'vip':
        return 'VIP';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy màu cho trạng thái khách hàng
  const getCustomerStatusColor = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho trạng thái khách hàng
  const getCustomerStatusText = (status: string) => {
    switch(status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return 'Không xác định';
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm khách hàng
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Tổng số khách hàng</p>
                <p className="text-2xl font-bold">{totalCustomers}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {activeCustomers} khách hàng đang hoạt động
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Từ {totalOrders} đơn hàng
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Doanh thu trung bình</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalCustomers > 0 ? totalRevenue / totalCustomers : 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Trên mỗi khách hàng
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Khách hàng VIP</p>
                <p className="text-2xl font-bold text-amber-600">
                  {filteredCustomers.filter(c => c.type === 'vip').length}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {Math.round((filteredCustomers.filter(c => c.type === 'vip').length / totalCustomers) * 100)}% tổng khách hàng
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
              placeholder="Tìm kiếm khách hàng..."
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
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Loại khách hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="retail">Bán lẻ</SelectItem>
              <SelectItem value="wholesale">Bán sỉ</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Tên</SelectItem>
              <SelectItem value="orders">Số đơn hàng</SelectItem>
              <SelectItem value="spent">Tổng chi tiêu</SelectItem>
              <SelectItem value="recent">Đơn hàng gần nhất</SelectItem>
              <SelectItem value="join_date">Ngày tham gia</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng</CardTitle>
            <CardDescription>
              Quản lý tất cả khách hàng của doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Tổng chi tiêu</TableHead>
                  <TableHead>Đơn hàng gần nhất</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {customer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-slate-500">
                            Tham gia: {new Date(customer.joinDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          <span>{customer.address}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCustomerTypeColor(customer.type)}>
                        {getCustomerTypeText(customer.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4 text-slate-400" />
                        <span>{customer.totalOrders}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell>
                      {customer.lastOrderDate 
                        ? new Date(customer.lastOrderDate).toLocaleDateString('vi-VN') 
                        : 'Chưa có đơn hàng'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getCustomerStatusColor(customer.status)}>
                        {getCustomerStatusText(customer.status)}
                      </Badge>
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
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Xem đơn hàng
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
            {sortedCustomers.length === 0 && (
              <div className="py-8 text-center">
                <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Không tìm thấy khách hàng nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
