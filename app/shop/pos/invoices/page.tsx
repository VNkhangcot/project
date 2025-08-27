'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Receipt, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  MoreVertical
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Định nghĩa kiểu dữ liệu
interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  date: string;
  dueDate?: string;
  paymentMethod?: string;
  notes?: string;
}

// Mock data cho hóa đơn
const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    customer: {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM'
    },
    items: [
      {
        id: 'item-1',
        name: 'Sản phẩm A',
        quantity: 2,
        price: 100000,
        total: 200000
      },
      {
        id: 'item-2',
        name: 'Sản phẩm B',
        quantity: 1,
        price: 150000,
        total: 150000
      }
    ],
    subtotal: 350000,
    tax: 35000,
    discount: 0,
    total: 385000,
    status: 'paid',
    date: '15/01/2024',
    paymentMethod: 'Tiền mặt'
  },
  {
    id: 'INV-002',
    customer: {
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0909876543',
      address: '456 Đường XYZ, Quận 2, TP.HCM'
    },
    items: [
      {
        id: 'item-3',
        name: 'Sản phẩm C',
        quantity: 3,
        price: 200000,
        total: 600000
      }
    ],
    subtotal: 600000,
    tax: 60000,
    discount: 50000,
    total: 610000,
    status: 'pending',
    date: '14/01/2024',
    dueDate: '21/01/2024',
    paymentMethod: 'Chuyển khoản'
  },
  {
    id: 'INV-003',
    customer: {
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      phone: '0912345678',
      address: '789 Đường DEF, Quận 3, TP.HCM'
    },
    items: [
      {
        id: 'item-4',
        name: 'Sản phẩm D',
        quantity: 1,
        price: 500000,
        total: 500000
      },
      {
        id: 'item-5',
        name: 'Sản phẩm E',
        quantity: 2,
        price: 300000,
        total: 600000
      }
    ],
    subtotal: 1100000,
    tax: 110000,
    discount: 100000,
    total: 1110000,
    status: 'overdue',
    date: '05/01/2024',
    dueDate: '12/01/2024',
    paymentMethod: 'Thẻ tín dụng'
  },
  {
    id: 'INV-004',
    customer: {
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      phone: '0987654321',
      address: '101 Đường GHI, Quận 4, TP.HCM'
    },
    items: [
      {
        id: 'item-7',
        name: 'Sản phẩm G',
        quantity: 1,
        price: 800000,
        total: 800000
      }
    ],
    subtotal: 800000,
    tax: 80000,
    discount: 0,
    total: 880000,
    status: 'cancelled',
    date: '10/01/2024',
    paymentMethod: 'Tiền mặt',
    notes: 'Khách hàng hủy đơn hàng'
  }
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
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
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Quá hạn</Badge>;
      case 'cancelled':
        return <Badge className="bg-slate-100 text-slate-800">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-slate-500" />;
      default:
        return <Receipt className="h-5 w-5 text-slate-500" />;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.customer.email && invoice.customer.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Calculate stats
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingRevenue = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
  const overdueRevenue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Receipt className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Hóa đơn & Thanh toán
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý hóa đơn, thanh toán và theo dõi doanh thu
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Chờ thanh toán</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(pendingRevenue)}</p>
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
                  <p className="text-sm text-slate-500 dark:text-slate-400">Quá hạn</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(overdueRevenue)}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
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
              placeholder="Tìm kiếm hóa đơn theo mã, khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="overdue">Quá hạn</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách hóa đơn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã hóa đơn</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Khách hàng</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tổng tiền</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {paginatedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {invoice.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {invoice.customer.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {invoice.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(invoice.status)}
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
                              setSelectedInvoice(invoice);
                              setShowInvoiceDialog(true);
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowPrintDialog(true);
                            }}>
                              <Printer className="h-4 w-4 mr-2" />
                              In hóa đơn
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Tải xuống PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredInvoices.length === 0 && (
                <div className="py-8 text-center">
                  <Receipt className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy hóa đơn nào</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} trong số {filteredInvoices.length} hóa đơn
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

        {/* Invoice Detail Dialog */}
        {selectedInvoice && (
          <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Chi tiết hóa đơn {selectedInvoice.id}</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết về hóa đơn và thanh toán
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">Hóa đơn #{selectedInvoice.id}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ngày: {selectedInvoice.date}
                    </p>
                    {selectedInvoice.dueDate && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Hạn thanh toán: {selectedInvoice.dueDate}
                      </p>
                    )}
                  </div>
                  <div>
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                    <p className="text-sm">{selectedInvoice.customer.name}</p>
                    {selectedInvoice.customer.email && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selectedInvoice.customer.email}</p>
                    )}
                    {selectedInvoice.customer.phone && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selectedInvoice.customer.phone}</p>
                    )}
                    {selectedInvoice.customer.address && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selectedInvoice.customer.address}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Thông tin thanh toán</h4>
                    <p className="text-sm">Phương thức: {selectedInvoice.paymentMethod || 'Không xác định'}</p>
                    <p className="text-sm">Trạng thái: {
                      selectedInvoice.status === 'paid' ? 'Đã thanh toán' :
                      selectedInvoice.status === 'pending' ? 'Chờ thanh toán' :
                      selectedInvoice.status === 'overdue' ? 'Quá hạn' :
                      'Đã hủy'
                    }</p>
                  </div>
                </div>
                
                {/* Invoice Items */}
                <div>
                  <h4 className="font-medium mb-2">Chi tiết sản phẩm</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700">
                          <th className="px-4 py-2 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Sản phẩm</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Số lượng</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Đơn giá</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {selectedInvoice.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2 text-sm">{item.name}</td>
                            <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.price)}</td>
                            <td className="px-4 py-2 text-sm text-right font-medium">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Invoice Summary */}
                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-sm">Tổng tiền hàng:</span>
                    <span className="text-sm">{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Thuế (10%):</span>
                    <span className="text-sm">{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Giảm giá:</span>
                      <span className="text-sm text-red-600">-{formatCurrency(selectedInvoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-bold">Tổng cộng:</span>
                    <span className="font-bold">{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
                
                {selectedInvoice.notes && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="font-medium mb-2">Ghi chú</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>
                  Đóng
                </Button>
                <Button onClick={() => {
                  setShowInvoiceDialog(false);
                  setShowPrintDialog(true);
                }}>
                  <Printer className="h-4 w-4 mr-2" />
                  In hóa đơn
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </UserLayout>
  );
}
