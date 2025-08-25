'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Shield, User, Settings, Edit, ShoppingCart } from 'lucide-react';

// Sample accounts data
const sampleAccounts = {
  admin: [
    {
      email: 'admin@company.com',
      password: 'admin123',
      name: 'Admin',
      role: 'Quản trị viên',
      description: 'Toàn quyền quản trị hệ thống',
      icon: Shield,
      badge: 'Admin',
      badgeVariant: 'destructive' as const,
      access: 'Dashboard quản trị'
    },
    {
      email: 'manager@company.com',
      password: 'manager123',
      name: 'Manager',
      role: 'Quản lý',
      description: 'Quản lý hoạt động và báo cáo',
      icon: Settings,
      badge: 'Manager',
      badgeVariant: 'secondary' as const,
      access: 'Dashboard quản lý'
    },
    {
      email: 'user@company.com',
      password: 'user123',
      name: 'User',
      role: 'Người dùng',
      description: 'Quyền xem cơ bản',
      icon: User,
      badge: 'User',
      badgeVariant: 'outline' as const,
      access: 'Dashboard cơ bản'
    },
    {
      email: 'editor@company.com',
      password: 'editor123',
      name: 'Editor',
      role: 'Biên tập viên',
      description: 'Chỉnh sửa nội dung',
      icon: Edit,
      badge: 'Editor',
      badgeVariant: 'secondary' as const,
      access: 'Dashboard chỉnh sửa'
    }
  ],
  customer: [
    {
      email: 'user@shop.com',
      password: 'user123',
      name: 'Customer',
      role: 'Khách hàng',
      description: 'Mua sắm và đặt hàng',
      icon: ShoppingCart,
      badge: 'Customer',
      badgeVariant: 'default' as const,
      access: 'Giao diện mua sắm'
    }
  ]
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  // Quick fill function
  const handleQuickFill = (accountEmail: string, accountPassword: string) => {
    setEmail(accountEmail);
    setPassword(accountPassword);
    setError(''); // Clear any existing errors
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      
      // Chuyển hướng dựa trên loại tài khoản
      if (email === 'user@shop.com') {
        router.push('/shop');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Hệ thống quản trị</CardTitle>
          <CardDescription>
            Đăng nhập vào tài khoản quản trị của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            {/* Admin Accounts Section */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Tài khoản quản trị
              </h4>
              <div className="grid gap-2">
                {sampleAccounts.admin.map((account, index) => {
                  const IconComponent = account.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className="h-auto p-3 justify-start text-left hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => handleQuickFill(account.email, account.password)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <IconComponent className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{account.name}</span>
                            <Badge variant={account.badgeVariant} className="text-xs">
                              {account.badge}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {account.email}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {account.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Customer Account Section */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Tài khoản khách hàng
              </h4>
              <div className="grid gap-2">
                {sampleAccounts.customer.map((account, index) => {
                  const IconComponent = account.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className="h-auto p-3 justify-start text-left hover:bg-blue-100 dark:hover:bg-blue-800/30"
                      onClick={() => handleQuickFill(account.email, account.password)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{account.name}</span>
                            <Badge variant={account.badgeVariant} className="text-xs">
                              {account.badge}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {account.email}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {account.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Quick Info */}
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-xs text-amber-800 dark:text-amber-200 text-center">
                💡 Nhấp vào tài khoản bất kỳ để tự động điền thông tin đăng nhập
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}