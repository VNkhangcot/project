'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  DollarSign, 
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  BarChart3
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';

// Dữ liệu mẫu cho giao dịch tài chính
const transactions = [
  {
    id: 1,
    date: '15/05/2023',
    description: 'Thanh toán lương nhân viên',
    amount: -150000000,
    type: 'expense',
    category: 'Lương',
    account: 'Tài khoản chính',
    reference: 'PAY-2023-05',
    status: 'completed'
  },
  {
    id: 2,
    date: '14/05/2023',
    description: 'Thanh toán hóa đơn điện',
    amount: -5000000,
    type: 'expense',
    category: 'Tiện ích',
    account: 'Tài khoản chính',
    reference: 'UTIL-2023-05-01',
    status: 'completed'
  },
  {
    id: 3,
    date: '12/05/2023',
    description: 'Thanh toán từ khách hàng ABC',
    amount: 75000000,
    type: 'income',
    category: 'Doanh thu',
    account: 'Tài khoản chính',
    reference: 'INV-2023-042',
    status: 'completed'
  },
  {
    id: 4,
    date: '10/05/2023',
    description: 'Thanh toán nhà cung cấp XYZ',
    amount: -25000000,
    type: 'expense',
    category: 'Nhà cung cấp',
    account: 'Tài khoản chính',
    reference: 'PO-2023-028',
    status: 'completed'
  },
  {
    id: 5,
    date: '08/05/2023',
    description: 'Thanh toán từ khách hàng DEF',
    amount: 120000000,
    type: 'income',
    category: 'Doanh thu',
    account: 'Tài khoản chính',
    reference: 'INV-2023-041',
    status: 'completed'
  },
  {
    id: 6,
    date: '05/05/2023',
    description: 'Thanh toán thuế VAT',
    amount: -35000000,
    type: 'expense',
    category: 'Thuế',
    account: 'Tài khoản chính',
    reference: 'TAX-2023-05',
    status: 'pending'
  },
  {
    id: 7,
    date: '03/05/2023',
    description: 'Thanh toán tiền thuê văn phòng',
    amount: -30000000,
    type: 'expense',
    category: 'Thuê văn phòng',
    account: 'Tài khoản chính',
    reference: 'RENT-2023-05',
    status: 'completed'
  },
  {
    id: 8,
    date: '01/05/2023',
    description: 'Thanh toán từ khách hàng GHI',
    amount: 85000000,
    type: 'income',
    category: 'Doanh thu',
    account: 'Tài khoản chính',
    reference: 'INV-2023-040',
    status: 'completed'
  }
];

// Dữ liệu mẫu cho tài khoản
const accounts = [
  {
    id: 1,
    name: 'Tài khoản chính',
    bank: 'Vietcombank',
    accountNumber: '1234567890',
    balance: 450000000,
    currency: 'VND'
  },
  {
    id: 2,
    name: 'Tài khoản phụ',
    bank: 'Techcombank',
    accountNumber: '0987654321',
    balance: 150000000,
    currency: 'VND'
  },
  {
    id: 3,
    name: 'Tài khoản USD',
    bank: 'HSBC',
    accountNumber: '1122334455',
    balance: 50000,
    currency: 'USD'
  }
];

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('this-month');

  // Lọc giao dịch
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Tính tổng thu nhập
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Tính tổng chi phí
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Tính số dư
  const balance = totalIncome - totalExpense;

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Hiển thị trạng thái giao dịch
  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Quản lý thu chi</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo giao dịch mới
          </Button>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ArrowDownLeft className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tổng thu</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tổng chi</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Số dư</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(balance)}
                  </p>
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
              placeholder="Tìm kiếm giao dịch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="income">Thu nhập</SelectItem>
                <SelectItem value="expense">Chi phí</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Lương">Lương</SelectItem>
                <SelectItem value="Tiện ích">Tiện ích</SelectItem>
                <SelectItem value="Doanh thu">Doanh thu</SelectItem>
                <SelectItem value="Nhà cung cấp">Nhà cung cấp</SelectItem>
                <SelectItem value="Thuế">Thuế</SelectItem>
                <SelectItem value="Thuê văn phòng">Thuê văn phòng</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">Tháng này</SelectItem>
                <SelectItem value="last-month">Tháng trước</SelectItem>
                <SelectItem value="this-quarter">Quý này</SelectItem>
                <SelectItem value="this-year">Năm nay</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
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
            <TabsTrigger value="all">Tất cả giao dịch</TabsTrigger>
            <TabsTrigger value="income">Thu nhập</TabsTrigger>
            <TabsTrigger value="expense">Chi phí</TabsTrigger>
            <TabsTrigger value="accounts">Tài khoản</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mô tả</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Danh mục</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tài khoản</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tham chiếu</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Số tiền</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {transaction.date}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">{transaction.description}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {transaction.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {transaction.account}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {transaction.reference}
                        </td>
                        <td className={`px-4 py-3 text-sm font-medium text-right ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-3">
                          {getTransactionStatusBadge(transaction.status)}
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
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredTransactions.length === 0 && (
                <div className="py-8 text-center">
                  <CreditCard className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy giao dịch nào</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="income" className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mô tả</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Danh mục</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tài khoản</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tham chiếu</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Số tiền</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredTransactions
                      .filter(t => t.type === 'income')
                      .map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {transaction.date}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 dark:text-white">{transaction.description}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {transaction.category}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {transaction.account}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {transaction.reference}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-right text-green-600">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-4 py-3">
                            {getTransactionStatusBadge(transaction.status)}
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
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {filteredTransactions.filter(t => t.type === 'income').length === 0 && (
                <div className="py-8 text-center">
                  <ArrowDownLeft className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy giao dịch thu nhập nào</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="expense" className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mô tả</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Danh mục</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tài khoản</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tham chiếu</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Số tiền</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredTransactions
                      .filter(t => t.type === 'expense')
                      .map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {transaction.date}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 dark:text-white">{transaction.description}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {transaction.category}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {transaction.account}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {transaction.reference}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-right text-red-600">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-4 py-3">
                            {getTransactionStatusBadge(transaction.status)}
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
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {filteredTransactions.filter(t => t.type === 'expense').length === 0 && (
                <div className="py-8 text-center">
                  <ArrowUpRight className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy giao dịch chi phí nào</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="accounts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{account.name}</CardTitle>
                    <CardDescription>{account.bank} - {account.accountNumber}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-2xl font-bold">
                      {account.currency === 'VND' 
                        ? formatCurrency(account.balance)
                        : new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)
                      }
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex space-x-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ArrowDownLeft className="h-4 w-4 mr-2" />
                        Nạp tiền
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Rút tiền
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              <Card className="border-dashed flex items-center justify-center h-[200px]">
                <Button variant="outline" className="flex flex-col h-32 w-32 items-center justify-center rounded-md border border-dashed">
                  <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-muted-foreground">Thêm tài khoản</span>
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Báo cáo */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Báo cáo thu chi</CardTitle>
                <CardDescription>Tổng quan thu chi theo thời gian</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất Excel
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Biểu đồ
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-[16/9] bg-slate-50 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Biểu đồ thu chi theo thời gian (Dữ liệu mẫu)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
