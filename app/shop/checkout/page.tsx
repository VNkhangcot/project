'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserLayout from '@/components/layout/UserLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  Mail,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

const mockCartItems = [
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
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping info
    fullName: 'Nguyễn Văn A',
    phone: '0123456789',
    email: 'user@shop.com',
    address: '123 Đường ABC',
    ward: 'Phường XYZ',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    note: '',
    
    // Payment method
    paymentMethod: 'cod',
    
    // Shipping method
    shippingMethod: 'standard',
    
    // Promo code
    promoCode: '',
    
    // Agreement
    agreeTerms: false
  });

  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = () => {
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản và điều kiện');
      return;
    }
    
    // Simulate order processing
    setStep(4);
    
    // Redirect to order tracking after 3 seconds
    setTimeout(() => {
      router.push('/shop/orders/ORDER_NEW');
    }, 3000);
  };

  const steps = [
    { id: 1, name: 'Thông tin giao hàng', icon: MapPin },
    { id: 2, name: 'Phương thức thanh toán', icon: CreditCard },
    { id: 3, name: 'Xác nhận đơn hàng', icon: CheckCircle },
    { id: 4, name: 'Hoàn thành', icon: CheckCircle }
  ];

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
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
            <h1 className="text-3xl font-bold">Thanh toán</h1>
            <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => (
                <div key={stepItem.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= stepItem.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <stepItem.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      step >= stepItem.id ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {stepItem.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step > stepItem.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Thông tin giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Nhập email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Số nhà, tên đường"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="ward">Phường/Xã *</Label>
                      <Input
                        id="ward"
                        value={formData.ward}
                        onChange={(e) => handleInputChange('ward', e.target.value)}
                        placeholder="Chọn phường/xã"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">Quận/Huyện *</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="Chọn quận/huyện"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Chọn tỉnh/thành phố"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                    <Textarea
                      id="note"
                      value={formData.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      placeholder="Ghi chú cho đơn hàng..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)}>
                      Tiếp tục
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                            <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                          </div>
                          <Truck className="h-5 w-5 text-gray-400" />
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Chuyển khoản ngân hàng</p>
                            <p className="text-sm text-gray-600">Chuyển khoản qua ATM/Internet Banking</p>
                          </div>
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                      <RadioGroupItem value="credit" id="credit" disabled />
                      <Label htmlFor="credit" className="flex-1 cursor-not-allowed">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Thẻ tín dụng/ghi nợ</p>
                            <p className="text-sm text-gray-600">Visa, Mastercard, JCB (Sắp ra mắt)</p>
                          </div>
                          <Badge variant="secondary">Sắp có</Badge>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  <Separator />
                  
                  <div>
                    <Label>Phương thức vận chuyển</Label>
                    <RadioGroup
                      value={formData.shippingMethod}
                      onValueChange={(value) => handleInputChange('shippingMethod', value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Giao hàng tiêu chuẩn</p>
                              <p className="text-sm text-gray-600">3-5 ngày làm việc</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Giao hàng nhanh</p>
                              <p className="text-sm text-gray-600">1-2 ngày làm việc</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatPrice(50000)}</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Quay lại
                    </Button>
                    <Button onClick={() => setStep(3)}>
                      Tiếp tục
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Confirmation */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Xác nhận đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Info */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Thông tin giao hàng
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">{formData.fullName}</p>
                      <p className="text-sm text-gray-600">{formData.phone}</p>
                      <p className="text-sm text-gray-600">{formData.email}</p>
                      <p className="text-sm text-gray-600">
                        {formData.address}, {formData.ward}, {formData.district}, {formData.city}
                      </p>
                      {formData.note && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Ghi chú:</strong> {formData.note}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Phương thức thanh toán
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">
                        {formData.paymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
                        {formData.paymentMethod === 'bank' && 'Chuyển khoản ngân hàng'}
                        {formData.paymentMethod === 'credit' && 'Thẻ tín dụng/ghi nợ'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formData.shippingMethod === 'standard' && 'Giao hàng tiêu chuẩn (3-5 ngày)'}
                        {formData.shippingMethod === 'express' && 'Giao hàng nhanh (1-2 ngày)'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Terms Agreement */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeTerms', checked)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      Tôi đồng ý với{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Điều khoản và Điều kiện
                      </a>{' '}
                      và{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Chính sách Bảo mật
                      </a>{' '}
                      của ShopPro
                    </Label>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Quay lại
                    </Button>
                    <Button 
                      onClick={handleSubmitOrder}
                      disabled={!formData.agreeTerms}
                      className="gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Đặt hàng
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Order Success */}
            {step === 4 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">
                    Đặt hàng thành công!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-mono font-bold text-lg">#ORDER_NEW</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                    <Clock className="h-4 w-4" />
                    Chuyển hướng đến trang theo dõi đơn hàng trong 3 giây...
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {mockCartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Promo Code */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Mã giảm giá"
                    value={formData.promoCode}
                    onChange={(e) => handleInputChange('promoCode', e.target.value)}
                  />
                  <Button variant="outline" size="sm">
                    Áp dụng
                  </Button>
                </div>
                
                <Separator />
                
                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>
                
                {shippingFee === 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      🎉 Bạn được miễn phí vận chuyển!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
