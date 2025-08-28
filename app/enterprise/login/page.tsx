'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Lock, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Tài khoản mẫu
const TEST_ACCOUNTS = [
  { email: 'admin@example.com', password: 'Admin@123', role: 'admin' },
  { email: 'owner@example.com', password: 'Owner@123', role: 'owner' },
  { email: 'manager@example.com', password: 'Manager@123', role: 'manager' },
  { email: 'employee@example.com', password: 'Employee@123', role: 'employee' }
];

export default function EnterpriseLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Kiểm tra tài khoản
    const account = TEST_ACCOUNTS.find(
      acc => acc.email === email && acc.password === password
    );

    setTimeout(() => {
      if (account) {
        // Lưu thông tin đăng nhập vào localStorage
        if (rememberMe) {
          localStorage.setItem('enterpriseUser', JSON.stringify({
            email: account.email,
            role: account.role
          }));
        } else {
          sessionStorage.setItem('enterpriseUser', JSON.stringify({
            email: account.email,
            role: account.role
          }));
        }
        
        // Chuyển hướng đến trang dashboard
        router.push('/enterprise/dashboard');
      } else {
        setError('Email hoặc mật khẩu không đúng');
        setLoading(false);
      }
    }, 1000);
  };

  // Tự động điền thông tin tài khoản khi chọn
  const fillTestAccount = (accountIndex: number) => {
    const account = TEST_ACCOUNTS[accountIndex];
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Đăng nhập Doanh nghiệp</CardTitle>
          <CardDescription className="text-center">
            Nhập thông tin đăng nhập để truy cập vào hệ thống quản lý doanh nghiệp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Ghi nhớ đăng nhập
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
          
          <div className="space-y-2 pt-2">
            <p className="text-sm text-center text-muted-foreground">Tài khoản test</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => fillTestAccount(0)}>
                Admin
              </Button>
              <Button variant="outline" size="sm" onClick={() => fillTestAccount(1)}>
                Chủ doanh nghiệp
              </Button>
              <Button variant="outline" size="sm" onClick={() => fillTestAccount(2)}>
                Quản lý
              </Button>
              <Button variant="outline" size="sm" onClick={() => fillTestAccount(3)}>
                Nhân viên
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Chưa có tài khoản doanh nghiệp?{' '}
            <Link href="/shop/enterprise/register" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
              Đăng ký ngay
            </Link>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Điều khoản dịch vụ
            </Link>{' '}
            và{' '}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Chính sách bảo mật
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
