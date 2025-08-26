'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Gamepad2, 
  Clock, 
  DollarSign,
  Users,
  Play,
  Pause,
  Square,
  Coffee,
  Plus,
  Minus,
  Calculator,
  Timer,
  User
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';

interface Table {
  id: number;
  name: string;
  type: string;
  status: string;
  startTime: string | null;
  duration: number;
  players: string[];
  hourlyRate: number;
  currentCost: number;
  orders: Array<{
    item: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

// Mock data cho bàn bida
const mockTables: Table[] = [
  {
    id: 1,
    name: 'Bàn 1',
    type: 'Lỗ',
    status: 'playing', // playing, available, reserved
    startTime: '14:30',
    duration: 45, // phút
    players: ['Nguyễn Văn A', 'Trần Văn B'],
    hourlyRate: 50000,
    currentCost: 37500,
    orders: [
      { item: 'Coca Cola', quantity: 2, price: 15000, total: 30000 },
      { item: 'Nước suối', quantity: 1, price: 10000, total: 10000 }
    ]
  },
  {
    id: 2,
    name: 'Bàn 2',
    type: 'Carom',
    status: 'available',
    startTime: null,
    duration: 0,
    players: [],
    hourlyRate: 60000,
    currentCost: 0,
    orders: []
  },
  {
    id: 3,
    name: 'Bàn 3',
    type: 'Lỗ',
    status: 'playing',
    startTime: '13:15',
    duration: 90,
    players: ['Lê Văn C', 'Phạm Văn D'],
    hourlyRate: 50000,
    currentCost: 75000,
    orders: [
      { item: 'Bia Tiger', quantity: 4, price: 25000, total: 100000 },
      { item: 'Đậu phộng', quantity: 2, price: 20000, total: 40000 }
    ]
  },
  {
    id: 4,
    name: 'Bàn 4',
    type: 'Carom',
    status: 'reserved',
    startTime: '16:00',
    duration: 0,
    players: ['Hoàng Văn E'],
    hourlyRate: 60000,
    currentCost: 0,
    orders: []
  },
  {
    id: 5,
    name: 'Bàn 5',
    type: 'Lỗ',
    status: 'available',
    startTime: null,
    duration: 0,
    players: [],
    hourlyRate: 50000,
    currentCost: 0,
    orders: []
  },
  {
    id: 6,
    name: 'Bàn 6',
    type: 'Snooker',
    status: 'playing',
    startTime: '15:00',
    duration: 30,
    players: ['Vũ Văn F'],
    hourlyRate: 80000,
    currentCost: 40000,
    orders: []
  }
];

// Mock menu items
const menuItems = [
  { id: 1, name: 'Coca Cola', price: 15000, category: 'Nước ngọt' },
  { id: 2, name: 'Pepsi', price: 15000, category: 'Nước ngọt' },
  { id: 3, name: 'Nước suối', price: 10000, category: 'Nước ngọt' },
  { id: 4, name: 'Bia Tiger', price: 25000, category: 'Bia' },
  { id: 5, name: 'Bia Saigon', price: 22000, category: 'Bia' },
  { id: 6, name: 'Đậu phộng', price: 20000, category: 'Đồ ăn vặt' },
  { id: 7, name: 'Mì tôm', price: 15000, category: 'Đồ ăn vặt' },
  { id: 8, name: 'Cafe đen', price: 18000, category: 'Cafe' },
  { id: 9, name: 'Cafe sữa', price: 22000, category: 'Cafe' }
];

export default function BilliardsPage() {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [newOrder, setNewOrder] = useState<any>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getTableTypeColor = (type: string) => {
    switch (type) {
      case 'Lỗ':
        return 'bg-blue-500';
      case 'Carom':
        return 'bg-green-500';
      case 'Snooker':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const startTable = (tableId: number) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, status: 'playing', startTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }
        : table
    ));
  };

  const stopTable = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      setSelectedTable(table);
      setShowBillingDialog(true);
    }
  };

  const addOrder = (tableId: number, item: any) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { 
            ...table, 
            orders: [...table.orders, { 
              item: item.name, 
              quantity: 1, 
              price: item.price, 
              total: item.price 
            }] 
          }
        : table
    ));
  };

  // Calculate stats
  const playingTables = tables.filter(t => t.status === 'playing').length;
  const availableTables = tables.filter(t => t.status === 'available').length;
  const totalRevenue = tables.reduce((sum, table) => sum + table.currentCost + table.orders.reduce((orderSum, order) => orderSum + order.total, 0), 0);
  const totalCustomers = tables.reduce((sum, table) => sum + table.players.length, 0);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Quản lý Quán Bida
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý bàn chơi, tính giờ và đặt món cho khách hàng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Play className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {playingTables}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Bàn đang chơi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Square className="h-5 w-5 text-gray-600" />
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
                  <Users className="h-5 w-5 text-orange-600" />
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
                    <div className={`w-3 h-3 rounded-full ${getTableTypeColor(table.type)}`}></div>
                    <CardTitle className="text-lg">{table.name}</CardTitle>
                    <Badge variant="outline">{table.type}</Badge>
                  </div>
                  {getStatusBadge(table.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Table Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Giá/giờ:</span>
                    <span className="font-medium">{formatCurrency(table.hourlyRate)}</span>
                  </div>
                  {table.status === 'playing' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Bắt đầu:</span>
                        <span>{table.startTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Thời gian:</span>
                        <span className="font-medium text-green-600">{table.duration} phút</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tiền bàn:</span>
                        <span className="font-bold text-blue-600">{formatCurrency(table.currentCost)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Players */}
                {table.players.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Người chơi:</p>
                    <div className="space-y-1">
                      {table.players.map((player, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4 text-slate-400" />
                          <span>{player}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Orders */}
                {table.orders.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Đồ uống/ăn:</p>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {table.orders.map((order, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{order.item} x{order.quantity}</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Tổng đồ ăn/uống:</span>
                        <span className="text-orange-600">
                          {formatCurrency(table.orders.reduce((sum, order) => sum + order.total, 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 pt-2">
                  {table.status === 'available' && (
                    <Button 
                      onClick={() => startTable(table.id)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Bắt đầu chơi
                    </Button>
                  )}
                  
                  {table.status === 'playing' && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedTable(table);
                          setShowOrderDialog(true);
                        }}
                        className="flex-1"
                      >
                        <Coffee className="h-4 w-4 mr-2" />
                        Đặt món
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => stopTable(table.id)}
                        className="flex-1"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Tính tiền
                      </Button>
                    </div>
                  )}

                  {table.status === 'reserved' && (
                    <Button 
                      variant="outline"
                      onClick={() => startTable(table.id)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Bắt đầu chơi
                    </Button>
                  )}
                </div>

                {/* Total */}
                {table.status === 'playing' && (
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-red-600">
                        {formatCurrency(table.currentCost + table.orders.reduce((sum, order) => sum + order.total, 0))}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Dialog */}
        {showOrderDialog && selectedTable && (
          <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Đặt món cho {selectedTable.name}</DialogTitle>
                <DialogDescription>
                  Chọn đồ ăn/uống cho khách hàng
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {menuItems.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium mb-2">{item.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">{item.category}</p>
                      <p className="font-bold text-blue-600 mb-3">{formatCurrency(item.price)}</p>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          addOrder(selectedTable.id, item);
                          setShowOrderDialog(false);
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Billing Dialog */}
        {showBillingDialog && selectedTable && (
          <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Tính tiền {selectedTable.name}</DialogTitle>
                <DialogDescription>
                  Hóa đơn thanh toán
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Thời gian chơi:</span>
                    <span>{selectedTable.duration} phút</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiền bàn:</span>
                    <span>{formatCurrency(selectedTable.currentCost)}</span>
                  </div>
                  {selectedTable.orders.map((order: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{order.item} x{order.quantity}:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">
                      {formatCurrency(selectedTable.currentCost + selectedTable.orders.reduce((sum: number, order: any) => sum + order.total, 0))}
                    </span>
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
                      // Reset table
                      setTables(prev => prev.map(table => 
                        table.id === selectedTable.id 
                          ? { ...table, status: 'available', startTime: null, duration: 0, players: [], currentCost: 0, orders: [] }
                          : table
                      ));
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
