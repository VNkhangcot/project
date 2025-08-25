'use client';

import { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft,
  CreditCard,
  Truck,
  Shield
} from 'lucide-react';
import { CartItem, Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // Mock cart data
    const mockCartItems: CartItem[] = [
      {
        _id: 'cart_1',
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
      },
      {
        _id: 'cart_2',
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
    ];

    setCartItems(mockCartItems);
    setLoading(false);
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(items =>
      items.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item._id !== itemId));
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === 'discount10') {
      setDiscount(0.1); // 10% discount
    } else if (promoCode.toLowerCase() === 'save50k') {
      setDiscount(50000); // 50k VND discount
    } else {
      setDiscount(0);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD'
    }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = typeof discount === 'number' && discount < 1 
    ? subtotal * discount 
    : discount;
  const shipping = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k
  const total = subtotal - discountAmount + shipping;

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

  if (cartItems.length === 0) {
    return (
      <ProtectedRoute>
        <UserLayout>
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <ShoppingCart className="h-24 w-24 text-slate-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Giỏ hàng trống
              </h2>
              <p className="text-slate-500 mb-8">
                Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
              </p>
              <Link href="/shop">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Giỏ hàng
              </h1>
              <p className="text-slate-500 mt-1">
                {cartItems.length} sản phẩm trong giỏ hàng
              </p>
            </div>
            <Link href="/shop">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm trong giỏ hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex space-x-4 p-4 border rounded-lg">
                      <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product?.images[0] || '/api/placeholder/300/300'}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 dark:text-white truncate">
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {item.product?.category}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-bold text-blue-600">
                            {formatPrice(item.price, item.currency)}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={item.quantity >= (item.product?.stock || 0)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(item._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Mã giảm giá</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nhập mã giảm giá"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={applyPromoCode} variant="outline">
                      Áp dụng
                    </Button>
                  </div>
                  {discount > 0 && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✓ Mã giảm giá đã được áp dụng! 
                        Tiết kiệm {formatPrice(discountAmount, 'VND')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(subtotal, 'VND')}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatPrice(discountAmount, 'VND')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'Miễn phí' : formatPrice(shipping, 'VND')}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatPrice(total, 'VND')}</span>
                  </div>
                  
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/shop/checkout">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Thanh toán
                    </Link>
                  </Button>
                  
                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <span>Giao hàng miễn phí cho đơn hàng trên 500k</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Thanh toán an toàn và bảo mật</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Có thể bạn quan tâm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex space-x-3 p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src="/api/placeholder/300/300"
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          Sản phẩm gợi ý {i}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatPrice(199000 * i, 'VND')}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
