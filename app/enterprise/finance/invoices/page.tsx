'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Search, 
  Download, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock
} from 'lucide-react';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Dữ liệu mẫu
  const invoices: Invoice[] = [
    { 
      id: '1', 
      number: 'INV-2024-001', 
      customer: 'Công ty TNHH XYZ', 
      date: '2024-01-05', 
      dueDate: '2024-02-05', 
      amount: 5000000, 
      status: 'paid' 
    },
    { 
      id: '2', 
      number: 'INV-2024-002', 
      customer: 'Cửa hàng ABC', 
      date: '2024-01-10', 
      dueDate: '2024-02-10', 
      amount: 3500000, 
      status: 'pending' 
    },
    { 
      id: '3', 
      number: 'INV-2024-003', 
      customer: 'Nhà hàng DEF', 
      date: '2024-01-15', 
      dueDate: '2024-02-15', 
      amount: 7200000, 
      status: 'pending' 
    },
    { 
      id: '4', 
      number: 'INV-2024-004', 
      customer: 'Công ty GHI', 
      date: '2023-12-20', 
      dueDate: '2024-01-20', 
      amount: 4800000, 
      status: 'overdue' 
    },
    { 
      id: '5', 
      number: 'INV-2024-005', 
      customer: 'Cửa hàng JKL', 
      date: '2024-01-25', 
      dueDate: '2024-02-25', 
      amount: 2900000, 
      status: 'paid' 
    }
  ];

  // Lọc hóa đơn theo từ khóa tìm kiếm và bộ lọc
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    // Lọc theo thời gian
    let matchesDate = true;
    if (dateFilter === 'this_month') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const invoiceDate = new Date(invoice.date);
      matchesDate = invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;
    } else if (dateFilter === 'last_month') {
      const lastMonth = new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1;
      const lastMonthYear = new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();
      const invoiceDate = new Date(invoice.date);
      matchesDate = invoiceDate.getMonth() === lastMonth && invoiceDate.getFullYear() === lastMonthYear;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Tính tổng số tiền
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = filteredInvoices.filter(i => i.status === 'pending').reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = filteredInvoices.filter(i => i.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0);

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho trạng thái
  const getStatusText = (status: string) => {
    switch(status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'overdue':
        return 'Quá hạn';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy icon cho trạng thái
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý hóa đơn</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo hóa đơn mới
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Tổng hóa đơn</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                <p className="text-xs text-slate-500 mt-1">{filteredInvoices.length} hóa đơn</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Đã thanh toán</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
                <p className="text-xs text-slate-500 mt-1">{filteredInvoices.filter(i => i.status === 'paid').length} hóa đơn</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Chờ thanh toán</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</p>
                <p className="text-xs text-slate-500 mt-1">{filteredInvoices.filter(i => i.status === 'pending').length} hóa đơn</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-slate-600">Quá hạn</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(overdueAmount)}</p>
                <p className="text-xs text-slate-500 mt-1">{filteredInvoices.filter(i => i.status === 'overdue').length} hóa đơn</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm hóa đơn..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="paid">Đã thanh toán</SelectItem>
              <SelectItem value="pending">Chờ thanh toán</SelectItem>
              <SelectItem value="overdue">Quá hạn</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thời gian</SelectItem>
              <SelectItem value="this_month">Tháng này</SelectItem>
              <SelectItem value="last_month">Tháng trước</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 flex justify-end">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách hóa đơn</CardTitle>
            <CardDescription>
              Quản lý tất cả hóa đơn của doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Số hóa đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Ngày đến hạn</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(invoice.status)}
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredInvoices.length === 0 && (
              <div className="py-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Không tìm thấy hóa đơn nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
