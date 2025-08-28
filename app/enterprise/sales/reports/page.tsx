'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  Filter,
  ShoppingBag,
  Users
} from 'lucide-react';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function SalesReportsPage() {
  const [periodFilter, setPeriodFilter] = useState('month');
  const [yearFilter, setYearFilter] = useState('2024');
  const [monthFilter, setMonthFilter] = useState('1');
  const [quarterFilter, setQuarterFilter] = useState('1');
  
  // Dữ liệu mẫu cho báo cáo bán hàng
  const salesData = {
    summary: {
      revenue: 1850000000,
      orders: 750,
      averageOrderValue: 2466667,
      customers: 520,
      previousRevenue: 1650000000,
      previousOrders: 680,
      revenueGrowth: 12.12,
      ordersGrowth: 10.29,
    },
    
    // Dữ liệu cho biểu đồ doanh thu theo tháng
    monthlyRevenue: [
      { month: 'T1', value: 1850000000 },
      { month: 'T2', value: 0 },
      { month: 'T3', value: 0 },
      { month: 'T4', value: 0 },
      { month: 'T5', value: 0 },
      { month: 'T6', value: 0 },
      { month: 'T7', value: 0 },
      { month: 'T8', value: 0 },
      { month: 'T9', value: 0 },
      { month: 'T10', value: 0 },
      { month: 'T11', value: 0 },
      { month: 'T12', value: 0 }
    ],
    
    // Dữ liệu cho biểu đồ doanh thu theo danh mục
    revenueByCategory: [
      { category: 'Điện tử', value: 750000000 },
      { category: 'Thời trang', value: 450000000 },
      { category: 'Đồ gia dụng', value: 350000000 },
      { category: 'Thực phẩm', value: 200000000 },
      { category: 'Khác', value: 100000000 }
    ],
    
    // Dữ liệu cho biểu đồ doanh thu theo kênh bán hàng
    revenueByChannel: [
      { channel: 'Trực tuyến', value: 1100000000 },
      { channel: 'Cửa hàng', value: 550000000 },
      { channel: 'Đại lý', value: 200000000 }
    ],
    
    // Dữ liệu cho top sản phẩm bán chạy
    topSellingProducts: [
      { id: '1', name: 'Điện thoại XYZ', sku: 'SP001', sold: 120, revenue: 240000000 },
      { id: '2', name: 'Laptop ABC', sku: 'SP002', sold: 85, revenue: 425000000 },
      { id: '3', name: 'Tai nghe không dây', sku: 'SP003', sold: 210, revenue: 84000000 },
      { id: '4', name: 'Bàn phím cơ', sku: 'SP004', sold: 95, revenue: 76000000 },
      { id: '5', name: 'Chuột gaming', sku: 'SP005', sold: 150, revenue: 60000000 }
    ],
    
    // Dữ liệu cho top khách hàng
    topCustomers: [
      { id: '1', name: 'Nguyễn Văn A', orders: 12, spent: 35000000, type: 'VIP' },
      { id: '2', name: 'Công ty TNHH XYZ', orders: 8, spent: 120000000, type: 'Doanh nghiệp' },
      { id: '3', name: 'Trần Thị B', orders: 10, spent: 25000000, type: 'VIP' },
      { id: '4', name: 'Lê Văn C', orders: 7, spent: 18000000, type: 'Thường' },
      { id: '5', name: 'Công ty ABC', orders: 5, spent: 85000000, type: 'Doanh nghiệp' }
    ],
    
    // Dữ liệu cho hiệu quả khuyến mãi
    promotionPerformance: [
      { id: '1', code: 'SUMMER2023', name: 'Khuyến mãi hè 2023', uses: 320, revenue: 480000000, discount: 96000000 },
      { id: '2', code: 'NEWYEAR24', name: 'Khuyến mãi đầu năm', uses: 250, revenue: 375000000, discount: 56250000 },
      { id: '3', code: 'FREESHIP', name: 'Miễn phí vận chuyển', uses: 180, revenue: 270000000, discount: 27000000 },
      { id: '4', code: 'VIP100K', name: 'Giảm 100K cho VIP', uses: 120, revenue: 240000000, discount: 12000000 },
      { id: '5', code: 'WELCOME50', name: 'Giảm 50K cho khách hàng mới', uses: 150, revenue: 150000000, discount: 7500000 }
    ]
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm định dạng phần trăm
  const formatPercent = (percent: number) => {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  // Hàm lấy màu cho chỉ số tăng trưởng
  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Hàm lấy icon cho chỉ số tăng trưởng
  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 
      <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-600" />;
  };

  // Hàm lấy tiêu đề báo cáo dựa trên bộ lọc
  const getReportTitle = () => {
    if (periodFilter === 'month') {
      const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                          'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
      return `Báo cáo bán hàng ${monthNames[parseInt(monthFilter) - 1]} năm ${yearFilter}`;
    } else if (periodFilter === 'quarter') {
      return `Báo cáo bán hàng Quý ${quarterFilter} năm ${yearFilter}`;
    } else {
      return `Báo cáo bán hàng năm ${yearFilter}`;
    }
  };

  // Hàm lấy màu cho loại khách hàng
  const getCustomerTypeColor = (type: string) => {
    switch(type) {
      case 'VIP':
        return 'bg-amber-100 text-amber-800';
      case 'Doanh nghiệp':
        return 'bg-blue-100 text-blue-800';
      case 'Thường':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo bán hàng</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Lịch sử báo cáo
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">Lọc báo cáo:</span>
              </div>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Kỳ báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Tháng</SelectItem>
                  <SelectItem value="quarter">Quý</SelectItem>
                  <SelectItem value="year">Năm</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              
              {periodFilter === 'month' && (
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tháng 1</SelectItem>
                    <SelectItem value="2">Tháng 2</SelectItem>
                    <SelectItem value="3">Tháng 3</SelectItem>
                    <SelectItem value="4">Tháng 4</SelectItem>
                    <SelectItem value="5">Tháng 5</SelectItem>
                    <SelectItem value="6">Tháng 6</SelectItem>
                    <SelectItem value="7">Tháng 7</SelectItem>
                    <SelectItem value="8">Tháng 8</SelectItem>
                    <SelectItem value="9">Tháng 9</SelectItem>
                    <SelectItem value="10">Tháng 10</SelectItem>
                    <SelectItem value="11">Tháng 11</SelectItem>
                    <SelectItem value="12">Tháng 12</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {periodFilter === 'quarter' && (
                <Select value={quarterFilter} onValueChange={setQuarterFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Quý" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Quý 1</SelectItem>
                    <SelectItem value="2">Quý 2</SelectItem>
                    <SelectItem value="3">Quý 3</SelectItem>
                    <SelectItem value="4">Quý 4</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Title */}
        <div className="text-center">
          <h2 className="text-xl font-semibold">{getReportTitle()}</h2>
          <p className="text-sm text-slate-500">So sánh với kỳ trước</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-slate-600">Doanh thu</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(salesData.summary.revenueGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(salesData.summary.revenueGrowth)}`}>
                      {formatPercent(salesData.summary.revenueGrowth)}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{formatCurrency(salesData.summary.revenue)}</p>
                <p className="text-xs text-slate-500 mt-1">Kỳ trước: {formatCurrency(salesData.summary.previousRevenue)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium text-slate-600">Đơn hàng</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(salesData.summary.ordersGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(salesData.summary.ordersGrowth)}`}>
                      {formatPercent(salesData.summary.ordersGrowth)}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{salesData.summary.orders.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Kỳ trước: {salesData.summary.previousOrders.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                  <p className="text-sm font-medium text-slate-600">Giá trị đơn trung bình</p>
                </div>
                <p className="text-2xl font-bold mt-2">{formatCurrency(salesData.summary.averageOrderValue)}</p>
                <p className="text-xs text-slate-500 mt-1">Trên mỗi đơn hàng</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-600" />
                  <p className="text-sm font-medium text-slate-600">Khách hàng</p>
                </div>
                <p className="text-2xl font-bold mt-2">{salesData.summary.customers.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Đã mua hàng</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="customers">Khách hàng</TabsTrigger>
            <TabsTrigger value="promotions">Khuyến mãi</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Doanh thu theo tháng</CardTitle>
                  <CardDescription>
                    Biểu đồ doanh thu năm {yearFilter}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ doanh thu theo tháng</p>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Doanh thu theo danh mục</CardTitle>
                  <CardDescription>
                    Phân bổ doanh thu theo danh mục sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ doanh thu theo danh mục</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue by Channel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Doanh thu theo kênh bán hàng</CardTitle>
                <CardDescription>
                  Phân tích doanh thu theo từng kênh bán hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-slate-300" />
                  <p className="text-slate-500 ml-2">Biểu đồ doanh thu theo kênh bán hàng</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Sản phẩm bán chạy</CardTitle>
                <CardDescription>
                  Top sản phẩm bán chạy nhất trong kỳ báo cáo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã SP</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-right">Số lượng bán</TableHead>
                      <TableHead className="text-right">Doanh thu</TableHead>
                      <TableHead className="text-right">% Tổng doanh thu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.topSellingProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{product.sold.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                        <TableCell className="text-right">
                          {((product.revenue / salesData.summary.revenue) * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Khách hàng hàng đầu</CardTitle>
                <CardDescription>
                  Top khách hàng có giá trị đơn hàng cao nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead className="text-right">Số đơn hàng</TableHead>
                      <TableHead className="text-right">Tổng chi tiêu</TableHead>
                      <TableHead className="text-right">% Tổng doanh thu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.topCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          <Badge className={getCustomerTypeColor(customer.type)}>
                            {customer.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{customer.orders}</TableCell>
                        <TableCell className="text-right">{formatCurrency(customer.spent)}</TableCell>
                        <TableCell className="text-right">
                          {((customer.spent / salesData.summary.revenue) * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-4">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Hiệu quả khuyến mãi</CardTitle>
                <CardDescription>
                  Phân tích hiệu quả của các chương trình khuyến mãi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã khuyến mãi</TableHead>
                      <TableHead>Tên khuyến mãi</TableHead>
                      <TableHead className="text-right">Lượt sử dụng</TableHead>
                      <TableHead className="text-right">Doanh thu</TableHead>
                      <TableHead className="text-right">Giảm giá</TableHead>
                      <TableHead className="text-right">Tỷ lệ chuyển đổi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.promotionPerformance.map((promotion) => (
                      <TableRow key={promotion.id}>
                        <TableCell className="font-medium">{promotion.code}</TableCell>
                        <TableCell>{promotion.name}</TableCell>
                        <TableCell className="text-right">{promotion.uses}</TableCell>
                        <TableCell className="text-right">{formatCurrency(promotion.revenue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(promotion.discount)}</TableCell>
                        <TableCell className="text-right">
                          {((promotion.discount / promotion.revenue) * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Tải báo cáo doanh thu
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Tải báo cáo sản phẩm
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Tải báo cáo khách hàng
          </Button>
        </div>
      </div>
    </EnterpriseLayout>
  );
}
