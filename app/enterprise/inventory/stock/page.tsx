'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Warehouse, 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Package, 
  AlertTriangle, 
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  BarChart3,
  ShoppingCart,
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

// Dữ liệu mẫu cho sản phẩm trong kho
const products = [
  {
    id: 1,
    code: 'SP001',
    name: 'Laptop Dell XPS 13',
    category: 'Điện tử',
    quantity: 15,
    minQuantity: 5,
    unit: 'Chiếc',
    price: 25000000,
    location: 'Kho A - Kệ 1',
    status: 'in_stock'
  },
  {
    id: 2,
    code: 'SP002',
    name: 'Điện thoại iPhone 13',
    category: 'Điện tử',
    quantity: 30,
    minQuantity: 10,
    unit: 'Chiếc',
    price: 20000000,
    location: 'Kho A - Kệ 2',
    status: 'in_stock'
  },
  {
    id: 3,
    code: 'SP003',
    name: 'Bàn làm việc',
    category: 'Nội thất',
    quantity: 8,
    minQuantity: 5,
    unit: 'Chiếc',
    price: 3000000,
    location: 'Kho B - Kệ 1',
    status: 'in_stock'
  },
  {
    id: 4,
    code: 'SP004',
    name: 'Ghế văn phòng',
    category: 'Nội thất',
    quantity: 12,
    minQuantity: 8,
    unit: 'Chiếc',
    price: 1500000,
    location: 'Kho B - Kệ 2',
    status: 'in_stock'
  },
  {
    id: 5,
    code: 'SP005',
    name: 'Máy in HP LaserJet',
    category: 'Điện tử',
    quantity: 3,
    minQuantity: 5,
    unit: 'Chiếc',
    price: 4500000,
    location: 'Kho A - Kệ 3',
    status: 'low_stock'
  },
  {
    id: 6,
    code: 'SP006',
    name: 'Màn hình Dell 27"',
    category: 'Điện tử',
    quantity: 0,
    minQuantity: 3,
    unit: 'Chiếc',
    price: 5000000,
    location: 'Kho A - Kệ 3',
    status: 'out_of_stock'
  },
  {
    id: 7,
    code: 'SP007',
    name: 'Bàn phím cơ Logitech',
    category: 'Điện tử',
    quantity: 20,
    minQuantity: 5,
    unit: 'Chiếc',
    price: 2000000,
    location: 'Kho A - Kệ 4',
    status: 'in_stock'
  },
  {
    id: 8,
    code: 'SP008',
    name: 'Chuột không dây Logitech',
    category: 'Điện tử',
    quantity: 25,
    minQuantity: 10,
    unit: 'Chiếc',
    price: 500000,
    location: 'Kho A - Kệ 4',
    status: 'in_stock'
  }
];

// Dữ liệu mẫu cho kho
const warehouses = [
  {
    id: 1,
    name: 'Kho A',
    location: 'Hồ Chí Minh',
    capacity: '500m²',
    usedCapacity: '350m²',
    productCount: 5,
    totalValue: 350000000
  },
  {
    id: 2,
    name: 'Kho B',
    location: 'Hà Nội',
    capacity: '300m²',
    usedCapacity: '150m²',
    productCount: 3,
    totalValue: 120000000
  },
  {
    id: 3,
    name: 'Kho C',
    location: 'Đà Nẵng',
    capacity: '200m²',
    usedCapacity: '100m²',
    productCount: 0,
    totalValue: 0
  }
];

// Dữ liệu mẫu cho lịch sử nhập xuất kho
const inventoryHistory = [
  {
    id: 1,
    date: '15/05/2023',
    type: 'import',
    productCode: 'SP001',
    productName: 'Laptop Dell XPS 13',
    quantity: 5,
    warehouse: 'Kho A',
    reference: 'PO-2023-001',
    user: 'Nguyễn Văn A'
  },
  {
    id: 2,
    date: '14/05/2023',
    type: 'export',
    productCode: 'SP002',
    productName: 'Điện thoại iPhone 13',
    quantity: 2,
    warehouse: 'Kho A',
    reference: 'SO-2023-001',
    user: 'Trần Thị B'
  },
  {
    id: 3,
    date: '12/05/2023',
    type: 'import',
    productCode: 'SP003',
    productName: 'Bàn làm việc',
    quantity: 3,
    warehouse: 'Kho B',
    reference: 'PO-2023-002',
    user: 'Nguyễn Văn A'
  },
  {
    id: 4,
    date: '10/05/2023',
    type: 'export',
    productCode: 'SP001',
    productName: 'Laptop Dell XPS 13',
    quantity: 1,
    warehouse: 'Kho A',
    reference: 'SO-2023-002',
    user: 'Lê Văn C'
  },
  {
    id: 5,
    date: '08/05/2023',
    type: 'import',
    productCode: 'SP007',
    productName: 'Bàn phím cơ Logitech',
    quantity: 10,
    warehouse: 'Kho A',
    reference: 'PO-2023-003',
    user: 'Nguyễn Văn A'
  }
];

export default function InventoryStockPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  // Lọc sản phẩm
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Hiển thị trạng thái sản phẩm
  const getProductStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-green-100 text-green-800">Còn hàng</Badge>;
      case 'low_stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-100 text-red-800">Hết hàng</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Hiển thị loại giao dịch
  const getTransactionTypeBadge = (type: string) => {
    switch (type) {
      case 'import':
        return <Badge className="bg-green-100 text-green-800">Nhập kho</Badge>;
      case 'export':
        return <Badge className="bg-blue-100 text-blue-800">Xuất kho</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Tính tổng giá trị kho
  const totalInventoryValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  // Tính số lượng sản phẩm sắp hết hàng
  const lowStockCount = products.filter(product => product.status === 'low_stock').length;

  // Tính số lượng sản phẩm hết hàng
  const outOfStockCount = products.filter(product => product.status === 'out_of_stock').length;

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Warehouse className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Quản lý kho hàng</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Nhập kho
            </Button>
            <Button variant="outline">
              <Truck className="h-4 w-4 mr-2" />
              Xuất kho
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tổng sản phẩm</p>
                  <p className="text-2xl font-bold text-slate-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Warehouse className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Giá trị kho</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalInventoryValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sắp hết hàng</p>
                  <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hết hàng</p>
                  <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
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
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Điện tử">Điện tử</SelectItem>
                <SelectItem value="Nội thất">Nội thất</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="in_stock">Còn hàng</SelectItem>
                <SelectItem value="low_stock">Sắp hết</SelectItem>
                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Kho A">Kho A</SelectItem>
                <SelectItem value="Kho B">Kho B</SelectItem>
                <SelectItem value="Kho C">Kho C</SelectItem>
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
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="warehouses">Kho hàng</TabsTrigger>
            <TabsTrigger value="history">Lịch sử nhập xuất</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã SP</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tên sản phẩm</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Danh mục</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Số lượng</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Đơn vị</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Đơn giá</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Vị trí</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {product.code}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {product.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          <span className={
                            product.quantity === 0 ? 'text-red-600' : 
                            product.quantity < product.minQuantity ? 'text-yellow-600' : 
                            'text-slate-900 dark:text-white'
                          }>
                            {product.quantity}
                          </span>
                          {product.quantity < product.minQuantity && product.quantity > 0 && (
                            <span className="text-xs text-yellow-600 ml-1">
                              (Min: {product.minQuantity})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {product.unit}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {product.location}
                        </td>
                        <td className="px-4 py-3">
                          {getProductStatusBadge(product.status)}
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
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="py-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy sản phẩm nào</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="warehouses" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {warehouses.map((warehouse) => (
                <Card key={warehouse.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{warehouse.name}</CardTitle>
                    <CardDescription>{warehouse.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Dung lượng:</span>
                        <span className="text-sm font-medium">{warehouse.capacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Đã sử dụng:</span>
                        <span className="text-sm font-medium">{warehouse.usedCapacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Số sản phẩm:</span>
                        <span className="text-sm font-medium">{warehouse.productCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Tổng giá trị:</span>
                        <span className="text-sm font-medium text-green-600">{formatCurrency(warehouse.totalValue)}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <div className="bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full" 
                            style={{ width: `${parseInt(warehouse.usedCapacity) / parseInt(warehouse.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-slate-500">Sử dụng</span>
                          <span className="text-xs text-slate-500">
                            {Math.round(parseInt(warehouse.usedCapacity) / parseInt(warehouse.capacity) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex space-x-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Chi tiết
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              <Card className="border-dashed flex items-center justify-center h-[250px]">
                <Button variant="outline" className="flex flex-col h-32 w-32 items-center justify-center rounded-md border border-dashed">
                  <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-muted-foreground">Thêm kho mới</span>
                </Button>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Loại</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã SP</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tên sản phẩm</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Số lượng</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Kho</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tham chiếu</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Người thực hiện</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {inventoryHistory.map((history) => (
                      <tr key={history.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {history.date}
                        </td>
                        <td className="px-4 py-3">
                          {getTransactionTypeBadge(history.type)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {history.productCode}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          {history.productName}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          <span className={history.type === 'import' ? 'text-green-600' : 'text-blue-600'}>
                            {history.type === 'import' ? '+' : '-'}{history.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {history.warehouse}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {history.reference}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {history.user}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {inventoryHistory.length === 0 && (
                <div className="py-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không có lịch sử nhập xuất kho</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Phân tích tồn kho</CardTitle>
                  <CardDescription>
                    Phân tích giá trị tồn kho theo danh mục
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ phân tích tồn kho (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Xu hướng nhập xuất</CardTitle>
                  <CardDescription>
                    Xu hướng nhập xuất kho trong 6 tháng gần nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ xu hướng nhập xuất (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Báo cáo tồn kho</CardTitle>
                    <CardDescription>Báo cáo chi tiết tồn kho theo kho hàng</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Xuất Excel
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Kho A</h3>
                      <p className="text-sm text-slate-600">Hồ Chí Minh</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">5 sản phẩm</p>
                      <p className="text-sm text-green-600">{formatCurrency(350000000)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Kho B</h3>
                      <p className="text-sm text-slate-600">Hà Nội</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">3 sản phẩm</p>
                      <p className="text-sm text-green-600">{formatCurrency(120000000)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Kho C</h3>
                      <p className="text-sm text-slate-600">Đà Nẵng</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">0 sản phẩm</p>
                      <p className="text-sm text-green-600">{formatCurrency(0)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EnterpriseLayout>
  );
}
