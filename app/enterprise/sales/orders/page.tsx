'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  Calendar, 
  User, 
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
  Truck
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';

// Dữ liệu mẫu cho đơn hàng
const orders = [
  {
    id: 'ORD-001',
    customer: 'Nguyễn Văn A',
    date: '15/05/2023',
    total: 2500000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'Thẻ tín dụng',
    items: [
      { id: 1, name: 'Laptop Dell XPS 13', quantity: 1, price: 25000000, total: 25000000 }
    ],
    shippingAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    note: ''
  },
  {
    id: 'ORD-002',
    customer: 'Trần Thị B',
    date: '14/05/2023',
    total: 1500000,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Chuyển khoản',
    items: [
      { id: 1, name: 'Điện thoại iPhone 13', quantity: 1, price: 20000000, total: 20000000 },
      { id: 2, name: 'Ốp lưng iPhone', quantity: 1, price: 200000, total: 200000 }
    ],
    shippingAddress: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    note: 'Giao hàng ngoài giờ hành chính'
  },
  {
    id: 'ORD-003',
    customer: 'Lê Văn C',
    date: '12/05/2023',
    total: 3000000,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Ví điện tử',
    items: [
      { id: 1, name: 'Màn hình Dell 27"', quantity: 1, price: 5000000, total: 5000000 }
    ],
    shippingAddress: '789 Đường Hai Bà Trưng, Quận 3, TP.HCM',
    note: ''
  },
  {
    id: 'ORD-004',
    customer: 'Phạm Thị D',
    date: '10/05/2023',
    total: 1200000,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'Thẻ tín dụng',
    items: [
      { id: 1, name: 'Bàn phím cơ Logitech', quantity: 1, price: 2000000, total: 2000000 }
    ],
    shippingAddress: '101 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM',
    note: 'Khách hàng hủy đơn'
  },
  {
    id: 'ORD-005',
    customer: 'Hoàng Văn E',
    date: '08/05/2023',
    total: 500000,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'COD',
    items: [
      { id: 1, name: 'Chuột không dây Logitech', quantity: 1, price: 500000, total: 500000 }
    ],
    shippingAddress: '202 Đường Võ Văn Tần, Quận 3, TP.HCM',
    note: ''
  }
];

export default function SalesOrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Lọc đơn hàng
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Hiển thị trạng thái đơn hàng
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Đang xử lý</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-100 text-purple-800">Đang giao</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Hiển thị trạng thái thanh toán
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>;
      case 'refunded':
        return <Badge className="bg-red-100 text-red-800">Đã hoàn tiền</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Hiển thị icon trạng thái đơn hàng
  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  // Tính tổng doanh thu
  const totalRevenue = filteredOrders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  // Tính số đơn hàng theo trạng thái
  const getOrderCountByStatus = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo đơn hàng
          </Button>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tổng đơn</p>
                  <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Doanh thu</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-yellow-600">{getOrderCountByStatus('pending')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Đang giao</p>
                  <p className="text-2xl font-bold text-purple-600">{getOrderCountByStatus('shipped')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hoàn thành</p>
                  <p className="text-2xl font-bold text-green-600">{getOrderCountByStatus('completed')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="shipped">Đang giao</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="yesterday">Hôm qua</SelectItem>
                <SelectItem value="this-week">Tuần này</SelectItem>
                <SelectItem value="this-month">Tháng này</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Tất cả đơn hàng</TabsTrigger>
            <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
            <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
            <TabsTrigger value="shipped">Đang giao</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã đơn</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Khách hàng</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày đặt</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tổng tiền</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Thanh toán</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">{order.id}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{order.customer}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{order.date}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-slate-900 dark:text-white">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {getOrderStatusIcon(order.status)}
                            {getOrderStatusBadge(order.status)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredOrders.length === 0 && (
                <div className="py-8 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy đơn hàng nào</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Báo cáo */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Báo cáo đơn hàng</CardTitle>
                <CardDescription>Tổng quan đơn hàng theo thời gian</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất Excel
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Biểu đồ
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-[16/9] bg-slate-50 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Biểu đồ đơn hàng theo thời gian (Dữ liệu mẫu)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
