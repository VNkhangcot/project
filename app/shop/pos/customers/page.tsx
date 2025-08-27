'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Định nghĩa kiểu dữ liệu
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  joinDate: string;
  totalSpent: number;
  orderCount: number;
  status: 'active' | 'inactive';
  type: 'retail' | 'wholesale' | 'vip';
  lastPurchase?: string;
  notes?: string;
}

// Mock data cho khách hàng
const mockCustomers: Customer[] = [
  {
    id: 'CUS-001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    joinDate: '15/01/2023',
    totalSpent: 5850000,
    orderCount: 12,
    status: 'active',
    type: 'vip',
    lastPurchase: '15/01/2024',
    notes: 'Khách hàng thân thiết, thích sản phẩm cao cấp'
  },
  {
    id: 'CUS-002',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0909876543',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    joinDate: '20/02/2023',
    totalSpent: 2450000,
    orderCount: 5,
    status: 'active',
    type: 'retail',
    lastPurchase: '10/01/2024'
  },
  {
    id: 'CUS-003',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0912345678',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    joinDate: '05/03/2023',
    totalSpent: 8750000,
    orderCount: 8,
    status: 'active',
    type: 'wholesale',
    lastPurchase: '05/01/2024',
    notes: 'Đại lý phân phối khu vực Quận 3'
  },
  {
    id: 'CUS-004',
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    phone: '0987654321',
    address: '101 Đường GHI, Quận 4, TP.HCM',
    joinDate: '10/04/2023',
    totalSpent: 1200000,
    orderCount: 3,
    status: 'inactive',
    type: 'retail',
    lastPurchase: '15/11/2023'
  },
  {
    id: 'CUS-005',
    name: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    phone: '0923456789',
    address: '202 Đường JKL, Quận 5, TP.HCM',
    joinDate: '15/05/2023',
    totalSpent: 4500000,
    orderCount: 7,
    status: 'active',
    type: 'vip',
    lastPurchase: '12/01/2024'
  }
];

// Mock data cho đơn hàng gần đây
const mockRecentOrders = [
  {
    id: 'ORD-001',
    date: '15/01/2024',
    total: 850000,
    status: 'completed',
    items: 3
  },
  {
    id: 'ORD-002',
    date: '10/01/2024',
    total: 1200000,
    status: 'completed',
    items: 5
  },
  {
    id: 'ORD-003',
    date: '05/01/2024',
    total: 750000,
    status: 'completed',
    items: 2
  }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('info');
  const itemsPerPage = 10;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-slate-100 text-slate-800">Không hoạt động</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'retail':
        return <Badge className="bg-blue-100 text-blue-800">Bán lẻ</Badge>;
      case 'wholesale':
        return <Badge className="bg-purple-100 text-purple-800">Bán sỉ</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-100 text-yellow-800">VIP</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesType = typeFilter === 'all' || customer.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Calculate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const vipCustomers = customers.filter(c => c.type === 'vip').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Khách hàng
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý thông tin khách hàng và lịch sử mua hàng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng khách hàng</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalCustomers}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Khách hàng hoạt động</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeCustomers}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Khách hàng VIP</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{vipCustomers}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm khách hàng theo tên, email, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <select
              className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả loại</option>
              <option value="retail">Bán lẻ</option>
              <option value="wholesale">Bán sỉ</option>
              <option value="vip">VIP</option>
            </select>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </Button>
          </div>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Khách hàng</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Liên hệ</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày tham gia</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tổng chi tiêu</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Loại</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {paginatedCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{customer.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {customer.joinDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                        {formatCurrency(customer.totalSpent)}
                        <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                          {customer.orderCount} đơn hàng
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getTypeBadge(customer.type)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(customer.status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedCustomer(customer);
                              setShowCustomerDialog(true);
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCustomers.length === 0 && (
                <div className="py-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy khách hàng nào</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} trong số {filteredCustomers.length} khách hàng
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Detail Dialog */}
        {selectedCustomer && (
          <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Chi tiết khách hàng</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết và lịch sử mua hàng của khách hàng
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Customer Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">{getInitials(selectedCustomer.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getTypeBadge(selectedCustomer.type)}
                        {getStatusBadge(selectedCustomer.status)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Mã khách hàng</p>
                    <p className="font-medium">{selectedCustomer.id}</p>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Thông tin liên hệ</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-slate-400" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-slate-400" />
                          <span>{selectedCustomer.phone}</span>
                        </div>
                        {selectedCustomer.address && (
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-slate-400 mt-0.5" />
                            <span>{selectedCustomer.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedCustomer.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Ghi chú</h4>
                        <p className="text-sm">{selectedCustomer.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Thông tin khách hàng</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Ngày tham gia:</span>
                          <span>{selectedCustomer.joinDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Tổng chi tiêu:</span>
                          <span className="font-medium">{formatCurrency(selectedCustomer.totalSpent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Số đơn hàng:</span>
                          <span>{selectedCustomer.orderCount}</span>
                        </div>
                        {selectedCustomer.lastPurchase && (
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Mua hàng gần nhất:</span>
                            <span>{selectedCustomer.lastPurchase}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Orders */}
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Đơn hàng gần đây</h4>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-700">
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Mã đơn hàng</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Ngày</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Tổng tiền</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {mockRecentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-2 text-sm font-medium">{order.id}</td>
                            <td className="px-4 py-2 text-sm">{order.date}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(order.total)}</td>
                            <td className="px-4 py-2 text-center">
                              <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
                  Đóng
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </UserLayout>
  );
}
