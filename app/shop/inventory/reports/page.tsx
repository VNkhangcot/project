'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BarChart, 
  Search, 
  Download, 
  Calendar, 
  Filter, 
  FileText,
  ChevronLeft,
  ChevronRight,
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  ArrowUpDown
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Định nghĩa kiểu dữ liệu
interface InventoryReport {
  id: string;
  name: string;
  type: 'stock_level' | 'movement' | 'valuation' | 'expiry' | 'discrepancy';
  date: string;
  period: string;
  format: 'pdf' | 'excel' | 'csv';
  createdBy: string;
  size: string;
}

interface StockLevel {
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  status: 'normal' | 'low' | 'out_of_stock' | 'overstock';
  value: number;
}

// Mock data cho báo cáo
const mockReports: InventoryReport[] = [
  {
    id: 'REP-001',
    name: 'Báo cáo tồn kho tháng 1/2024',
    type: 'stock_level',
    date: '31/01/2024',
    period: 'Tháng 1/2024',
    format: 'pdf',
    createdBy: 'Nguyễn Văn A',
    size: '1.2 MB'
  },
  {
    id: 'REP-002',
    name: 'Báo cáo nhập xuất tồn tháng 1/2024',
    type: 'movement',
    date: '31/01/2024',
    period: 'Tháng 1/2024',
    format: 'excel',
    createdBy: 'Trần Thị B',
    size: '2.5 MB'
  },
  {
    id: 'REP-003',
    name: 'Báo cáo giá trị tồn kho Q4/2023',
    type: 'valuation',
    date: '31/12/2023',
    period: 'Q4/2023',
    format: 'pdf',
    createdBy: 'Nguyễn Văn A',
    size: '1.8 MB'
  },
  {
    id: 'REP-004',
    name: 'Báo cáo hàng sắp hết hạn',
    type: 'expiry',
    date: '15/01/2024',
    period: 'Tháng 1/2024',
    format: 'excel',
    createdBy: 'Lê Văn C',
    size: '1.1 MB'
  },
  {
    id: 'REP-005',
    name: 'Báo cáo chênh lệch kiểm kê tháng 12/2023',
    type: 'discrepancy',
    date: '31/12/2023',
    period: 'Tháng 12/2023',
    format: 'pdf',
    createdBy: 'Phạm Thị D',
    size: '0.9 MB'
  }
];

const mockStockLevels: StockLevel[] = [
  {
    productId: 'PRD-001',
    productName: 'Sản phẩm A',
    category: 'Điện tử',
    currentStock: 83,
    minStock: 50,
    maxStock: 200,
    reorderPoint: 70,
    status: 'normal',
    value: 8300000
  },
  {
    productId: 'PRD-002',
    productName: 'Sản phẩm B',
    category: 'Thời trang',
    currentStock: 190,
    minStock: 100,
    maxStock: 300,
    reorderPoint: 150,
    status: 'normal',
    value: 9500000
  },
  {
    productId: 'PRD-003',
    productName: 'Sản phẩm C',
    category: 'Đồ gia dụng',
    currentStock: 45,
    minStock: 50,
    maxStock: 200,
    reorderPoint: 70,
    status: 'low',
    value: 2250000
  },
  {
    productId: 'PRD-004',
    productName: 'Sản phẩm D',
    category: 'Thực phẩm',
    currentStock: 0,
    minStock: 50,
    maxStock: 300,
    reorderPoint: 100,
    status: 'out_of_stock',
    value: 0
  },
  {
    productId: 'PRD-005',
    productName: 'Sản phẩm E',
    category: 'Điện tử',
    currentStock: 250,
    minStock: 50,
    maxStock: 200,
    reorderPoint: 70,
    status: 'overstock',
    value: 12500000
  }
];

export default function InventoryReportsPage() {
  const [reports, setReports] = useState<InventoryReport[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('reports');
  const itemsPerPage = 10;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'stock_level':
        return 'Tồn kho';
      case 'movement':
        return 'Nhập xuất tồn';
      case 'valuation':
        return 'Giá trị tồn kho';
      case 'expiry':
        return 'Hàng sắp hết hạn';
      case 'discrepancy':
        return 'Chênh lệch kiểm kê';
      default:
        return 'Không xác định';
    }
  };

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case 'stock_level':
        return <Badge className="bg-blue-100 text-blue-800">Tồn kho</Badge>;
      case 'movement':
        return <Badge className="bg-green-100 text-green-800">Nhập xuất tồn</Badge>;
      case 'valuation':
        return <Badge className="bg-purple-100 text-purple-800">Giá trị tồn kho</Badge>;
      case 'expiry':
        return <Badge className="bg-orange-100 text-orange-800">Hàng sắp hết hạn</Badge>;
      case 'discrepancy':
        return <Badge className="bg-red-100 text-red-800">Chênh lệch kiểm kê</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge className="bg-green-100 text-green-800">Bình thường</Badge>;
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-100 text-red-800">Hết hàng</Badge>;
      case 'overstock':
        return <Badge className="bg-blue-100 text-blue-800">Dư thừa</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesPeriod = periodFilter === 'all' || report.period.includes(periodFilter);
    
    return matchesSearch && matchesType && matchesPeriod;
  });

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // Calculate stats
  const totalReports = reports.length;
  const totalStockValue = mockStockLevels.reduce((sum, item) => sum + item.value, 0);
  const lowStockItems = mockStockLevels.filter(item => item.status === 'low' || item.status === 'out_of_stock').length;
  const overstockItems = mockStockLevels.filter(item => item.status === 'overstock').length;

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Báo cáo kho
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Xem và tạo báo cáo về tình trạng kho hàng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng báo cáo</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalReports}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Giá trị tồn kho</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalStockValue)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Hàng sắp hết/hết hàng</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{lowStockItems}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Hàng dư thừa</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{overstockItems}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reports" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="reports">Danh sách báo cáo</TabsTrigger>
            <TabsTrigger value="stock_levels">Tồn kho hiện tại</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm báo cáo theo tên, mã..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Loại báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="stock_level">Tồn kho</SelectItem>
                    <SelectItem value="movement">Nhập xuất tồn</SelectItem>
                    <SelectItem value="valuation">Giá trị tồn kho</SelectItem>
                    <SelectItem value="expiry">Hàng sắp hết hạn</SelectItem>
                    <SelectItem value="discrepancy">Chênh lệch kiểm kê</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Tạo báo cáo mới
                </Button>
              </div>
            </div>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách báo cáo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã báo cáo</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tên báo cáo</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Loại</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Kỳ báo cáo</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày tạo</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Định dạng</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {paginatedReports.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                            {item.id}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {item.name}
                          </td>
                          <td className="px-4 py-3">
                            {getReportTypeBadge(item.type)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {item.period}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {item.date}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className="uppercase">{item.format}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Tải xuống
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredReports.length === 0 && (
                    <div className="py-8 text-center">
                      <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500 dark:text-slate-400">Không tìm thấy báo cáo nào</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Levels Tab */}
          <TabsContent value="stock_levels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tồn kho hiện tại</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã SP</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tên sản phẩm</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Danh mục</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tồn kho</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Giá trị</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {mockStockLevels.map((item) => (
                        <tr key={item.productId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                            {item.productId}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {item.productName}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {item.category}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                            {item.currentStock}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                            {formatCurrency(item.value)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {getStockStatusBadge(item.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích kho hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <PieChart className="h-16 w-16 mx-auto text-slate-300 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Biểu đồ phân tích</h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Biểu đồ phân tích sẽ được hiển thị ở đây
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
}
