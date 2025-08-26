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
  Warehouse, 
  Package, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Download,
  Upload
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';

// Mock data cho inventory
const mockInventory = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    sku: 'IP15P-128-BL',
    category: 'Điện thoại',
    currentStock: 15,
    minStock: 5,
    maxStock: 50,
    unitPrice: 29990000,
    totalValue: 449850000,
    supplier: 'Apple Vietnam',
    location: 'Kho A - Kệ 1',
    lastUpdated: '2024-01-15',
    status: 'in_stock'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    sku: 'SGS24-256-GR',
    category: 'Điện thoại',
    currentStock: 3,
    minStock: 5,
    maxStock: 40,
    unitPrice: 22990000,
    totalValue: 68970000,
    supplier: 'Samsung Vietnam',
    location: 'Kho A - Kệ 2',
    lastUpdated: '2024-01-14',
    status: 'low_stock'
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    sku: 'MBA-M3-512-SL',
    category: 'Laptop',
    currentStock: 0,
    minStock: 3,
    maxStock: 20,
    unitPrice: 34990000,
    totalValue: 0,
    supplier: 'Apple Vietnam',
    location: 'Kho B - Kệ 1',
    lastUpdated: '2024-01-13',
    status: 'out_of_stock'
  },
  {
    id: '4',
    name: 'AirPods Pro',
    sku: 'APP-GEN2-WH',
    category: 'Phụ kiện',
    currentStock: 25,
    minStock: 10,
    maxStock: 100,
    unitPrice: 6990000,
    totalValue: 174750000,
    supplier: 'Apple Vietnam',
    location: 'Kho C - Kệ 1',
    lastUpdated: '2024-01-15',
    status: 'in_stock'
  },
  {
    id: '5',
    name: 'iPad Pro 12.9"',
    sku: 'IPP-129-1TB-SG',
    category: 'Tablet',
    currentStock: 12,
    minStock: 5,
    maxStock: 30,
    unitPrice: 28990000,
    totalValue: 347880000,
    supplier: 'Apple Vietnam',
    location: 'Kho B - Kệ 2',
    lastUpdated: '2024-01-14',
    status: 'in_stock'
  },
  {
    id: '6',
    name: 'Apple Watch Series 9',
    sku: 'AWS9-45-AL-BL',
    category: 'Đồng hồ thông minh',
    currentStock: 18,
    minStock: 8,
    maxStock: 50,
    unitPrice: 9990000,
    totalValue: 179820000,
    supplier: 'Apple Vietnam',
    location: 'Kho C - Kệ 2',
    lastUpdated: '2024-01-15',
    status: 'in_stock'
  }
];

const categories = ['all', 'Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện', 'Đồng hồ thông minh'];
const statusOptions = ['all', 'in_stock', 'low_stock', 'out_of_stock'];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-green-100 text-green-800">Còn hàng</Badge>;
      case 'low_stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-100 text-red-800">Hết hàng</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const totalValue = mockInventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = mockInventory.filter(item => item.status === 'low_stock').length;
  const outOfStockItems = mockInventory.filter(item => item.status === 'out_of_stock').length;
  const totalItems = mockInventory.reduce((sum, item) => sum + item.currentStock, 0);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Warehouse className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Quản lý kho
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Theo dõi và quản lý tồn kho, nhập xuất hàng hóa
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {totalItems}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tổng sản phẩm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalValue)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Giá trị tồn kho
                  </p>
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
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {lowStockItems}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Sắp hết hàng
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {outOfStockItems}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Hết hàng
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'Tất cả danh mục' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="in_stock">Còn hàng</SelectItem>
                    <SelectItem value="low_stock">Sắp hết</SelectItem>
                    <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất Excel
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm sản phẩm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách tồn kho</CardTitle>
            <CardDescription>
              Hiển thị {filteredInventory.length} sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Tồn kho</TableHead>
                    <TableHead>Giá trị</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-slate-500">{item.supplier}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-bold">{item.currentStock}</p>
                          <p className="text-xs text-slate-500">
                            Min: {item.minStock} | Max: {item.maxStock}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(item.totalValue)}</p>
                          <p className="text-sm text-slate-500">
                            {formatCurrency(item.unitPrice)}/cái
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.location}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chi tiết sản phẩm</DialogTitle>
                                <DialogDescription>
                                  Thông tin chi tiết về {selectedItem?.name}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedItem && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <div>
                                      <label className="text-sm font-medium text-slate-600">Tên sản phẩm</label>
                                      <p className="font-medium">{selectedItem.name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-slate-600">SKU</label>
                                      <p className="font-mono">{selectedItem.sku}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-slate-600">Danh mục</label>
                                      <p>{selectedItem.category}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-slate-600">Nhà cung cấp</label>
                                      <p>{selectedItem.supplier}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-slate-600">Vị trí kho</label>
                                      <p>{selectedItem.location}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <label className="text-sm font-medium text-slate-600">Tồn kho hiện tại</label>
                                      <p className="text-2xl font-bold text-blue-600">{selectedItem.currentStock}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-slate-600">Tồn kho tối thiểu</label>
                                      <p className="text-yellow-600">{selectedItem.minStock}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-slate-600">Tồn kho tối đa</label>
                                      <p className="text-green-600">{selectedItem.maxStock}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-slate-600">Giá đơn vị</label>
                                      <p className="font-bold">{formatCurrency(selectedItem.unitPrice)}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-slate-600">Tổng giá trị</label>
                                      <p className="text-xl font-bold text-green-600">
                                        {formatCurrency(selectedItem.totalValue)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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
              <Upload className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Nhập kho</h3>
              <p className="text-sm text-slate-600 mb-4">
                Thêm sản phẩm mới vào kho
              </p>
              <Button className="w-full">
                Nhập kho
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Xuất kho</h3>
              <p className="text-sm text-slate-600 mb-4">
                Xuất sản phẩm khỏi kho
              </p>
              <Button variant="outline" className="w-full">
                Xuất kho
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Báo cáo kho</h3>
              <p className="text-sm text-slate-600 mb-4">
                Xem báo cáo chi tiết về kho
              </p>
              <Button variant="outline" className="w-full">
                Xem báo cáo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}
