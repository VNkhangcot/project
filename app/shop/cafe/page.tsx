'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Coffee, 
  Clock, 
  DollarSign,
  Users,
  ShoppingCart,
  Plus,
  Minus,
  Calculator,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';

interface Order {
  id: number;
  item: string;
  quantity: number;
  price: number;
  status: string;
  total: number;
}

interface Table {
  id: number;
  name: string;
  seats: number;
  status: string;
  customer: string | null;
  startTime: string | null;
  orders: Order[];
  totalAmount: number;
}

// Mock data cho bàn cafe
const mockTables: Table[] = [
  {
    id: 1,
    name: 'Bàn 1',
    seats: 2,
    status: 'occupied', // occupied, available, reserved
    customer: 'Nguyễn Văn A',
    startTime: '14:30',
    orders: [
      { id: 1, item: 'Cafe đen', quantity: 1, price: 25000, status: 'served', total: 25000 },
      { id: 2, item: 'Bánh mì', quantity: 1, price: 15000, status: 'preparing', total: 15000 }
    ],
    totalAmount: 40000
  },
  {
    id: 2,
    name: 'Bàn 2',
    seats: 4,
    status: 'available',
    customer: null,
    startTime: null,
    orders: [],
    totalAmount: 0
  },
  {
    id: 3,
    name: 'Bàn 3',
    seats: 2,
    status: 'occupied',
    customer: 'Trần Thị B',
    startTime: '13:45',
    orders: [
      { id: 3, item: 'Cafe sữa', quantity: 2, price: 30000, status: 'served', total: 60000 },
      { id: 4, item: 'Bánh ngọt', quantity: 1, price: 20000, status: 'served', total: 20000 },
      { id: 5, item: 'Nước cam', quantity: 1, price: 25000, status: 'preparing', total: 25000 }
    ],
    totalAmount: 105000
  },
  {
    id: 4,
    name: 'Bàn 4',
    seats: 6,
    status: 'reserved',
    customer: 'Lê Văn C',
    startTime: '16:00',
    orders: [],
    totalAmount: 0
  },
  {
    id: 5,
    name: 'Bàn 5',
    seats: 2,
    status: 'available',
    customer: null,
    startTime: null,
    orders: [],
    totalAmount: 0
  },
  {
    id: 6,
    name: 'Bàn 6',
    seats: 4,
    status: 'occupied',
    customer: 'Phạm Văn D',
    startTime: '15:15',
    orders: [
      { id: 6, item: 'Trà đá', quantity: 3, price: 15000, status: 'served', total: 45000 },
      { id: 7, item: 'Chè', quantity: 2, price: 18000, status: 'preparing', total: 36000 }
    ],
    totalAmount: 81000
  }
];

// Mock menu items
const menuItems = [
  { id: 1, name: 'Cafe đen', price: 25000, category: 'Cafe', available: true },
  { id: 2, name: 'Cafe sữa', price: 30000, category: 'Cafe', available: true },
  { id: 3, name: 'Cafe đá', price: 28000, category: 'Cafe', available: true },
  { id: 4, name: 'Cappuccino', price: 45000, category: 'Cafe', available: true },
  { id: 5, name: 'Trà đá', price: 15000, category: 'Trà', available: true },
  { id: 6, name: 'Trà sữa', price: 35000, category: 'Trà', available: true },
  { id: 7, name: 'Nước cam', price: 25000, category: 'Nước ép', available: true },
  { id: 8, name: 'Sinh tố bơ', price: 40000, category: 'Sinh tố', available: true },
  { id: 9, name: 'Bánh mì', price: 15000, category: 'Đồ ăn', available: true },
  { id: 10, name: 'Bánh ngọt', price: 20000, category: 'Đồ ăn', available: true },
  { id: 11, name: 'Chè', price: 18000, category: 'Tráng miệng', available: true },
  { id: 12, name: 'Kem', price: 22000, category: 'Tráng miệng', available: true }
];

export default function CafePage() {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'occupied':
        return <Badge className="bg-red-100 text-red-800">Có khách</Badge>;
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Trống</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-100 text-yellow-800">Đã đặt</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'served':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'preparing':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const occupyTable = (tableId: number, customer: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { 
            ...table, 
            status: 'occupied', 
            customer, 
            startTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) 
          }
        : table
    ));
  };

  const addOrder = (tableId: number, item: any, quantity: number = 1) => {
    const newOrder = {
      id: Date.now(),
      item: item.name,
      quantity,
      price: item.price,
      status: 'preparing',
      total: item.price * quantity
    };

    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { 
            ...table, 
            orders: [...table.orders, newOrder],
            totalAmount: table.totalAmount + newOrder.total
          }
        : table
    ));
  };

  const updateOrderStatus = (tableId: number, orderId: number, newStatus: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? {
            ...table,
            orders: table.orders.map((order: Order) => 
              order.id === orderId ? { ...order, status: newStatus } : order
            )
          }
        : table
    ));
  };

  const clearTable = (tableId: number) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { 
            ...table, 
            status: 'available', 
            customer: null, 
            startTime: null, 
            orders: [], 
            totalAmount: 0 
          }
        : table
    ));
  };

  // Calculate stats
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const availableTables = tables.filter(t => t.status === 'available').length;
  const totalRevenue = tables.reduce((sum, table) => sum + table.totalAmount, 0);
  const totalCustomers = tables.filter(t => t.customer).length;

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];
  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-amber-700" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Quản lý Quán Cafe
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý bàn, đặt món và thanh toán cho khách hàng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {occupiedTables}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Bàn có khách
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
                    {availableTables}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Bàn trống
                  </p>
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
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Doanh thu hiện tại
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {totalCustomers}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Khách hàng
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <Card key={table.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Coffee className="h-5 w-5 text-amber-700" />
                    <CardTitle className="text-lg">{table.name}</CardTitle>
                    <Badge variant="outline">{table.seats} chỗ</Badge>
                  </div>
                  {getStatusBadge(table.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info */}
                {table.customer && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="font-medium">{table.customer}</span>
                    </div>
                    {table.startTime && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>Bắt đầu: {table.startTime}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Orders */}
                {table.orders.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Đơn hàng:</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {table.orders.map((order: Order) => (
                        <div key={order.id} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getOrderStatusIcon(order.status)}
                            <span>{order.item} x{order.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>{formatCurrency(order.total)}</span>
                            {order.status === 'preparing' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateOrderStatus(table.id, order.id, 'served')}
                                className="h-6 px-2"
                              >
                                Phục vụ
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Tổng cộng:</span>
                        <span className="text-blue-600">{formatCurrency(table.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 pt-2">
                  {table.status === 'available' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Nhận khách
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nhận khách cho {table.name}</DialogTitle>
                          <DialogDescription>
                            Nhập tên khách hàng
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Tên khách hàng"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setCustomerName('')}
                              className="flex-1"
                            >
                              Hủy
                            </Button>
                            <Button 
                              onClick={() => {
                                if (customerName.trim()) {
                                  occupyTable(table.id, customerName);
                                  setCustomerName('');
                                }
                              }}
                              className="flex-1"
                            >
                              Xác nhận
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {table.status === 'occupied' && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedTable(table);
                          setShowOrderDialog(true);
                        }}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Đặt món
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          setSelectedTable(table);
                          setShowBillingDialog(true);
                        }}
                        className="flex-1"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Thanh toán
                      </Button>
                    </div>
                  )}

                  {table.status === 'reserved' && (
                    <Button 
                      variant="outline"
                      onClick={() => occupyTable(table.id, table.customer || 'Khách hàng')}
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Nhận khách
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Dialog */}
        {showOrderDialog && selectedTable && (
          <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Đặt món cho {selectedTable.name}</DialogTitle>
                <DialogDescription>
                  Chọn món ăn/uống cho khách hàng: {selectedTable.customer}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                  {filteredMenuItems.map((item) => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <h3 className="font-medium mb-2">{item.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">{item.category}</p>
                        <p className="font-bold text-blue-600 mb-3">{formatCurrency(item.price)}</p>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            addOrder(selectedTable.id, item);
                          }}
                          className="w-full"
                          disabled={!item.available}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Thêm
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Billing Dialog */}
        {showBillingDialog && selectedTable && (
          <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Thanh toán {selectedTable.name}</DialogTitle>
                <DialogDescription>
                  Hóa đơn cho khách hàng: {selectedTable.customer}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Khách hàng:</span>
                    <span>{selectedTable.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời gian:</span>
                    <span>{selectedTable.startTime}</span>
                  </div>
                  <div className="border-t pt-2 space-y-1">
                    {selectedTable.orders.map((order: Order) => (
                      <div key={order.id} className="flex justify-between text-sm">
                        <span>{order.item} x{order.quantity}</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">{formatCurrency(selectedTable.totalAmount)}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBillingDialog(false)}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button 
                    onClick={() => {
                      clearTable(selectedTable.id);
                      setShowBillingDialog(false);
                    }}
                    className="flex-1"
                  >
                    Thanh toán
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
