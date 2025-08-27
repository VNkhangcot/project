'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Warehouse, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Package,
  DollarSign,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Truck
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Định nghĩa kiểu dữ liệu
interface ImportItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  expiryDate?: string;
  batchNumber?: string;
}

interface ImportOrder {
  id: string;
  date: string;
  supplierId: string;
  supplierName: string;
  status: 'pending' | 'completed' | 'cancelled';
  items: ImportItem[];
  totalAmount: number;
  note?: string;
  createdBy: string;
  receivedBy?: string;
  receivedDate?: string;
  invoiceNumber?: string;
}

// Mock data cho đơn nhập kho
const mockImportOrders: ImportOrder[] = [
  {
    id: 'IMP-001',
    date: '15/01/2024',
    supplierId: 'SUP-001',
    supplierName: 'Công ty TNHH ABC',
    status: 'completed',
    items: [
      {
        id: 'ITEM-001',
        productId: 'PRD-001',
        productName: 'Sản phẩm A',
        quantity: 100,
        unitPrice: 50000,
        totalPrice: 5000000,
        expiryDate: '15/01/2025',
        batchNumber: 'BATCH-001'
      },
      {
        id: 'ITEM-002',
        productId: 'PRD-002',
        productName: 'Sản phẩm B',
        quantity: 50,
        unitPrice: 75000,
        totalPrice: 3750000,
        expiryDate: '20/01/2025',
        batchNumber: 'BATCH-002'
      }
    ],
    totalAmount: 8750000,
    note: 'Đơn hàng nhập kho định kỳ tháng 1/2024',
    createdBy: 'Nguyễn Văn A',
    receivedBy: 'Trần Thị B',
    receivedDate: '15/01/2024',
    invoiceNumber: 'INV-ABC-001'
  },
  {
    id: 'IMP-002',
    date: '10/01/2024',
    supplierId: 'SUP-002',
    supplierName: 'Công ty XYZ',
    status: 'completed',
    items: [
      {
        id: 'ITEM-003',
        productId: 'PRD-003',
        productName: 'Sản phẩm C',
        quantity: 200,
        unitPrice: 30000,
        totalPrice: 6000000,
        expiryDate: '10/01/2025',
        batchNumber: 'BATCH-003'
      }
    ],
    totalAmount: 6000000,
    createdBy: 'Nguyễn Văn A',
    receivedBy: 'Lê Văn C',
    receivedDate: '10/01/2024',
    invoiceNumber: 'INV-XYZ-001'
  },
  {
    id: 'IMP-003',
    date: '05/01/2024',
    supplierId: 'SUP-001',
    supplierName: 'Công ty TNHH ABC',
    status: 'pending',
    items: [
      {
        id: 'ITEM-004',
        productId: 'PRD-004',
        productName: 'Sản phẩm D',
        quantity: 150,
        unitPrice: 40000,
        totalPrice: 6000000
      },
      {
        id: 'ITEM-005',
        productId: 'PRD-005',
        productName: 'Sản phẩm E',
        quantity: 100,
        unitPrice: 60000,
        totalPrice: 6000000
      }
    ],
    totalAmount: 12000000,
    note: 'Đơn hàng bổ sung',
    createdBy: 'Nguyễn Văn A'
  },
  {
    id: 'IMP-004',
    date: '01/01/2024',
    supplierId: 'SUP-003',
    supplierName: 'Công ty DEF',
    status: 'cancelled',
    items: [
      {
        id: 'ITEM-006',
        productId: 'PRD-006',
        productName: 'Sản phẩm F',
        quantity: 50,
        unitPrice: 100000,
        totalPrice: 5000000
      }
    ],
    totalAmount: 5000000,
    note: 'Đơn hàng bị hủy do sản phẩm không đạt chất lượng',
    createdBy: 'Nguyễn Văn A'
  }
];

// Mock data cho nhà cung cấp
const mockSuppliers = [
  { id: 'SUP-001', name: 'Công ty TNHH ABC', phone: '0901234567', email: 'contact@abc.com' },
  { id: 'SUP-002', name: 'Công ty XYZ', phone: '0909876543', email: 'info@xyz.com' },
  { id: 'SUP-003', name: 'Công ty DEF', phone: '0912345678', email: 'support@def.com' }
];

export default function ImportPage() {
  const [importOrders, setImportOrders] = useState<ImportOrder[]>(mockImportOrders);
  const [selectedOrder, setSelectedOrder] = useState<ImportOrder | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-slate-500" />;
    }
  };

  const filteredOrders = importOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Calculate stats
  const totalOrders = importOrders.length;
  const completedOrders = importOrders.filter(o => o.status === 'completed').length;
  const pendingOrders = importOrders.filter(o => o.status === 'pending').length;
  const totalValue = importOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Warehouse className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Nhập kho
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý đơn nhập kho và theo dõi hàng hóa nhập vào
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng đơn nhập</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalOrders}</p>
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
                  <p className="text-sm text-slate-500 dark:text-slate-400">Đã hoàn thành</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{completedOrders}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{pendingOrders}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng giá trị</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalValue)}</p>
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
              placeholder="Tìm kiếm đơn nhập kho theo mã, nhà cung cấp, sản phẩm..."
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
              <option value="completed">Hoàn thành</option>
              <option value="pending">Chờ xử lý</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo đơn nhập kho
            </Button>
          </div>
        </div>

        {/* Import Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn nhập kho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã đơn</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày nhập</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Nhà cung cấp</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tổng giá trị</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {order.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {order.supplierName}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(order.status)}
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
                              setSelectedOrder(order);
                              setShowOrderDialog(true);
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {order.status === 'pending' && (
                              <>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Xác nhận nhập kho
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Hủy đơn
                                </DropdownMenuItem>
                              </>
                            )}
                            {order.status === 'completed' && (
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                In phiếu nhập kho
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div className="py-8 text-center">
                  <Warehouse className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy đơn nhập kho nào</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredOrders.length)} trong số {filteredOrders.length} đơn nhập kho
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

        {/* Import Order Detail Dialog */}
        {selectedOrder && (
          <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Chi tiết đơn nhập kho</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết về đơn nhập kho {selectedOrder.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold">Đơn nhập kho #{selectedOrder.id}</h3>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Ngày tạo: {selectedOrder.date}
                    </p>
                    {selectedOrder.receivedDate && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Ngày nhận: {selectedOrder.receivedDate}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <p className="text-sm font-medium">Tổng giá trị:</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                </div>
                
                {/* Supplier Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Thông tin nhà cung cấp</h4>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <p className="font-medium">{selectedOrder.supplierName}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Mã NCC: {selectedOrder.supplierId}</p>
                      {mockSuppliers.find(s => s.id === selectedOrder.supplierId)?.phone && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          SĐT: {mockSuppliers.find(s => s.id === selectedOrder.supplierId)?.phone}
                        </p>
                      )}
                      {mockSuppliers.find(s => s.id === selectedOrder.supplierId)?.email && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Email: {mockSuppliers.find(s => s.id === selectedOrder.supplierId)?.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Thông tin nhân viên</h4>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <p className="text-sm">Người tạo: {selectedOrder.createdBy}</p>
                      </div>
                      {selectedOrder.receivedBy && (
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="h-4 w-4 text-slate-400" />
                          <p className="text-sm">Người nhận: {selectedOrder.receivedBy}</p>
                        </div>
                      )}
                      {selectedOrder.invoiceNumber && (
                        <div className="flex items-center space-x-2 mt-1">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <p className="text-sm">Số hóa đơn: {selectedOrder.invoiceNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Danh sách sản phẩm</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700">
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Mã SP</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Tên sản phẩm</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Số lượng</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Đơn giá</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2 text-sm">{item.productId}</td>
                            <td className="px-4 py-2 text-sm font-medium">{item.productName}</td>
                            <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 dark:bg-slate-700">
                          <td colSpan={4} className="px-4 py-2 text-right font-medium">Tổng cộng:</td>
                          <td className="px-4 py-2 text-right font-bold">{formatCurrency(selectedOrder.totalAmount)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                
                {/* Notes */}
                {selectedOrder.note && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Ghi chú</h4>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <p className="text-sm">{selectedOrder.note}</p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
                  Đóng
                </Button>
                {selectedOrder.status === 'completed' && (
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    In phiếu nhập kho
                  </Button>
                )}
                {selectedOrder.status === 'pending' && (
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Xác nhận nhập kho
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </UserLayout>
  );
}
