'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Building2,
  Building,
  CreditCard,
  Bell,
  Activity, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Server,
  FileText,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Người dùng', href: '/dashboard/users', icon: Users },
  { name: 'Vai trò & Quyền', href: '/dashboard/roles', icon: Shield },
  { name: 'Doanh nghiệp', href: '/dashboard/enterprises', icon: Building2 },
  { name: 'Loại DN', href: '/dashboard/business-types', icon: Building },
  { name: 'Gói đăng ký', href: '/dashboard/subscriptions', icon: CreditCard },
  { name: 'Thông báo', href: '/dashboard/notifications', icon: Bell },
  { name: 'Tỉ giá tiền tệ', href: '/dashboard/currencies', icon: DollarSign },
  { name: 'Giám sát', href: '/dashboard/monitoring', icon: Activity },
  { name: 'Server', href: '/dashboard/server', icon: Server },
  { name: 'Báo cáo', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Audit Logs', href: '/dashboard/audit', icon: FileText },
  { name: 'Cài đặt', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-800 shadow-lg transition-all duration-300',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl">AdminPro</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              // Special handling for business types to ensure proper navigation
              if (item.href === '/dashboard/business-types') {
                return (
                  <div
                    key={item.name}
                    onClick={() => router.replace(item.href)}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5', collapsed ? 'mr-0' : 'mr-3')} />
                    {!collapsed && <span>{item.name}</span>}
                  </div>
                );
              } else {
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                      )}
                    >
                      <item.icon className={cn('h-5 w-5', collapsed ? 'mr-0' : 'mr-3')} />
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                  </Link>
                );
              }
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900',
                collapsed && 'px-2'
              )}
            >
              <LogOut className={cn('h-5 w-5', collapsed ? 'mr-0' : 'mr-3')} />
              {!collapsed && <span>Đăng xuất</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}