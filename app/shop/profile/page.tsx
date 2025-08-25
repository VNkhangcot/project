'use client';

import { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Bell,
  Shield,
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import { UserProfile, Address } from '@/lib/types';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    // Mock profile data
    const mockProfile: UserProfile = {
      _id: 'profile_1',
      userId: user?._id || 'user_1',
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      phone: '0123456789',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      avatar: '/api/placeholder/150/150',
      addresses: [
        {
          street: '123 Đường ABC, Phường XYZ',
          city: 'Hồ Chí Minh',
          state: 'Hồ Chí Minh',
          zipCode: '700000',
          country: 'Việt Nam',
          phone: '0123456789'
        },
        {
          street: '456 Đường DEF, Phường GHI',
          city: 'Hà Nội',
          state: 'Hà Nội',
          zipCode: '100000',
          country: 'Việt Nam',
          phone: '0987654321'
        }
      ],
      preferences: {
        language: 'vi',
        currency: 'VND',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProfile(mockProfile);
    setLoading(false);
  }, [user]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile saved:', profile);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Việt Nam',
      phone: ''
    });
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address, index: number) => {
    setEditingAddress({ ...address, index } as Address & { index: number });
    setShowAddressForm(true);
  };

  const handleSaveAddress = () => {
    if (!profile || !editingAddress) return;

    const updatedAddresses = [...profile.addresses];
    const addressIndex = (editingAddress as any).index;

    if (typeof addressIndex === 'number') {
      // Edit existing address
      updatedAddresses[addressIndex] = editingAddress;
    } else {
      // Add new address
      updatedAddresses.push(editingAddress);
    }

    setProfile({
      ...profile,
      addresses: updatedAddresses
    });

    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (index: number) => {
    if (!profile) return;

    const updatedAddresses = profile.addresses.filter((_, i) => i !== index);
    setProfile({
      ...profile,
      addresses: updatedAddresses
    });
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

  if (!profile) {
    return (
      <ProtectedRoute>
        <UserLayout>
          <div className="text-center py-12">
            <p className="text-slate-500">Không thể tải thông tin hồ sơ</p>
          </div>
        </UserLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Hồ sơ cá nhân
              </h1>
              <p className="text-slate-500 mt-1">
                Quản lý thông tin cá nhân và cài đặt tài khoản
              </p>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
              <TabsTrigger value="preferences">Cài đặt</TabsTrigger>
              <TabsTrigger value="security">Bảo mật</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-slate-100 rounded-full overflow-hidden">
                        <img
                          src={profile.avatar || '/api/placeholder/150/150'}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        Ảnh đại diện
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Tải lên ảnh đại diện của bạn. Định dạng JPG, PNG. Tối đa 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({
                          ...profile,
                          firstName: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({
                          ...profile,
                          lastName: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-slate-50"
                      />
                      <p className="text-xs text-slate-500">
                        Email không thể thay đổi
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({
                          ...profile,
                          phone: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profile.dateOfBirth || ''}
                        onChange={(e) => setProfile({
                          ...profile,
                          dateOfBirth: e.target.value
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Giới tính</Label>
                      <select
                        id="gender"
                        value={profile.gender || ''}
                        onChange={(e) => setProfile({
                          ...profile,
                          gender: e.target.value as 'male' | 'female' | 'other'
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses */}
            <TabsContent value="addresses" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Địa chỉ giao hàng</CardTitle>
                  <Button onClick={handleAddAddress}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm địa chỉ
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">Chưa có địa chỉ nào</p>
                    </div>
                  ) : (
                    profile.addresses.map((address, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              <span className="font-medium">Địa chỉ {index + 1}</span>
                              {index === 0 && (
                                <Badge variant="secondary">Mặc định</Badge>
                              )}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300">
                              {address.street}
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                              {address.country}
                            </p>
                            {address.phone && (
                              <div className="flex items-center space-x-2 mt-2">
                                <Phone className="h-3 w-3 text-slate-400" />
                                <span className="text-sm text-slate-500">
                                  {address.phone}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditAddress(address, index)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAddress(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Address Form */}
                  {showAddressForm && editingAddress && (
                    <Card className="border-2 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {(editingAddress as any).index !== undefined ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="street">Địa chỉ</Label>
                          <Textarea
                            id="street"
                            value={editingAddress.street}
                            onChange={(e) => setEditingAddress({
                              ...editingAddress,
                              street: e.target.value
                            })}
                            placeholder="Số nhà, tên đường, phường/xã"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">Thành phố</Label>
                            <Input
                              id="city"
                              value={editingAddress.city}
                              onChange={(e) => setEditingAddress({
                                ...editingAddress,
                                city: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">Tỉnh/Thành</Label>
                            <Input
                              id="state"
                              value={editingAddress.state}
                              onChange={(e) => setEditingAddress({
                                ...editingAddress,
                                state: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">Mã bưu điện</Label>
                            <Input
                              id="zipCode"
                              value={editingAddress.zipCode}
                              onChange={(e) => setEditingAddress({
                                ...editingAddress,
                                zipCode: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="addressPhone">Số điện thoại</Label>
                            <Input
                              id="addressPhone"
                              value={editingAddress.phone || ''}
                              onChange={(e) => setEditingAddress({
                                ...editingAddress,
                                phone: e.target.value
                              })}
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveAddress}>
                            Lưu địa chỉ
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAddressForm(false);
                              setEditingAddress(null);
                            }}
                          >
                            Hủy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Ngôn ngữ</Label>
                      <select
                        id="language"
                        value={profile.preferences.language}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            language: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Tiền tệ</Label>
                      <select
                        id="currency"
                        value={profile.preferences.currency}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            currency: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="VND">VND (₫)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Thông báo
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-slate-500">
                              Nhận thông báo qua email
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications.email}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              notifications: {
                                ...profile.preferences.notifications,
                                email: checked
                              }
                            }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="font-medium">SMS</p>
                            <p className="text-sm text-slate-500">
                              Nhận thông báo qua tin nhắn
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications.sms}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              notifications: {
                                ...profile.preferences.notifications,
                                sms: checked
                              }
                            }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="font-medium">Push notification</p>
                            <p className="text-sm text-slate-500">
                              Nhận thông báo đẩy trên trình duyệt
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications.push}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              notifications: {
                                ...profile.preferences.notifications,
                                push: checked
                              }
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bảo mật tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Mật khẩu</p>
                          <p className="text-sm text-slate-500">
                            Thay đổi mật khẩu định kỳ để bảo mật tài khoản
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">
                        Đổi mật khẩu
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Xác thực 2 bước</p>
                          <p className="text-sm text-slate-500">
                            Tăng cường bảo mật với xác thực 2 bước
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">
                        Kích hoạt
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Phương thức thanh toán</p>
                          <p className="text-sm text-slate-500">
                            Quản lý thẻ và phương thức thanh toán
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">
                        Quản lý
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
