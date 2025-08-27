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
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  Printer,
  Send,
  User,
  CupSoda,
  Utensils
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Định nghĩa kiểu dữ liệu
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  note: string;
}

interface Order {
  id: string;
  tableNumber: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  total: number;
}

// Mock data cho menu
const mockMenuItems: MenuItem[] = [
  {
    id: 'item-001',
    name: 'Cà phê đen',
    price: 25000,
    category: 'coffee',
    image: '/images/black-coffee.jpg',
    available: true
  },
  {
    id: 'item-002',
    name: 'Cà phê sữa',
    price: 30000,
    category: 'coffee',
    image: '/images/milk-coffee.jpg',
    available: true
  },
  {
    id: 'item-003',
    name: 'Bạc xỉu',
    price: 35000,
    category: 'coffee',
    image: '/images/bac-xiu.jpg',
    available: true
  },
  {
    id: 'item-004',
    name: 'Trà đào',
    price: 40000,
    category: 'tea',
    image: '/images/peach-tea.jpg',
    available: true
  },
  {
    id: 'item-005',
    name: 'Trà sữa trân châu',
    price: 45000,
    category: 'tea',
    image: '/images/bubble-tea.jpg',
    available: true
  },
  {
    id: 'item-006',
    name: 'Sinh tố xoài',
    price: 40000,
    category: 'smoothie',
    image: '/images/mango-smoothie.jpg',
    available: true
  }
];

// Mock data cho đơn hàng
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    tableNumber: 'Bàn 1',
    items: [
      { id: 'oi-001', menuItemId: 'item-001', name: 'Cà phê đen', price: 25000, quantity: 2, note: 'Ít đường' },
      { id: 'oi-002', menuItemId: 'item-008', name: 'Bánh flan', price: 25000, quantity: 1, note: '' }
    ],
    status: 'preparing',
    createdAt: '10:15 AM, 15/01/2024',
    updatedAt: '10:20 AM, 15/01/2024',
    total: 75000
  },
  {
    id: 'ORD-002',
    tableNumber: 'Bàn 3',
    items: [
      { id: 'oi-003', menuItemId: 'item-004', name: 'Trà đào', price: 40000, quantity: 3, note: 'Ít đá' },
      { id: 'oi-004', menuItemId: 'item-010', name: 'Mì xào hải sản', price: 65000, quantity: 1, note: 'Không hành' }
    ],
    status: 'ready',
    createdAt: '09:45 AM, 15/01/2024',
    updatedAt: '10:05 AM, 15/01/2024',
    total: 185000
  },
  {
    id: 'ORD-003',
    tableNumber: 'Bàn 5',
    items: [
      { id: 'oi-005', menuItemId: 'item-002', name: 'Cà phê sữa', price: 30000, quantity: 2, note: '' },
      { id: 'oi-006', menuItemId: 'item-006', name: 'Sinh tố xoài', price: 40000, quantity: 1, note: 'Không đường' }
    ],
    status: 'pending',
    createdAt: '10:30 AM, 15/01/2024',
    updatedAt: '10:30 AM, 15/01/2024',
    total: 100000
  }
];

export default function CafeOrdersPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
      case 'preparing':
        return <Badge className="bg-blue-100 text-blue-800">Đang chuẩn bị</Badge>;
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Sẵn sàng phục vụ</Badge>;
      case 'completed':
        return <Badge className="bg-slate-100 text-slate-800">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing':
        return <Coffee className="h-5 w-5 text-blue-500" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-slate-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-slate-500" />;
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus, 
            updatedAt: new Date().toLocaleString('vi-VN') 
          } 
        : order
    ));

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        updatedAt: new Date().toLocaleString('vi-VN')
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab !== 'all' && order.status !== activeTab) {
      return false;
    }

    if (searchQuery) {
      return (
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return true;
  });

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Đặt món
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý đơn hàng và đặt món cho quán cafe
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo đơn mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tạo đơn hàng mới</DialogTitle>
                <DialogDescription>
                  Chức năng này sẽ được phát triển trong phiên bản tiếp theo.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Đóng</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
            <TabsTrigger value="preparing">Đang chuẩn bị</TabsTrigger>
            <TabsTrigger value="ready">Sẵn sàng</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.tableNumber}</CardTitle>
                        <CardDescription>
                          {order.id} • {order.createdAt}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm text-slate-500">Món đặt:</div>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between font-medium">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{formatCurrency(order.total)}</span>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      {order.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                          >
                            <Coffee className="h-4 w-4 mr-1" />
                            Chuẩn bị
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Hủy
                          </Button>
                        </>
                      )}
                      
                      {order.status === 'preparing' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Sẵn sàng
                        </Button>
                      )}
                      
                      {order.status === 'ready' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Hoàn thành
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetailsDialog(true);
                        }}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="py-8 text-center">
                <Coffee className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">Không tìm thấy đơn hàng nào</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Order Details Dialog */}
        {selectedOrder && (
          <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Chi tiết đơn hàng #{selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  {selectedOrder.tableNumber} • {selectedOrder.createdAt}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedOrder.status)}
                  <span className="font-medium">
                    {selectedOrder.status === 'pending' ? 'Chờ xử lý' : 
                     selectedOrder.status === 'preparing' ? 'Đang chuẩn bị' : 
                     selectedOrder.status === 'ready' ? 'Sẵn sàng phục vụ' : 
                     selectedOrder.status === 'completed' ? 'Hoàn thành' : 
                     selectedOrder.status === 'cancelled' ? 'Đã hủy' : 'Không xác định'}
                  </span>
                </div>
                
                <div className="border-t border-b py-4 space-y-2">
                  <div className="text-sm font-medium">Danh sách món:</div>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1">
                      <div>
                        <div className="font-medium">{item.name} x{item.quantity}</div>
                        {item.note && <div className="text-xs text-slate-500 italic">{item.note}</div>}
                      </div>
                      <div>{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{formatCurrency(selectedOrder.total)}</span>
                </div>
                
                <div className="text-sm text-slate-500">
                  <div>Tạo lúc: {selectedOrder.createdAt}</div>
                  <div>Cập nhật: {selectedOrder.updatedAt}</div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowOrderDetailsDialog(false)}>Đóng</Button>
                <Button>
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
