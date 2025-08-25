'use client';

import { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Search, 
  Filter,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  Download
} from 'lucide-react';
import { Order, ShoppingStats } from '@/lib/types';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<ShoppingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Mock orders data
    const mockOrders: Order[] = [
      {
        _id: 'order_1',
        userId: 'user_1',
        items: [
          {
            _id: 'item_1',
            productId: 'prod_1',
            product: {
              _id: 'prod_1',
              name: 'iPhone 15 Pro Max',
              description: 'Điện thoại thông minh cao cấp với chip A17 Pro',
              price: 29990000,
              currency: 'VND',
              images: ['/api/placeholder/300/300'],
              category: 'Điện tử',
              stock: 50,
              enterpriseId: 'ent_1',
              isActive: true,
              specifications: {},
              tags: ['smartphone', 'apple', 'premium'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            quantity: 1,
            price: 29990000,
            currency: 'VND'
          }
        ],
        totalAmount: 29990000,
        currency: 'VND',
        status: 'delivered',
        shippingAddress: {
          street: '123 Đường ABC, Phường XYZ',
          city: 'Hồ Chí Minh',
          state: 'Hồ Chí Minh',
          zipCode: '700000',
          country: 'Việt Nam',
          phone: '0123456789'
        },
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        _id: 'order_2',
        userId: 'user_1',
        items: [
          {
            _id: 'item_2',
            productId: 'prod_3',
            product: {
              _id: 'prod_3',
              name: 'Áo sơ mi nam công sở',
              description: 'Áo sơ mi nam chất liệu cotton cao cấp',
              price: 299000,
              currency: 'VND',
              images: ['/api/placeholder/300/300'],
              category: 'Thời trang',
              stock: 100,
              enterpriseId: 'ent_2',
              isActive: true,
              specifications: {},
              tags: ['shirt', 'men', 'office'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            quantity: 2,
            price: 299000,
            currency: 'VND'
          }
        ],
        totalAmount: 598000,
        currency: 'VND',
        status: 'shipped',
        shippingAddress: {
          street: '123 Đường ABC, Phường XYZ',
          city: 'Hồ Chí Minh',
          state: 'Hồ Chí Minh',
          zipCode: '700000',
          country: 'Việt Nam',
          phone: '0123456789'
        },
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        createdAt: '2024-01-12T00:00:00Z',
        updatedAt: '2024-01-14T00:00:00Z'
      },
      {
        _id: 'order_3',
        userId: 'user_1',
        items: [
          {
            _id: 'item_3',
            productId: 'prod_4',
            product: {
              _id: 'prod_4',
              name: 'Nồi cơm điện Panasonic',
              description: 'Nồi cơm điện 1.8L với công nghệ IH',
              price: 2990000,
              currency: 'VND',
              images: ['/api/placeholder/300/300'],
              category: 'Gia dụng',
              stock: 25,
              enterpriseId: 'ent_3',
              isActive: true,
              specifications: {},
              tags: ['kitchen', 'rice-cooker', 'panasonic'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            quantity: 1,
            price: 2990000,
            currency: 'VND'
          }
        ],
        totalAmount: 2990000,
        currency: 'VND',
        status: 'processing',
        shippingAddress: {
          street: '123 Đường ABC, Phường XYZ',
          city: 'Hồ Chí Minh',
          state: 'Hồ Chí Minh',
          zipCode: '700000',
          country: 'Việt Nam',
          phone: '0123456789'
        },
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        createdAt: '2024-01-14T00:00:00Z',
        updatedAt: '2024-01-14T00:00:00Z'
      }
    ];

    const mockStats: ShoppingStats = {
      totalOrders: mockOrders.length,
      totalSpent: mockOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      currency: 'VND',
      favoriteCategories: [
        { category: 'Điện tử', count: 5 },
        { category: 'Thời trang', count: 3 },
        { category: 'Gia dụng', count: 2 }
      ],
      monthlySpending: [
        { month: '2024-01', amount: 33578000 },
        { month: '2023-12', amount: 2500000 },
        { month: '2023-11', amount: 1800000 }
      ],
      recentOrders: mockOrders.slice(0, 3)
    };

    setOrders(mockOrders);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => 
                           item.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <UserLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </UserLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Đơn hàng của tôi
            </h1>
            <p className="text-slate-500 mt-1">
              Theo dõi và quản lý các đơn hàng của bạn
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stats.totalOrders}
                      </p>
                      <p className="text-sm text-slate-500">Tổng đơn hàng</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {orders.filter(o => o.status === 'delivered').length}
                      </p>
                      <p className="text-sm text-slate-500">Đã giao hàng</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatPrice(stats.totalSpent, stats.currency)}
                      </p>
                      <p className="text-sm text-slate-500">Tổng chi tiêu</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="orders" className="w-full">
            <TabsList>
              <TabsTrigger value="orders">Danh sách đơn hàng</TabsTrigger>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Tìm kiếm đơn hàng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Bộ lọc
                  </Button>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">Không tìm thấy đơn hàng nào</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredOrders.map((order) => (
                    <Card key={order._id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-900 dark:text-white">
                                Đơn hàng #{order._id.slice(-8).toUpperCase()}
                              </h3>
                              <p className="text-sm text-slate-500">
                                Đặt hàng: {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={cn('flex items-center space-x-1', getStatusColor(order.status))}>
                              {getStatusIcon(order.status)}
                              <span>{getStatusText(order.status)}</span>
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Chi tiết
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Order Items */}
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item._id} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.product?.images[0] || '/api/placeholder/300/300'}
                                    alt={item.product?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-slate-900 dark:text-white truncate">
                                    {item.product?.name}
                                  </h4>
                                  <p className="text-sm text-slate-500">
                                    Số lượng: {item.quantity} × {formatPrice(item.price, item.currency)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-slate-900 dark:text-white">
                                    {formatPrice(item.price * item.quantity, item.currency)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Summary */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span>Thanh toán: {order.paymentMethod === 'credit_card' ? 'Thẻ tín dụng' : 
                                                order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'COD'}</span>
                              <span>•</span>
                              <span>{order.items.length} sản phẩm</span>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">
                                {formatPrice(order.totalAmount, order.currency)}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex space-x-2">
                              {order.status === 'delivered' && (
                                <>
                                  <Button size="sm" variant="outline">
                                    <Star className="h-4 w-4 mr-2" />
                                    Đánh giá
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Hỗ trợ
                                  </Button>
                                </>
                              )}
                              {order.status === 'shipped' && (
                                <Button size="sm" variant="outline">
                                  <Truck className="h-4 w-4 mr-2" />
                                  Theo dõi vận chuyển
                                </Button>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Hóa đơn
                              </Button>
                              {(order.status === 'pending' || order.status === 'confirmed') && (
                                <Button size="sm" variant="destructive">
                                  Hủy đơn hàng
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Favorite Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Danh mục yêu thích</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.favoriteCategories.map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-300">
                              {category.category}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ 
                                    width: `${(category.count / Math.max(...stats.favoriteCategories.map(c => c.count))) * 100}%` 
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8 text-right">
                                {category.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Spending */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Chi tiêu theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.monthlySpending.map((month, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-300">
                              {month.month}
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {formatPrice(month.amount, stats.currency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
