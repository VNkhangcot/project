'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calculator, 
  Clock, 
  DollarSign, 
  Printer, 
  Search, 
  CreditCard, 
  Wallet, 
  Check, 
  X, 
  Plus, 
  Minus, 
  Coffee,
  Gamepad2,
  Receipt,
  Calendar,
  User
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Định nghĩa kiểu dữ liệu
interface BilliardTable {
  id: number;
  name: string;
  type: string;
  status: 'playing' | 'available' | 'reserved';
  startTime: string | null;
  duration: number; // phút
  hourlyRate: number;
  currentCost: number;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Bill {
  id: string;
  tableId: number;
  tableName: string;
  customerName: string | null;
  startTime: string;
  endTime: string;
  duration: number;
  tableCost: number;
  orderItems: OrderItem[];
  orderTotal: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | null;
  status: 'pending' | 'paid';
  createdAt: string;
}

// Mock data cho bàn bida
const mockTables: BilliardTable[] = [
  {
    id: 1,
    name: 'Bàn 1',
    type: 'Lỗ',
    status: 'playing',
    startTime: '14:30',
    duration: 45,
    hourlyRate: 50000,
    currentCost: 37500
  },
  {
    id: 2,
    name: 'Bàn 2',
    type: 'Carom',
    status: 'available',
    startTime: null,
    duration: 0,
    hourlyRate: 60000,
    currentCost: 0
  },
  {
    id: 3,
    name: 'Bàn 3',
    type: 'Lỗ',
    status: 'playing',
    startTime: '13:15',
    duration: 90,
    hourlyRate: 50000,
    currentCost: 75000
  },
  {
    id: 4,
    name: 'Bàn 4',
    type: 'Carom',
    status: 'reserved',
    startTime: '16:00',
    duration: 0,
    hourlyRate: 60000,
    currentCost: 0
  }
];

// Mock data cho hóa đơn
const mockBills: Bill[] = [
  {
    id: 'BILL-001',
    tableId: 1,
    tableName: 'Bàn 1',
    customerName: 'Nguyễn Văn A',
    startTime: '14:30',
    endTime: '15:15',
    duration: 45,
    tableCost: 37500,
    orderItems: [
      { id: 'ITEM-001', name: 'Bia Tiger', quantity: 2, price: 25000, total: 50000 },
      { id: 'ITEM-003', name: 'Coca Cola', quantity: 1, price: 15000, total: 15000 }
    ],
    orderTotal: 65000,
    total: 102500,
    paymentMethod: 'cash',
    status: 'paid',
    createdAt: '15/01/2024'
  },
  {
    id: 'BILL-002',
    tableId: 3,
    tableName: 'Bàn 3',
    customerName: 'Trần Văn B',
    startTime: '13:15',
    endTime: '14:45',
    duration: 90,
    tableCost: 75000,
    orderItems: [
      { id: 'ITEM-002', name: 'Bia Heineken', quantity: 3, price: 30000, total: 90000 },
      { id: 'ITEM-005', name: 'Đậu phộng', quantity: 2, price: 20000, total: 40000 }
    ],
    orderTotal: 130000,
    total: 205000,
    paymentMethod: 'card',
    status: 'paid',
    createdAt: '15/01/2024'
  }
];

export default function BilliardsBillingPage() {
  const [tables, setTables] = useState<BilliardTable[]>(mockTables);
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [selectedTable, setSelectedTable] = useState<BilliardTable | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tables');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours} giờ ` : ''}${mins > 0 ? `${mins} phút` : ''}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'playing':
        return <Badge className="bg-green-100 text-green-800">Đang chơi</Badge>;
      case 'available':
        return <Badge className="bg-gray-100 text-gray-800">Trống</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-100 text-yellow-800">Đã đặt</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const filteredBills = bills.filter(bill => 
    bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bill.customerName && bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate stats
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
  const todayRevenue = bills
    .filter(bill => bill.createdAt === new Date().toLocaleDateString('vi-VN'))
    .reduce((sum, bill) => sum + bill.total, 0);
  const activeTables = tables.filter(table => table.status === 'playing').length;
  const totalBills = bills.length;

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Tính tiền
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý thanh toán và hóa đơn cho quán bida
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Doanh thu hôm nay</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(todayRevenue)}</p>
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
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Bàn đang chơi</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeTables}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Gamepad2 className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng hóa đơn</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalBills}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Receipt className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tables" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="tables">Bàn chơi</TabsTrigger>
            <TabsTrigger value="bills">Hóa đơn</TabsTrigger>
          </TabsList>

          {/* Tables Tab */}
          <TabsContent value="tables" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map((table) => (
                <Card key={table.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{table.name}</CardTitle>
                      {getStatusBadge(table.status)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Loại: {table.type} • Giá: {formatCurrency(table.hourlyRate)}/giờ
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {table.status === 'playing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Bắt đầu:</span>
                          <span>{table.startTime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Thời gian:</span>
                          <span className="font-medium text-green-600">{formatTime(table.duration)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tiền bàn:</span>
                          <span className="font-bold text-blue-600">{formatCurrency(table.currentCost)}</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      {table.status === 'playing' && (
                        <Button 
                          onClick={() => {
                            setSelectedTable(table);
                            setShowBillingDialog(true);
                          }}
                          className="w-full"
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Tính tiền
                        </Button>
                      )}
                      
                      {table.status === 'available' && (
                        <Button 
                          variant="outline"
                          disabled
                          className="w-full"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Bàn trống
                        </Button>
                      )}
                      
                      {table.status === 'reserved' && (
                        <Button 
                          variant="outline"
                          disabled
                          className="w-full"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Đã đặt: {table.startTime}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bills Tab */}
          <TabsContent value="bills" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm hóa đơn theo mã, bàn, khách hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách hóa đơn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã HĐ</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Bàn</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Khách hàng</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Thời gian</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tiền bàn</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tiền đồ uống</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tổng tiền</th>
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
                            {bill.tableName}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {bill.customerName || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {bill.startTime} - {bill.endTime} ({formatTime(bill.duration)})
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {formatCurrency(bill.tableCost)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {formatCurrency(bill.orderTotal)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                            {formatCurrency(bill.total)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge className="bg-green-100 text-green-800">
                              {bill.paymentMethod === 'cash' ? 'Tiền mặt' : 
                               bill.paymentMethod === 'card' ? 'Thẻ' : 
                               bill.paymentMethod === 'transfer' ? 'Chuyển khoản' : 'Không xác định'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedBill(bill);
                                setShowReceiptDialog(true);
                              }}
                            >
                              <Receipt className="h-4 w-4 mr-2" />
                              Xem
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredBills.length === 0 && (
                    <div className="py-8 text-center">
                      <Receipt className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500 dark:text-slate-400">Không tìm thấy hóa đơn nào</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Billing Dialog */}
        {selectedTable && (
          <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tính tiền {selectedTable.name}</DialogTitle>
                <DialogDescription>
                  Thêm đồ uống và thanh toán
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Thông tin bàn</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bàn:</span>
                      <span className="font-medium">{selectedTable.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Thời gian chơi:</span>
                      <span className="font-medium">{formatTime(selectedTable.duration)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Tiền bàn:</span>
                      <span className="text-blue-600">{formatCurrency(selectedTable.currentCost)}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowBillingDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={() => {
                    // Đóng dialog tính tiền
                    setShowBillingDialog(false);
                    
                    // Trong phiên bản đầy đủ, sẽ mở dialog thanh toán ở đây
                    // setShowPaymentDialog(true);
                  }}>
                    Thanh toán
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Receipt Dialog */}
        {selectedBill && (
          <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Hóa đơn #{selectedBill.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-bold text-lg">QUÁN BIDA SHOPPRO</h3>
                  <p className="text-sm text-slate-500">123 Đường ABC, Quận XYZ, TP.HCM</p>
                  <p className="text-sm text-slate-500">SĐT: 0123 456 789</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bàn:</span>
                    <span>{selectedBill.tableName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thời gian:</span>
                    <span>{selectedBill.startTime} - {selectedBill.endTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thời lượng:</span>
                    <span>{formatTime(selectedBill.duration)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Khách hàng:</span>
                    <span>{selectedBill.customerName || 'Khách lẻ'}</span>
                  </div>
                </div>
                
                <div className="border-t border-b py-2 space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Tiền bàn:</span>
                    <span>{formatCurrency(selectedBill.tableCost)}</span>
                  </div>
                  
                  {selectedBill.orderItems.length > 0 && (
                    <>
                      <div className="text-sm font-medium">Đồ uống & Đồ ăn:</div>
                      {selectedBill.orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm pl-4">
                          <span>{item.name} x{item.quantity}</span>
                          <span>{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-medium">
                        <span>Tổng đồ uống:</span>
                        <span>{formatCurrency(selectedBill.orderTotal)}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-between font-bold">
                  <span>TỔNG CỘNG:</span>
                  <span>{formatCurrency(selectedBill.total)}</span>
                </div>
                
                <div className="text-center text-sm">
                  <p>Phương thức thanh toán: {
                    selectedBill.paymentMethod === 'cash' ? 'Tiền mặt' : 
                    selectedBill.paymentMethod === 'card' ? 'Thẻ' : 
                    selectedBill.paymentMethod === 'transfer' ? 'Chuyển khoản' : 'Không xác định'
                  }</p>
                  <p className="mt-2">Cảm ơn quý khách và hẹn gặp lại!</p>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setShowReceiptDialog(false)}>
                    <Printer className="h-4 w-4 mr-2" />
                    In hóa đơn
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </UserLayout>
  );
}
