'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Package, 
  Calendar, 
  Download, 
  FileText, 
  Share2, 
  ArrowUpRight, 
  ArrowDownRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';

// Dữ liệu mẫu cho báo cáo doanh thu
const revenueData = {
  total: 1250000000,
  previousPeriod: 1000000000,
  percentChange: 25,
  monthly: [
    { month: 'T1', value: 80000000 },
    { month: 'T2', value: 95000000 },
    { month: 'T3', value: 100000000 },
    { month: 'T4', value: 110000000 },
    { month: 'T5', value: 120000000 },
    { month: 'T6', value: 125000000 },
    { month: 'T7', value: 130000000 },
    { month: 'T8', value: 135000000 },
    { month: 'T9', value: 140000000 },
    { month: 'T10', value: 145000000 },
    { month: 'T11', value: 150000000 },
    { month: 'T12', value: 160000000 }
  ]
};

// Dữ liệu mẫu cho báo cáo đơn hàng
const orderData = {
  total: 1250,
  previousPeriod: 1100,
  percentChange: 13.6,
  status: {
    completed: 850,
    processing: 150,
    shipped: 200,
    cancelled: 50
  }
};

// Dữ liệu mẫu cho báo cáo khách hàng
const customerData = {
  total: 850,
  previousPeriod: 720,
  percentChange: 18.1,
  new: 130,
  returning: 720
};

// Dữ liệu mẫu cho báo cáo sản phẩm
const productData = {
  total: 120,
  topSelling: [
    { name: 'Laptop Dell XPS 13', sold: 45, revenue: 1125000000 },
    { name: 'Điện thoại iPhone 13', sold: 38, revenue: 760000000 },
    { name: 'Màn hình Dell 27"', sold: 30, revenue: 150000000 },
    { name: 'Bàn phím cơ Logitech', sold: 25, revenue: 50000000 },
    { name: 'Chuột không dây Logitech', sold: 20, revenue: 10000000 }
  ],
  lowStock: 8,
  outOfStock: 3
};

export default function ReportsOverviewPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('this-year');

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format phần trăm
  const formatPercent = (percent: number, includeSign = true) => {
    const sign = includeSign ? (percent >= 0 ? '+' : '') : '';
    return `${sign}${percent.toFixed(1)}%`;
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Báo cáo tổng quan</h1>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="yesterday">Hôm qua</SelectItem>
                <SelectItem value="this-week">Tuần này</SelectItem>
                <SelectItem value="last-week">Tuần trước</SelectItem>
                <SelectItem value="this-month">Tháng này</SelectItem>
                <SelectItem value="last-month">Tháng trước</SelectItem>
                <SelectItem value="this-quarter">Quý này</SelectItem>
                <SelectItem value="last-quarter">Quý trước</SelectItem>
                <SelectItem value="this-year">Năm nay</SelectItem>
                <SelectItem value="last-year">Năm trước</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Doanh thu</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(revenueData.total)}</p>
                  <div className="flex items-center mt-1">
                    {revenueData.percentChange >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${revenueData.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(revenueData.percentChange)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">so với kỳ trước</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Đơn hàng</p>
                  <p className="text-2xl font-bold text-slate-900">{orderData.total}</p>
                  <div className="flex items-center mt-1">
                    {orderData.percentChange >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${orderData.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(orderData.percentChange)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">so với kỳ trước</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Khách hàng</p>
                  <p className="text-2xl font-bold text-slate-900">{customerData.total}</p>
                  <div className="flex items-center mt-1">
                    {customerData.percentChange >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${customerData.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(customerData.percentChange)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">so với kỳ trước</span>
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Sản phẩm</p>
                  <p className="text-2xl font-bold text-slate-900">{productData.total}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-yellow-600">
                      {productData.lowStock} sắp hết
                    </span>
                    <span className="text-xs text-slate-500 mx-1">•</span>
                    <span className="text-sm text-red-600">
                      {productData.outOfStock} hết hàng
                    </span>
                  </div>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="sales">Doanh thu</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="customers">Khách hàng</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo tháng</CardTitle>
                  <CardDescription>
                    Biểu đồ doanh thu theo tháng trong năm {new Date().getFullYear()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[16/9] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ doanh thu theo tháng (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng theo trạng thái</CardTitle>
                  <CardDescription>
                    Phân bố đơn hàng theo trạng thái
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[16/9] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ đơn hàng theo trạng thái (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm bán chạy</CardTitle>
                <CardDescription>
                  Top 5 sản phẩm bán chạy nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Sản phẩm</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Đã bán</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Doanh thu</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">% Tổng doanh thu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {productData.topSelling.map((product, index) => (
                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                            {product.sold}
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-slate-900 dark:text-white">
                            {formatCurrency(product.revenue)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                            {((product.revenue / revenueData.total) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo thời gian</CardTitle>
                <CardDescription>
                  Biểu đồ doanh thu theo thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[21/9] bg-slate-50 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Biểu đồ doanh thu theo thời gian (Dữ liệu mẫu)</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo danh mục</CardTitle>
                  <CardDescription>
                    Phân bố doanh thu theo danh mục sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ doanh thu theo danh mục (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo khu vực</CardTitle>
                  <CardDescription>
                    Phân bố doanh thu theo khu vực địa lý
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ doanh thu theo khu vực (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng theo trạng thái</CardTitle>
                  <CardDescription>
                    Phân bố đơn hàng theo trạng thái
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ đơn hàng theo trạng thái (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng theo thời gian</CardTitle>
                  <CardDescription>
                    Số lượng đơn hàng theo thời gian
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ đơn hàng theo thời gian (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
                <CardDescription>
                  Phân bố đơn hàng theo phương thức thanh toán
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/9] bg-slate-50 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Biểu đồ phương thức thanh toán (Dữ liệu mẫu)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Khách hàng mới và quay lại</CardTitle>
                  <CardDescription>
                    Tỷ lệ khách hàng mới và khách hàng quay lại
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ khách hàng mới và quay lại (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Khách hàng theo khu vực</CardTitle>
                  <CardDescription>
                    Phân bố khách hàng theo khu vực địa lý
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ khách hàng theo khu vực (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Giá trị khách hàng</CardTitle>
                <CardDescription>
                  Phân tích giá trị khách hàng theo thời gian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/9] bg-slate-50 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Biểu đồ giá trị khách hàng (Dữ liệu mẫu)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm bán chạy</CardTitle>
                  <CardDescription>
                    Top 10 sản phẩm bán chạy nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ sản phẩm bán chạy (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Danh mục sản phẩm</CardTitle>
                  <CardDescription>
                    Phân bố doanh thu theo danh mục sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ danh mục sản phẩm (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Tồn kho sản phẩm</CardTitle>
                <CardDescription>
                  Tình trạng tồn kho của sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Sản phẩm</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tồn kho</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Đã bán</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">Laptop Dell XPS 13</div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                          15
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                          45
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-800">Còn hàng</Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">Điện thoại iPhone 13</div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                          30
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                          38
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-800">Còn hàng</Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">Màn hình Dell 27"</div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                          0
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                          30
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-red-100 text-red-800">Hết hàng</Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">Bàn phím cơ Logitech</div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                          3
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                          25
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">Chuột không dây Logitech</div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                          25
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                          20
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-800">Còn hàng</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EnterpriseLayout>
  );
}
