'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Store, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';

// Mock data cho sales
const mockSales = [
  {
    id: 'HD001',
    date: '2024-01-15',
    time: '14:30',
    customer: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    items: [
      { name: 'iPhone 15 Pro', quantity: 1, price: 29990000, total: 29990000 },
      { name: 'AirPods Pro', quantity: 1, price: 6990000, total: 6990000 }
    ],
    subtotal: 36980000,
    discount: 5,
    discountAmount: 1849000,
    total: 35131000,
    paymentMethod: 'card',
    status: 'completed',
    cashier: 'Trần Thị B'
  },
  {
    id: 'HD002',
    date: '2024-01-15',
    time: '13:15',
    customer: 'Lê Văn C',
    customerPhone: '0912345678',
    items: [
      { name: 'Samsung Galaxy S24', quantity: 1, price: 22990000, total: 22990000 }
    ],
    subtotal: 22990000,
    discount: 0,
    discountAmount: 0,
    total: 22990000,
    paymentMethod: 'cash',
    status: 'completed',
    cashier: 'Trần Thị B'
  },
  {
    id: 'HD003',
    date: '2024-01-15',
    time: '12:45',
    customer: 'Phạm Thị D',
    customerPhone: '0923456789',
    items: [
      { name: 'iPad Pro 12.9"', quantity: 1, price: 28990000, total: 28990000 },
      { name: 'Apple Watch Series 9', quantity: 1, price: 9990000, total: 9990000 }
    ],
    subtotal: 38980000,
    discount: 10,
    discountAmount: 3898000,
    total: 35082000,
    paymentMethod: 'transfer',
    status: 'completed',
    cashier: 'Nguyễn Văn E'
  },
  {
    id: 'HD004',
    date: '2024-01-15',
    time: '11:20',
    customer: 'Hoàng Văn F',
    customerPhone: '0934567890',
    items: [
      { name: 'MacBook Air M3', quantity: 1, price: 34990000, total: 34990000 }
    ],
    subtotal: 34990000,
    discount: 3,
    discountAmount: 1049700,
    total: 33940300,
    paymentMethod: 'card',
    status: 'completed',
    cashier: 'Trần Thị B'
  },
  {
    id: 'HD005',
    date: '2024-01-14',
    time: '16:30',
    customer: 'Vũ Thị G',
    customerPhone: '0945678901',
    items: [
      { name: 'AirPods Pro', quantity: 2, price: 6990000, total: 13980000 }
    ],
    subtotal: 13980000,
    discount: 0,
    discountAmount: 0,
    total: 13980000,
    paymentMethod: 'cash',
    status: 'refunded',
    cashier: 'Nguyễn Văn E'
  }
];

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedSale, setSelectedSale] = useState<any>(null);

  const filteredSales = mockSales.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.customerPhone.includes(searchQuery);
    const matchesStatus = selectedStatus === 'all' || sale.status === selectedStatus;
    const matchesPayment = selectedPayment === 'all' || sale.paymentMethod === selectedPayment;
    
    // Filter by date
    let matchesDate = true;
    if (selectedDate === 'today') {
      matchesDate = sale.date === '2024-01-15';
    } else if (selectedDate === 'yesterday') {
      matchesDate = sale.date === '2024-01-14';
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>;
      case 'refunded':
        return <Badge className="bg-red-100 text-red-800">Đã hoàn trả</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Tiền mặt';
      case 'card':
        return 'Thẻ';
      case 'transfer':
        return 'Chuyển khoản';
      default:
        return method;
    }
  };

  // Calculate stats
  const todaySales = mockSales.filter(sale => sale.date === '2024-01-15' && sale.status === 'completed');
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const todayOrders = todaySales.length;
  const avgOrderValue = todayOrders > 0 ? todayRevenue / todayOrders : 0;
  const totalCustomers = new Set(mockSales.map(sale => sale.customerPhone)).size;

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Quản lý bán hàng
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Theo dõi và quản lý các giao dịch bán hàng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(todayRevenue)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Doanh thu hôm nay
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {todayOrders}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đơn hàng hôm nay
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(avgOrderValue)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Trung bình/đơn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {totalCustomers}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Khách hàng
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm kiếm theo mã HD, tên KH, SĐT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hôm nay</SelectItem>
                    <SelectItem value="yesterday">Hôm qua</SelectItem>
                    <SelectItem value="week">Tuần này</SelectItem>
                    <SelectItem value="month">Tháng này</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="pending">Đang xử lý</SelectItem>
                    <SelectItem value="refunded">Đã hoàn trả</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả PT</SelectItem>
                    <SelectItem value="cash">Tiền mặt</SelectItem>
                    <SelectItem value="card">Thẻ</SelectItem>
                    <SelectItem value="transfer">Chuyển khoản</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Làm mới
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách giao dịch</CardTitle>
            <CardDescription>
              Hiển thị {filteredSales.length} giao dịch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã HD</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead>Thu ngân</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono font-medium">{sale.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.date}</p>
                          <p className="text-sm text-slate-500">{sale.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.customer}</p>
                          <p className="text-sm text-slate-500">{sale.customerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.items.length} sản phẩm</p>
                          <p className="text-sm text-slate-500">
                            {sale.items[0]?.name}
                            {sale.items.length > 1 && ` +${sale.items.length - 1} khác`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-green-600">{formatCurrency(sale.total)}</p>
                          {sale.discount > 0 && (
                            <p className="text-sm text-slate-500">
                              Giảm {sale.discount}%
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentMethodText(sale.paymentMethod)}</TableCell>
                      <TableCell className="text-sm">{sale.cashier}</TableCell>
                      <TableCell>{getStatusBadge(sale.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedSale(sale)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Chi tiết hóa đơn {selectedSale?.id}</DialogTitle>
                              <DialogDescription>
                                Thông tin chi tiết về giao dịch
                              </DialogDescription>
                            </DialogHeader>
                            {selectedSale && (
                              <div className="space-y-6">
                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-slate-600">Khách hàng</label>
                                    <p className="font-medium">{selectedSale.customer}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-slate-600">Số điện thoại</label>
                                    <p>{selectedSale.customerPhone}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-slate-600">Ngày giờ</label>
                                    <p>{selectedSale.date} {selectedSale.time}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-slate-600">Thu ngân</label>
                                    <p>{selectedSale.cashier}</p>
                                  </div>
                                </div>

                                {/* Items */}
                                <div>
                                  <label className="text-sm font-medium text-slate-600 mb-2 block">Sản phẩm</label>
                                  <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Sản phẩm</TableHead>
                                          <TableHead>SL</TableHead>
                                          <TableHead>Đơn giá</TableHead>
                                          <TableHead>Thành tiền</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedSale.items.map((item: any, index: number) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{formatCurrency(item.price)}</TableCell>
                                            <TableCell>{formatCurrency(item.total)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>

                                {/* Totals */}
                                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                                  <div className="flex justify-between">
                                    <span>Tạm tính:</span>
                                    <span>{formatCurrency(selectedSale.subtotal)}</span>
                                  </div>
                                  {selectedSale.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                      <span>Giảm giá ({selectedSale.discount}%):</span>
                                      <span>-{formatCurrency(selectedSale.discountAmount)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Tổng cộng:</span>
                                    <span>{formatCurrency(selectedSale.total)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Phương thức thanh toán:</span>
                                    <span>{getPaymentMethodText(selectedSale.paymentMethod)}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Báo cáo bán hàng</h3>
              <p className="text-sm text-slate-600 mb-4">
                Xem báo cáo chi tiết về doanh số
              </p>
              <Button className="w-full">
                Xem báo cáo
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <RefreshCw className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Hoàn trả</h3>
              <p className="text-sm text-slate-600 mb-4">
                Xử lý hoàn trả sản phẩm
              </p>
              <Button variant="outline" className="w-full">
                Hoàn trả
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Xuất dữ liệu</h3>
              <p className="text-sm text-slate-600 mb-4">
                Xuất dữ liệu bán hàng ra Excel
              </p>
              <Button variant="outline" className="w-full">
                Xuất Excel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}
