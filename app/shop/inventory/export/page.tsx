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
  ArrowUpRight
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
interface ExportItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  batchNumber?: string;
}

interface ExportOrder {
  id: string;
  date: string;
  type: 'sale' | 'transfer' | 'return' | 'damage' | 'other';
  destinationId?: string;
  destinationName?: string;
  status: 'pending' | 'completed' | 'cancelled';
  items: ExportItem[];
  totalAmount: number;
  note?: string;
  createdBy: string;
  approvedBy?: string;
  approvedDate?: string;
  referenceNumber?: string;
}

// Mock data cho đơn xuất kho
const mockExportOrders: ExportOrder[] = [
  {
    id: 'EXP-001',
    date: '15/01/2024',
    type: 'sale',
    destinationId: 'ORD-001',
    destinationName: 'Đơn hàng #ORD-001',
    status: 'completed',
    items: [
      {
        id: 'ITEM-001',
        productId: 'PRD-001',
        productName: 'Sản phẩm A',
        quantity: 10,
        unitPrice: 50000,
        totalPrice: 500000,
        batchNumber: 'BATCH-001'
      },
      {
        id: 'ITEM-002',
        productId: 'PRD-002',
        productName: 'Sản phẩm B',
        quantity: 5,
        unitPrice: 75000,
        totalPrice: 375000,
        batchNumber: 'BATCH-002'
      }
    ],
    totalAmount: 875000,
    note: 'Xuất kho cho đơn hàng online',
    createdBy: 'Nguyễn Văn A',
    approvedBy: 'Trần Thị B',
    approvedDate: '15/01/2024',
    referenceNumber: 'ORD-001'
  },
  {
    id: 'EXP-002',
    date: '12/01/2024',
    type: 'transfer',
    destinationId: 'STORE-002',
    destinationName: 'Chi nhánh 2',
    status: 'completed',
    items: [
      {
        id: 'ITEM-003',
        productId: 'PRD-003',
        productName: 'Sản phẩm C',
        quantity: 20,
        unitPrice: 30000,
        totalPrice: 600000,
        batchNumber: 'BATCH-003'
      }
    ],
    totalAmount: 600000,
    note: 'Chuyển hàng sang chi nhánh 2',
    createdBy: 'Nguyễn Văn A',
    approvedBy: 'Lê Văn C',
    approvedDate: '12/01/2024',
    referenceNumber: 'TRF-001'
  },
  {
    id: 'EXP-003',
    date: '10/01/2024',
    type: 'return',
    destinationId: 'SUP-001',
    destinationName: 'Công ty TNHH ABC',
    status: 'pending',
    items: [
      {
        id: 'ITEM-004',
        productId: 'PRD-004',
        productName: 'Sản phẩm D',
        quantity: 15,
        unitPrice: 40000,
        totalPrice: 600000,
        batchNumber: 'BATCH-004'
      }
    ],
    totalAmount: 600000,
    note: 'Trả hàng lỗi cho nhà cung cấp',
    createdBy: 'Nguyễn Văn A'
  },
  {
    id: 'EXP-004',
    date: '05/01/2024',
    type: 'damage',
    status: 'completed',
    items: [
      {
        id: 'ITEM-005',
        productId: 'PRD-005',
        productName: 'Sản phẩm E',
        quantity: 5,
        unitPrice: 60000,
        totalPrice: 300000,
        batchNumber: 'BATCH-005'
      }
    ],
    totalAmount: 300000,
    note: 'Hàng hóa bị hư hỏng trong kho',
    createdBy: 'Nguyễn Văn A',
    approvedBy: 'Phạm Thị D',
    approvedDate: '05/01/2024',
    referenceNumber: 'DMG-001'
  }
];

export default function ExportPage() {
  const [exportOrders, setExportOrders] = useState<ExportOrder[]>(mockExportOrders);
  const [selectedOrder, setSelectedOrder] = useState<ExportOrder | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sale':
        return <Badge className="bg-blue-100 text-blue-800">Bán hàng</Badge>;
      case 'transfer':
        return <Badge className="bg-purple-100 text-purple-800">Chuyển kho</Badge>;
      case 'return':
        return <Badge className="bg-orange-100 text-orange-800">Trả hàng</Badge>;
      case 'damage':
        return <Badge className="bg-red-100 text-red-800">Hư hỏng</Badge>;
      case 'other':
        return <Badge className="bg-slate-100 text-slate-800">Khác</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sale':
        return 'Bán hàng';
      case 'transfer':
        return 'Chuyển kho';
      case 'return':
        return 'Trả hàng';
      case 'damage':
        return 'Hư hỏng';
      case 'other':
        return 'Khác';
      default:
        return 'Không xác định';
    }
  };

  const filteredOrders = exportOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.destinationName && order.destinationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Calculate stats
  const totalOrders = exportOrders.length;
  const completedOrders = exportOrders.filter(o => o.status === 'completed').length;
  const pendingOrders = exportOrders.filter(o => o.status === 'pending').length;
  const totalValue = exportOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <ArrowUpRight className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Xuất kho
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý đơn xuất kho và theo dõi hàng hóa xuất ra
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng đơn xuất</p>
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
              placeholder="Tìm kiếm đơn xuất kho theo mã, điểm đến, sản phẩm..."
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
            <select
              className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả loại</option>
              <option value="sale">Bán hàng</option>
              <option value="transfer">Chuyển kho</option>
              <option value="return">Trả hàng</option>
              <option value="damage">Hư hỏng</option>
              <option value="other">Khác</option>
            </select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo đơn xuất kho
            </Button>
          </div>
        </div>

        {/* Export Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn xuất kho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã đơn</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày xuất</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Loại xuất</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Điểm đến</th>
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
                        {getTypeBadge(order.type)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {order.destinationName || '-'}
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
                                  Xác nhận xuất kho
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
                                In phiếu xuất kho
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
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy đơn xuất kho nào</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredOrders.length)} trong số {filteredOrders.length} đơn xuất kho
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

        {/* Export Order Detail Dialog */}
        {selectedOrder && (
          <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Chi tiết đơn xuất kho</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết về đơn xuất kho {selectedOrder.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold">Đơn xuất kho #{selectedOrder.id}</h3>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loại xuất: 
                      </p>
                      {getTypeBadge(selectedOrder.type)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Ngày tạo: {selectedOrder.date}
                    </p>
                    {selectedOrder.approvedDate && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Ngày duyệt: {selectedOrder.approvedDate}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <p className="text-sm font-medium">Tổng giá trị:</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedOrder.totalAmount)}</p>
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
                    In phiếu xuất kho
                  </Button>
                )}
                {selectedOrder.status === 'pending' && (
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Xác nhận xuất kho
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
