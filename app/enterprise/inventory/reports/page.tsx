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
  Package, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  Filter,
  Warehouse
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

export default function InventoryReportsPage() {
  const [periodFilter, setPeriodFilter] = useState('month');
  const [yearFilter, setYearFilter] = useState('2024');
  const [monthFilter, setMonthFilter] = useState('1');
  const [quarterFilter, setQuarterFilter] = useState('1');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  
  // Dữ liệu mẫu cho kho
  const warehouses = [
    { id: 'all', name: 'Tất cả kho' },
    { id: '1', name: 'Kho chính' },
    { id: '2', name: 'Kho chi nhánh 1' },
    { id: '3', name: 'Kho chi nhánh 2' }
  ];
  
  // Dữ liệu mẫu cho báo cáo kho
  const inventoryData = {
    summary: {
      totalProducts: 1250,
      totalValue: 1500000000,
      lowStockItems: 45,
      outOfStockItems: 12,
      previousTotalValue: 1350000000,
      valueGrowth: 11.11,
    },
    
    // Dữ liệu cho biểu đồ giá trị tồn kho theo tháng
    monthlyInventoryValue: [
      { month: 'T1', value: 1500000000 },
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
    
    // Dữ liệu cho biểu đồ giá trị tồn kho theo danh mục
    inventoryByCategory: [
      { category: 'Điện tử', value: 600000000 },
      { category: 'Thời trang', value: 350000000 },
      { category: 'Đồ gia dụng', value: 250000000 },
      { category: 'Thực phẩm', value: 150000000 },
      { category: 'Khác', value: 150000000 }
    ],
    
    // Dữ liệu cho biểu đồ nhập/xuất kho
    inventoryMovement: [
      { month: 'T1', import: 250000000, export: 100000000 },
      { month: 'T2', import: 0, export: 0 },
      { month: 'T3', import: 0, export: 0 },
      { month: 'T4', import: 0, export: 0 },
      { month: 'T5', import: 0, export: 0 },
      { month: 'T6', import: 0, export: 0 },
      { month: 'T7', import: 0, export: 0 },
      { month: 'T8', import: 0, export: 0 },
      { month: 'T9', import: 0, export: 0 },
      { month: 'T10', import: 0, export: 0 },
      { month: 'T11', import: 0, export: 0 },
      { month: 'T12', import: 0, export: 0 }
    ],
    
    // Dữ liệu cho top sản phẩm bán chạy
    topSellingProducts: [
      { id: '1', name: 'Điện thoại XYZ', sku: 'SP001', sold: 120, revenue: 240000000 },
      { id: '2', name: 'Laptop ABC', sku: 'SP002', sold: 85, revenue: 425000000 },
      { id: '3', name: 'Tai nghe không dây', sku: 'SP003', sold: 210, revenue: 84000000 },
      { id: '4', name: 'Bàn phím cơ', sku: 'SP004', sold: 95, revenue: 76000000 },
      { id: '5', name: 'Chuột gaming', sku: 'SP005', sold: 150, revenue: 60000000 }
    ],
    
    // Dữ liệu cho sản phẩm tồn kho lâu
    slowMovingProducts: [
      { id: '1', name: 'Máy in laser', sku: 'SP010', daysInStock: 120, quantity: 15, value: 45000000 },
      { id: '2', name: 'Máy chiếu', sku: 'SP011', daysInStock: 90, quantity: 8, value: 64000000 },
      { id: '3', name: 'Loa bluetooth XYZ', sku: 'SP012', daysInStock: 85, quantity: 25, value: 37500000 },
      { id: '4', name: 'Đồng hồ thông minh', sku: 'SP013', daysInStock: 75, quantity: 20, value: 40000000 },
      { id: '5', name: 'Máy ảnh DSLR', sku: 'SP014', daysInStock: 70, quantity: 5, value: 75000000 }
    ],
    
    // Dữ liệu cho sản phẩm sắp hết hàng
    lowStockProducts: [
      { id: '1', name: 'Điện thoại ABC', sku: 'SP020', quantity: 3, threshold: 10, status: 'low' },
      { id: '2', name: 'Máy tính bảng', sku: 'SP021', quantity: 5, threshold: 15, status: 'low' },
      { id: '3', name: 'Sạc dự phòng', sku: 'SP022', quantity: 0, threshold: 20, status: 'out' },
      { id: '4', name: 'Ốp lưng điện thoại', sku: 'SP023', quantity: 8, threshold: 30, status: 'low' },
      { id: '5', name: 'Cáp sạc USB-C', sku: 'SP024', quantity: 0, threshold: 25, status: 'out' }
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
    const warehouseName = warehouses.find(w => w.id === warehouseFilter)?.name || 'Tất cả kho';
    
    if (periodFilter === 'month') {
      const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                          'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
      return `Báo cáo kho ${warehouseName} - ${monthNames[parseInt(monthFilter) - 1]} năm ${yearFilter}`;
    } else if (periodFilter === 'quarter') {
      return `Báo cáo kho ${warehouseName} - Quý ${quarterFilter} năm ${yearFilter}`;
    } else {
      return `Báo cáo kho ${warehouseName} - Năm ${yearFilter}`;
    }
  };

  // Hàm lấy màu cho trạng thái tồn kho
  const getStockStatusColor = (status: string) => {
    switch(status) {
      case 'low':
        return 'bg-amber-100 text-amber-800';
      case 'out':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho trạng thái tồn kho
  const getStockStatusText = (status: string) => {
    switch(status) {
      case 'low':
        return 'Sắp hết';
      case 'out':
        return 'Hết hàng';
      default:
        return 'Bình thường';
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo kho</h1>
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
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Kho" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
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
                    <Package className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium text-slate-600">Tổng giá trị tồn kho</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(inventoryData.summary.valueGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(inventoryData.summary.valueGrowth)}`}>
                      {formatPercent(inventoryData.summary.valueGrowth)}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{formatCurrency(inventoryData.summary.totalValue)}</p>
                <p className="text-xs text-slate-500 mt-1">Kỳ trước: {formatCurrency(inventoryData.summary.previousTotalValue)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <p className="text-sm font-medium text-slate-600">Tổng số sản phẩm</p>
                </div>
                <p className="text-2xl font-bold mt-2">{inventoryData.summary.totalProducts.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Số lượng sản phẩm trong kho</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-amber-600" />
                  <p className="text-sm font-medium text-slate-600">Sắp hết hàng</p>
                </div>
                <p className="text-2xl font-bold mt-2">{inventoryData.summary.lowStockItems}</p>
                <p className="text-xs text-slate-500 mt-1">Sản phẩm dưới ngưỡng tồn kho</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <p className="text-sm font-medium text-slate-600">Hết hàng</p>
                </div>
                <p className="text-2xl font-bold mt-2">{inventoryData.summary.outOfStockItems}</p>
                <p className="text-xs text-slate-500 mt-1">Sản phẩm đã hết hàng</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="top-products">Sản phẩm bán chạy</TabsTrigger>
            <TabsTrigger value="slow-moving">Tồn kho lâu</TabsTrigger>
            <TabsTrigger value="low-stock">Sắp hết hàng</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Inventory Value Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Giá trị tồn kho theo tháng</CardTitle>
                  <CardDescription>
                    Biểu đồ giá trị tồn kho năm {yearFilter}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ giá trị tồn kho theo tháng</p>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tồn kho theo danh mục</CardTitle>
                  <CardDescription>
                    Phân bổ giá trị tồn kho theo danh mục
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ tồn kho theo danh mục</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inventory Movement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Biến động nhập xuất kho</CardTitle>
                <CardDescription>
                  Biểu đồ giá trị nhập xuất kho theo tháng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-slate-300" />
                  <p className="text-slate-500 ml-2">Biểu đồ nhập xuất kho theo tháng</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Top Products Tab */}
          <TabsContent value="top-products" className="space-y-4">
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.topSellingProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{product.sold.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Slow Moving Tab */}
          <TabsContent value="slow-moving" className="space-y-4">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Sản phẩm tồn kho lâu</CardTitle>
                <CardDescription>
                  Sản phẩm tồn kho lâu ngày cần xử lý
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã SP</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-right">Số ngày tồn</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                      <TableHead className="text-right">Giá trị</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.slowMovingProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{product.daysInStock} ngày</TableCell>
                        <TableCell className="text-right">{product.quantity.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Low Stock Tab */}
          <TabsContent value="low-stock" className="space-y-4">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Sản phẩm sắp hết hàng</CardTitle>
                <CardDescription>
                  Sản phẩm cần nhập thêm hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã SP</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-right">Tồn kho</TableHead>
                      <TableHead className="text-right">Ngưỡng tối thiểu</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.lowStockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{product.quantity.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{product.threshold.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStockStatusColor(product.status)}>
                            {getStockStatusText(product.status)}
                          </Badge>
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
            Tải báo cáo tồn kho
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Tải báo cáo nhập xuất
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Tải báo cáo sản phẩm
          </Button>
        </div>
      </div>
    </EnterpriseLayout>
  );
}
