'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  ShoppingCart, 
  Plus, 
  Minus,
  Search,
  Calculator,
  Receipt,
  User,
  Clock,
  DollarSign,
  Package,
  TrendingUp
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';

// Mock data cho sản phẩm
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 29990000,
    category: 'Điện thoại',
    stock: 15,
    barcode: '1234567890123',
    image: '/api/placeholder/100/100'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    price: 22990000,
    category: 'Điện thoại',
    stock: 8,
    barcode: '1234567890124',
    image: '/api/placeholder/100/100'
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    price: 34990000,
    category: 'Laptop',
    stock: 5,
    barcode: '1234567890125',
    image: '/api/placeholder/100/100'
  },
  {
    id: '4',
    name: 'AirPods Pro',
    price: 6990000,
    category: 'Phụ kiện',
    stock: 25,
    barcode: '1234567890126',
    image: '/api/placeholder/100/100'
  },
  {
    id: '5',
    name: 'iPad Pro 12.9"',
    price: 28990000,
    category: 'Tablet',
    stock: 12,
    barcode: '1234567890127',
    image: '/api/placeholder/100/100'
  },
  {
    id: '6',
    name: 'Apple Watch Series 9',
    price: 9990000,
    category: 'Đồng hồ thông minh',
    stock: 18,
    barcode: '1234567890128',
    image: '/api/placeholder/100/100'
  }
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);

  const categories = ['all', 'Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện', 'Đồng hồ thông minh'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          total: product.price
        }];
      }
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
            : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Simulate checkout process
    alert(`Thanh toán thành công!\nTổng tiền: ${formatCurrency(total)}\nPhương thức: ${paymentMethod === 'cash' ? 'Tiền mặt' : 'Thẻ'}`);
    
    // Clear cart after successful checkout
    setCart([]);
    setCustomerInfo('');
    setDiscount(0);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Điểm bán hàng (POS)
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Hệ thống bán hàng tại quầy với giao diện thân thiện và dễ sử dụng
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
                    {formatCurrency(1250000)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Doanh thu hôm nay
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    24
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đơn hàng hôm nay
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {mockProducts.length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Sản phẩm có sẵn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(52000)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Trung bình/đơn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Tìm kiếm sản phẩm hoặc mã vạch..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'Tất cả danh mục' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-blue-600 font-bold text-lg mb-2">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                        Còn {product.stock}
                      </Badge>
                      <span className="text-xs text-slate-500">{product.category}</span>
                    </div>
                    <Button 
                      onClick={() => addToCart(product)}
                      className="w-full"
                      size="sm"
                      disabled={product.stock === 0}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Thêm
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart and Checkout */}
          <div className="space-y-4">
            {/* Customer Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Tên khách hàng hoặc SĐT"
                  value={customerInfo}
                  onChange={(e) => setCustomerInfo(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Cart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Giỏ hàng ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">Giỏ hàng trống</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-blue-600 text-sm">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    
                    {/* Discount */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Giảm giá (%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>

                    <Separator className="my-4" />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tạm tính:</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Giảm giá ({discount}%):</span>
                          <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phương thức thanh toán</label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Tiền mặt</SelectItem>
                          <SelectItem value="card">Thẻ</SelectItem>
                          <SelectItem value="transfer">Chuyển khoản</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Checkout Button */}
                    <Button 
                      onClick={handleCheckout}
                      className="w-full mt-4"
                      size="lg"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Thanh toán {formatCurrency(total)}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
