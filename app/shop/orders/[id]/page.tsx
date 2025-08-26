'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserLayout from '@/components/layout/UserLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  Download,
  MessageCircle,
  Star,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface OrderTrackingProps {
  params: {
    id: string;
  };
}

const mockOrderData = {
  id: 'ORDER_NEW',
  status: 'processing',
  createdAt: '2024-01-15T10:30:00Z',
  estimatedDelivery: '2024-01-18T17:00:00Z',
  total: 30588000,
  paymentMethod: 'COD',
  shippingMethod: 'standard',
  customer: {
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    email: 'user@shop.com',
    address: '123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh'
  },
  items: [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      price: 29990000,
      quantity: 1,
      image: '/api/placeholder/80/80'
    },
    {
      id: '2',
      name: 'Áo sơ mi nam công sở',
      price: 299000,
      quantity: 2,
      image: '/api/placeholder/80/80'
    }
  ],
  tracking: [
    {
      id: '1',
      status: 'confirmed',
      title: 'Đơn hàng đã được xác nhận',
      description: 'Đơn hàng của bạn đã được xác nhận và đang chuẩn bị',
      timestamp: '2024-01-15T10:30:00Z',
      completed: true
    },
    {
      id: '2',
      status: 'processing',
      title: 'Đang chuẩn bị hàng',
      description: 'Chúng tôi đang chuẩn bị sản phẩm cho đơn hàng của bạn',
      timestamp: '2024-01-15T14:20:00Z',
      completed: true
    },
    {
      id: '3',
      status: 'shipped',
      title: 'Đã giao cho đơn vị vận chuyển',
      description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
      timestamp: null,
      completed: false
    },
    {
      id: '4',
      status: 'delivering',
      title: 'Đang giao hàng',
      description: 'Đơn hàng đang trên đường giao đến bạn',
      timestamp: null,
      completed: false
    },
    {
      id: '5',
      status: 'delivered',
      title: 'Đã giao hàng',
      description: 'Đơn hàng đã được giao thành công',
      timestamp: null,
      completed: false
    }
  ]
};

export default function OrderTrackingPage({ params }: OrderTrackingProps) {
  const router = useRouter();
  const [order, setOrder] = useState(mockOrderData);
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivering':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { label: 'Chờ xác nhận', variant: 'secondary' as const },
      'confirmed': { label: 'Đã xác nhận', variant: 'default' as const },
      'processing': { label: 'Đang xử lý', variant: 'default' as const },
      'shipped': { label: 'Đã gửi hàng', variant: 'default' as const },
      'delivering': { label: 'Đang giao hàng', variant: 'default' as const },
      'delivered': { label: 'Đã giao hàng', variant: 'default' as const },
      'cancelled': { label: 'Đã hủy', variant: 'destructive' as const }
    };
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
  };

  const completedSteps = order.tracking.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / order.tracking.length) * 100;

  const refreshTracking = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Theo dõi đơn hàng</h1>
              <p className="text-gray-600">Mã đơn hàng: #{order.id}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={refreshTracking}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Cập nhật
          </Button>
        </div>

        {/* Order Status Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Đơn hàng #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    Đặt hàng lúc {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <Badge {...getOrderStatusBadge(order.status)}>
                  {getOrderStatusBadge(order.status).label}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">
                  Dự kiến giao: {formatDate(order.estimatedDelivery)}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tiến độ giao hàng</span>
                <span>{completedSteps}/{order.tracking.length} bước</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tracking Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Lịch trình giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.tracking.map((step, index) => (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${
                          step.completed ? getStatusColor(step.status) : 'bg-gray-300'
                        }`} />
                        {index < order.tracking.length - 1 && (
                          <div className={`w-0.5 h-12 ${
                            step.completed ? 'bg-blue-300' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium ${
                            step.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </h4>
                          {step.timestamp && (
                            <span className="text-sm text-gray-500">
                              {formatDate(step.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          step.completed ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                        
                        {step.completed && step.status === 'processing' && (
                          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-800">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Đang xử lý - Dự kiến hoàn thành trong 2-4 giờ
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm trong đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image || '/api/placeholder/80/80'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)}/sản phẩm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {order.customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    {order.customer.email}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Địa chỉ giao hàng:</p>
                  <p className="text-sm text-gray-600">{order.customer.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment & Shipping */}
            <Card>
              <CardHeader>
                <CardTitle>Thanh toán & Vận chuyển</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Phương thức thanh toán:</span>
                  <span className="font-medium">
                    {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phương thức vận chuyển:</span>
                  <span className="font-medium">
                    {order.shippingMethod === 'standard' ? 'Giao hàng tiêu chuẩn' : 'Giao hàng nhanh'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Hành động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Tải hóa đơn
                </Button>
                
                <Button variant="outline" className="w-full gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Liên hệ hỗ trợ
                </Button>
                
                {order.status === 'delivered' && (
                  <Button className="w-full gap-2">
                    <Star className="h-4 w-4" />
                    Đánh giá sản phẩm
                  </Button>
                )}
                
                {['pending', 'confirmed'].includes(order.status) && (
                  <Button variant="destructive" className="w-full gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Hủy đơn hàng
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-medium mb-2">Cần hỗ trợ?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>1900 1234</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>support@shoppro.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
