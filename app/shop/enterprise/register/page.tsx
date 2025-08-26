'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserLayout from '@/components/layout/UserLayout';
import EnterpriseDialog from '@/components/enterprises/EnterpriseDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ShieldCheck, Users, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { User, Role } from '@/lib/types';

export default function EnterpriseRegisterPage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSuccess = (_enterprise: any) => {
    try {
      if (user) {
        const nextPermissions = new Set([...(user.role?.permissions || []), 'manage_enterprises', 'manage_subscriptions']);
        const upgradedRole: Role = {
          ...user.role,
          name: user.role?.name?.includes('Enterprise') ? user.role.name : 'Enterprise Owner',
          permissions: Array.from(nextPermissions) as any,
          updatedAt: new Date().toISOString(),
        };

        const upgradedUser: User = {
          ...user,
          role: upgradedRole,
          updatedAt: new Date().toISOString(),
        };

        // Lưu vào localStorage để AuthProvider đọc lại sau reload
        localStorage.setItem('user', JSON.stringify(upgradedUser));
      }

      toast({
        title: 'Đăng ký doanh nghiệp thành công',
        description: 'Tài khoản của bạn đã được nâng cấp lên doanh nghiệp.',
      });

      // Điều hướng tới trang quản trị doanh nghiệp (admin panel có sẵn)
      setTimeout(() => {
        window.location.href = '/dashboard/enterprises';
      }, 800);
    } catch (e) {
      console.error(e);
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể nâng cấp tài khoản. Vui lòng thử lại.',
      });
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Đăng ký doanh nghiệp
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Đăng ký doanh nghiệp để mở khóa các tính năng quản trị nâng cao và quản lý bán hàng chuyên nghiệp.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Quản lý người dùng
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-400">
              Tạo và phân quyền cho nhân viên, giới hạn người dùng theo gói dịch vụ.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Bảo mật &amp; kiểm soát
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-400">
              Theo dõi hoạt động, nhật ký kiểm toán, và thiết lập bảo mật nâng cao.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-600" />
                Nâng cấp gói dịch vụ
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-400">
              Chọn gói phù hợp với nhu cầu: Basic, Premium, hoặc Enterprise.
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-3">
          <Button size="lg" onClick={() => setOpen(true)}>
            Bắt đầu đăng ký
          </Button>
          <Badge variant="secondary">Nhanh chóng • Dễ dùng • Linh hoạt</Badge>
        </div>

        <EnterpriseDialog
          open={open}
          onOpenChange={setOpen}
          enterprise={null}
          onClose={() => setOpen(false)}
          onSuccess={handleSuccess}
        />
      </div>
    </UserLayout>
  );
}
