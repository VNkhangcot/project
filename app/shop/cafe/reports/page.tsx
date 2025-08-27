'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Calendar, 
  Download, 
  FileText, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  Coffee, 
  Users, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Định nghĩa kiểu dữ liệu
interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface ProductSales {
  name: string;
  quantity: number;
  revenue: number;
  category: string;
}

interface TimeOfDaySales {
  timeRange: string;
  revenue: number;
  orders: number;
}

// Mock data cho báo cáo doanh thu
const mockDailySales: SalesData[] = [
  { date: '15/01/2024', revenue: 2850000, orders: 42, customers: 38 },
  { date: '16/01/2024', revenue: 3120000, orders: 45, customers: 40 },
  { date: '17/01/2024', revenue: 2950000, orders: 43, customers: 39 },
  { date: '18/01/2024', revenue: 3250000, orders: 48, customers: 42 },
  { date: '19/01/2024', revenue: 4150000, orders: 56, customers: 50 },
  { date: '20/01/2024', revenue: 4850000, orders: 62, customers: 58 },
  { date: '21/01/2024', revenue: 4350000, orders: 58, customers: 52 }
];

// Mock data cho sản phẩm bán chạy
const mockTopProducts: ProductSales[] = [
  { name: 'Cà phê sữa', quantity: 145, revenue: 4350000, category: 'Đồ uống' },
  { name: 'Trà đào', quantity: 120, revenue: 4800000, category: 'Đồ uống' },
  { name: 'Bánh flan', quantity: 95, revenue: 2375000, category: 'Bánh ngọt' },
  { name: 'Cà phê đen', quantity: 85, revenue: 2125000, category: 'Đồ uống' },
  { name: 'Trà sữa trân châu', quantity: 78, revenue: 3510000, category: 'Đồ uống' },
  { name: 'Sinh tố xoài', quantity: 65, revenue: 2600000, category: 'Đồ uống' },
  { name: 'Bánh tiramisu', quantity: 52, revenue: 1820000, category: 'Bánh ngọt' },
  { name: 'Mì xào hải sản', quantity: 48, revenue: 3120000, category: 'Đồ ăn' }
];

// Mock data cho doanh thu theo thời gian trong ngày
const mockTimeOfDaySales: TimeOfDaySales[] = [
  { timeRange: '6:00 - 9:00', revenue: 1250000, orders: 25 },
  { timeRange: '9:00 - 12:00', revenue: 1850000, orders: 32 },
  { timeRange: '12:00 - 15:00', revenue: 2350000, orders: 38 },
  { timeRange: '15:00 - 18:00', revenue: 1950000, orders: 35 },
  { timeRange: '18:00 - 21:00', revenue: 2150000, orders: 36 },
  { timeRange: '21:00 - 24:00', revenue: 950000, orders: 18 }
];

export default function CafeReportsPage() {
  const [dateRange, setDateRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');
  const [reportType, setReportType] = useState('sales');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Tính tổng doanh thu
  const totalRevenue = mockDailySales.reduce((sum, day) => sum + day.revenue, 0);
  
  // Tính tổng số đơn hàng
  const totalOrders = mockDailySales.reduce((sum, day) => sum + day.orders, 0);
  
  // Tính tổng số khách hàng
  const totalCustomers = mockDailySales.reduce((sum, day) => sum + day.customers, 0);
  
  // Tính doanh thu trung bình mỗi đơn
  const averageOrderValue = totalRevenue / totalOrders;

  // Tính % tăng trưởng (giả định)
  const revenueGrowth = 12.5;
  const ordersGrowth = 8.3;
  const customersGrowth = 5.7;
  const aovGrowth = 4.2;

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Báo cáo bán hàng
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Phân tích doanh thu và hiệu suất bán hàng của quán cafe
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Chọn thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="yesterday">Hôm qua</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="quarter">Quý này</SelectItem>
                <SelectItem value="year">Năm nay</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <FileText className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Loại báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Doanh thu</SelectItem>
                <SelectItem value="products">Sản phẩm</SelectItem>
                <SelectItem value="customers">Khách hàng</SelectItem>
                <SelectItem value="time">Thời gian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {revenueGrowth > 0 ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>{revenueGrowth}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-sm">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span>{Math.abs(revenueGrowth)}%</span>
                  </div>
                )}
                <span className="text-xs text-slate-500 ml-2">so với kỳ trước</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalOrders}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {ordersGrowth > 0 ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>{ordersGrowth}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-sm">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span>{Math.abs(ordersGrowth)}%</span>
                  </div>
                )}
                <span className="text-xs text-slate-500 ml-2">so với kỳ trước</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Khách hàng</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCustomers}</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {customersGrowth > 0 ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>{customersGrowth}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-sm">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span>{Math.abs(customersGrowth)}%</span>
                  </div>
                )}
                <span className="text-xs text-slate-500 ml-2">so với kỳ trước</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Giá trị đơn TB</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(averageOrderValue)}</p>
                </div>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {aovGrowth > 0 ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>{aovGrowth}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-sm">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span>{Math.abs(aovGrowth)}%</span>
                  </div>
                )}
                <span className="text-xs text-slate-500 ml-2">so với kỳ trước</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="time">Thời gian</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Biểu đồ doanh thu theo ngày */}
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo ngày</CardTitle>
                <CardDescription>
                  Biểu đồ doanh thu 7 ngày gần nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <BarChart className="h-16 w-16 text-slate-300 mx-auto" />
                    <p className="text-slate-500">Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
                    <p className="text-sm text-slate-400">Dữ liệu từ {mockDailySales[0].date} đến {mockDailySales[mockDailySales.length - 1].date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bảng doanh thu theo ngày */}
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo ngày</CardTitle>
                <CardDescription>
                  Chi tiết doanh thu theo từng ngày
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Doanh thu</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Đơn hàng</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Khách hàng</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Giá trị đơn TB</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {mockDailySales.map((day, index) => (
                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                            {day.date}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {formatCurrency(day.revenue)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {day.orders}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {day.customers}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {formatCurrency(day.revenue / day.orders)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-700">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          Tổng cộng
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-slate-900 dark:text-white">
                          {formatCurrency(totalRevenue)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-slate-900 dark:text-white">
                          {totalOrders}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-slate-900 dark:text-white">
                          {totalCustomers}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-slate-900 dark:text-white">
                          {formatCurrency(averageOrderValue)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {/* Biểu đồ sản phẩm bán chạy */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm bán chạy</CardTitle>
                <CardDescription>
                  Phân tích doanh thu theo sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <PieChart className="h-16 w-16 text-slate-300 mx-auto" />
                    <p className="text-slate-500">Biểu đồ sản phẩm bán chạy sẽ được hiển thị ở đây</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bảng sản phẩm bán chạy */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm bán chạy</CardTitle>
                <CardDescription>
                  Chi tiết doanh thu theo từng sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Sản phẩm</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Danh mục</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Số lượng</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Doanh thu</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">% Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {mockTopProducts.map((product, index) => {
                        const percentOfRevenue = (product.revenue / totalRevenue) * 100;
                        return (
                          <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                              {product.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                              {product.category}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                              {product.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                              {formatCurrency(product.revenue)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                              {percentOfRevenue.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time" className="space-y-6">
            {/* Biểu đồ doanh thu theo thời gian trong ngày */}
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo thời gian trong ngày</CardTitle>
                <CardDescription>
                  Phân tích doanh thu theo khung giờ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Clock className="h-16 w-16 text-slate-300 mx-auto" />
                    <p className="text-slate-500">Biểu đồ doanh thu theo thời gian sẽ được hiển thị ở đây</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bảng doanh thu theo thời gian trong ngày */}
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo thời gian trong ngày</CardTitle>
                <CardDescription>
                  Chi tiết doanh thu theo từng khung giờ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Khung giờ</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Doanh thu</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Đơn hàng</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Giá trị đơn TB</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">% Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {mockTimeOfDaySales.map((timeRange, index) => {
                        const percentOfRevenue = (timeRange.revenue / totalRevenue) * 100;
                        return (
                          <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                              {timeRange.timeRange}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                              {formatCurrency(timeRange.revenue)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                              {timeRange.orders}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                              {formatCurrency(timeRange.revenue / timeRange.orders)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                              {percentOfRevenue.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-700">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          Tổng cộng
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-slate-900 dark:text-white">
                          {formatCurrency(mockTimeOfDaySales.reduce((sum, time) => sum + time.revenue, 0))}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-slate-900 dark:text-white">
                          {mockTimeOfDaySales.reduce((sum, time) => sum + time.orders, 0)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-slate-900 dark:text-white">
                          {formatCurrency(
                            mockTimeOfDaySales.reduce((sum, time) => sum + time.revenue, 0) / 
                            mockTimeOfDaySales.reduce((sum, time) => sum + time.orders, 0)
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-slate-900 dark:text-white">
                          100%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
}
