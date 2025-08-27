'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Coffee, 
  Search, 
  DollarSign, 
  Printer,
  CreditCard,
  Wallet,
  QrCode,
  Receipt,
  CheckCircle,
  Clock,
  Calendar,
  ArrowDownUp,
  Filter
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Định nghĩa kiểu dữ liệu
interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Bill {
  id: string;
  tableNumber: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'momo' | 'banking';
  createdAt: string;
  paidAt?: string;
  customerName?: string;
  customerPhone?: string;
}

// Mock data cho hóa đơn
const mockBills: Bill[] = [
  {
    id: 'BILL-001',
    tableNumber: 'Bàn 1',
    items: [
      { id: 'bi-001', name: 'Cà phê đen', price: 25000, quantity: 2, total: 50000 },
      { id: 'bi-002', name: 'Bánh flan', price: 25000, quantity: 1, total: 25000 }
    ],
    subtotal: 75000,
    discount: 0,
    tax: 7500,
    total: 82500,
    status: 'paid',
    paymentMethod: 'cash',
    createdAt: '10:15 AM, 15/01/2024',
    paidAt: '10:30 AM, 15/01/2024',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567'
  },
  {
    id: 'BILL-002',
    tableNumber: 'Bàn 3',
    items: [
      { id: 'bi-003', name: 'Trà đào', price: 40000, quantity: 3, total: 120000 },
      { id: 'bi-004', name: 'Mì xào hải sản', price: 65000, quantity: 1, total: 65000 }
    ],
    subtotal: 185000,
    discount: 10000,
    tax: 17500,
    total: 192500,
    status: 'pending',
    createdAt: '09:45 AM, 15/01/2024'
  },
  {
    id: 'BILL-003',
    tableNumber: 'Bàn 5',
    items: [
      { id: 'bi-005', name: 'Cà phê sữa', price: 30000, quantity: 2, total: 60000 },
      { id: 'bi-006', name: 'Sinh tố xoài', price: 40000, quantity: 1, total: 40000 }
    ],
    subtotal: 100000,
    discount: 0,
    tax: 10000,
    total: 110000,
    status: 'paid',
    paymentMethod: 'card',
    createdAt: '10:30 AM, 15/01/2024',
    paidAt: '10:45 AM, 15/01/2024'
  },
  {
    id: 'BILL-004',
    tableNumber: 'Bàn 2',
    items: [
      { id: 'bi-007', name: 'Trà sữa trân châu', price: 45000, quantity: 4, total: 180000 }
    ],
    subtotal: 180000,
    discount: 0,
    tax: 18000,
    total: 198000,
    status: 'cancelled',
    createdAt: '09:15 AM, 15/01/2024'
  }
];

export default function CafeBillingPage() {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showBillDetailsDialog, setShowBillDetailsDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [dateRange, setDateRange] = useState('today');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'cash':
        return <Wallet className="h-5 w-5 text-green-500" />;
      case 'card':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'momo':
        return <QrCode className="h-5 w-5 text-pink-500" />;
      case 'banking':
        return <DollarSign className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPaymentMethodName = (method?: string) => {
    switch (method) {
      case 'cash':
        return 'Tiền mặt';
      case 'card':
        return 'Thẻ tín dụng/ghi nợ';
      case 'momo':
        return 'Ví MoMo';
      case 'banking':
        return 'Chuyển khoản';
      default:
        return 'Chưa thanh toán';
    }
  };

  const handlePayBill = () => {
    if (selectedBill) {
      const updatedBill: Bill = {
        ...selectedBill,
        status: 'paid',
        paymentMethod: paymentMethod as 'cash' | 'card' | 'momo' | 'banking',
        paidAt: new Date().toLocaleString('vi-VN')
      };

      setBills(bills.map(bill => 
        bill.id === selectedBill.id ? updatedBill : bill
      ));

      setSelectedBill(updatedBill);
      setShowPaymentDialog(false);
    }
  };

  const handleCancelBill = (billId: string) => {
    setBills(bills.map(bill => 
      bill.id === billId ? { ...bill, status: 'cancelled' } : bill
    ));

    if (selectedBill && selectedBill.id === billId) {
      setSelectedBill({ ...selectedBill, status: 'cancelled' });
    }
  };

  const filteredBills = bills.filter(bill => {
    if (activeTab !== 'all' && bill.status !== activeTab) {
      return false;
    }

    if (searchQuery) {
      return (
        bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bill.customerName && bill.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        bill.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return true;
  });

  // Tính tổng doanh thu
  const totalRevenue = bills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.total, 0);

  // Tính số lượng hóa đơn theo trạng thái
  const pendingBillsCount = bills.filter(bill => bill.status === 'pending').length;
  const paidBillsCount = bills.filter(bill => bill.status === 'paid').length;
  const cancelledBillsCount = bills.filter(bill => bill.status === 'cancelled').length;

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Receipt className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Thanh toán
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý hóa đơn và thanh toán cho quán cafe
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tổng doanh thu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {paidBillsCount}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đã thanh toán
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {pendingBillsCount}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Chờ thanh toán
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Receipt className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {cancelledBillsCount}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đã hủy
                  </p>
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
              placeholder="Tìm kiếm hóa đơn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Chọn thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="yesterday">Hôm qua</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
            <Button variant="outline">
              <ArrowDownUp className="h-4 w-4 mr-2" />
              Sắp xếp
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending">Chờ thanh toán</TabsTrigger>
            <TabsTrigger value="paid">Đã thanh toán</TabsTrigger>
            <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã hóa đơn</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Bàn</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Thời gian</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tổng tiền</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Thanh toán</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredBills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          {bill.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {bill.tableNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {bill.createdAt}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-blue-600">
                          {formatCurrency(bill.total)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {getStatusBadge(bill.status)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            {getPaymentMethodIcon(bill.paymentMethod)}
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {getPaymentMethodName(bill.paymentMethod)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedBill(bill);
                                setShowBillDetailsDialog(true);
                              }}
                            >
                              Chi tiết
                            </Button>
                            {bill.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedBill(bill);
                                  setPaymentMethod('cash');
                                  setShowPaymentDialog(true);
                                }}
                              >
                                Thanh toán
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredBills.length === 0 && (
                <div className="py-8 text-center">
                  <Receipt className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy hóa đơn nào</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Bill Details Dialog */}
        {selectedBill && (
          <Dialog open={showBillDetailsDialog} onOpenChange={setShowBillDetailsDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Chi tiết hóa đơn #{selectedBill.id}</DialogTitle>
                <DialogDescription>
                  {selectedBill.tableNumber} • {selectedBill.createdAt}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedBill.status)}
                  </div>
                  {selectedBill.status === 'paid' && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      {getPaymentMethodIcon(selectedBill.paymentMethod)}
                      <span>{getPaymentMethodName(selectedBill.paymentMethod)}</span>
                    </div>
                  )}
                </div>
                
                {selectedBill.customerName && (
                  <div className="text-sm">
                    <p><span className="font-medium">Khách hàng:</span> {selectedBill.customerName}</p>
                    {selectedBill.customerPhone && (
                      <p><span className="font-medium">Số điện thoại:</span> {selectedBill.customerPhone}</p>
                    )}
                  </div>
                )}
                
                <div className="border-t border-b py-4 space-y-2">
                  <div className="text-sm font-medium">Danh sách món:</div>
                  {selectedBill.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-slate-500 ml-1">x{item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <div>{formatCurrency(item.price)}</div>
                        <div className="font-medium">{formatCurrency(item.total)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(selectedBill.subtotal)}</span>
                  </div>
                  {selectedBill.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(selectedBill.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Thuế (10%):</span>
                    <span>{formatCurrency(selectedBill.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatCurrency(selectedBill.total)}</span>
                  </div>
                </div>
                
                <div className="text-sm text-slate-500">
                  <div>Tạo lúc: {selectedBill.createdAt}</div>
                  {selectedBill.paidAt && <div>Thanh toán: {selectedBill.paidAt}</div>}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBillDetailsDialog(false)}>Đóng</Button>
                <Button>
                  <Printer className="h-4 w-4 mr-2" />
                  In hóa đơn
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Payment Dialog */}
        {selectedBill && (
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thanh toán hóa đơn #{selectedBill.id}</DialogTitle>
                <DialogDescription>
                  {selectedBill.tableNumber} • Tổng tiền: {formatCurrency(selectedBill.total)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Phương thức thanh toán</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center">
                        <Wallet className="h-5 w-5 mr-2 text-green-500" />
                        Tiền mặt
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
                        Thẻ tín dụng/ghi nợ
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="momo" id="momo" />
                      <Label htmlFor="momo" className="flex items-center">
                        <QrCode className="h-5 w-5 mr-2 text-pink-500" />
                        Ví MoMo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="banking" id="banking" />
                      <Label htmlFor="banking" className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-purple-500" />
                        Chuyển khoản
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Tên khách hàng (tùy chọn)</Label>
                  <Input 
                    id="customer-name" 
                    placeholder="Nhập tên khách hàng" 
                    value={selectedBill.customerName || ''}
                    onChange={(e) => setSelectedBill({...selectedBill, customerName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Số điện thoại (tùy chọn)</Label>
                  <Input 
                    id="customer-phone" 
                    placeholder="Nhập số điện thoại" 
                    value={selectedBill.customerPhone || ''}
                    onChange={(e) => setSelectedBill({...selectedBill, customerPhone: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Hủy</Button>
                <Button onClick={handlePayBill}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Xác nhận thanh toán
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </UserLayout>
  );
}
