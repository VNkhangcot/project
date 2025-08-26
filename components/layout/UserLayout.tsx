'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  Package,
  Building2,
  ShoppingBag, 
  ShoppingCart, 
  User, 
  Heart,
  Search,
  Menu,
  X,
  LogOut,
  BarChart3,
  Star,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Users,
  CreditCard,
  Store,
  Warehouse,
  Coffee,
  Gamepad2
} from 'lucide-react';
import NotificationPopup from '@/components/notifications/NotificationPopup';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface UserLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Trang chủ', href: '/shop', icon: Home },
  { name: 'Sản phẩm', href: '/shop/products', icon: Package },
  { 
    name: 'Tìm việc', 
    href: '/shop/jobs', 
    icon: Briefcase,
    children: [
      { name: 'Danh sách việc làm', href: '/shop/jobs' },
      { name: 'Đơn ứng tuyển', href: '/shop/jobs/applications' }
    ]
  },
  {
    name: 'Không gian làm việc',
    href: '/shop/workspace',
    icon: Users,
    children: [
      { name: 'Tổng quan', href: '/shop/workspace' },
      { name: 'Quản lý công việc', href: '/shop/workspace/tasks' },
      { name: 'Báo cáo', href: '/shop/workspace/reports' },
      { name: 'Nhân viên', href: '/shop/workspace/employees' },
      { name: 'Tài liệu', href: '/shop/workspace/documents' },
      { name: 'Lịch làm việc', href: '/shop/workspace/calendar' },
      { name: 'Tin nhắn', href: '/shop/workspace/messages' }
    ]
  },
  {
    name: 'POS & Bán hàng',
    href: '/shop/pos',
    icon: CreditCard,
    children: [
      { name: 'Điểm bán hàng (POS)', href: '/shop/pos' },
      { name: 'Quản lý bán hàng', href: '/shop/pos/sales' },
      { name: 'Hóa đơn & Thanh toán', href: '/shop/pos/invoices' },
      { name: 'Khách hàng', href: '/shop/pos/customers' },
      { name: 'Khuyến mãi', href: '/shop/pos/promotions' }
    ]
  },
  {
    name: 'Quản lý kho',
    href: '/shop/inventory',
    icon: Warehouse,
    children: [
      { name: 'Tồn kho', href: '/shop/inventory' },
      { name: 'Nhập kho', href: '/shop/inventory/import' },
      { name: 'Xuất kho', href: '/shop/inventory/export' },
      { name: 'Kiểm kê', href: '/shop/inventory/stocktake' },
      { name: 'Báo cáo kho', href: '/shop/inventory/reports' }
    ]
  },
  {
    name: 'Quán Bida',
    href: '/shop/billiards',
    icon: Gamepad2,
    children: [
      { name: 'Quản lý bàn', href: '/shop/billiards' },
      { name: 'Menu & Đồ uống', href: '/shop/billiards/menu' },
      { name: 'Tính tiền', href: '/shop/billiards/billing' },
      { name: 'Lịch sử chơi', href: '/shop/billiards/history' },
      { name: 'Báo cáo doanh thu', href: '/shop/billiards/reports' }
    ]
  },
  {
    name: 'Quán Cafe',
    href: '/shop/cafe',
    icon: Coffee,
    children: [
      { name: 'Quản lý bàn', href: '/shop/cafe' },
      { name: 'Menu & Thức uống', href: '/shop/cafe/menu' },
      { name: 'Đặt món', href: '/shop/cafe/orders' },
      { name: 'Thanh toán', href: '/shop/cafe/billing' },
      { name: 'Báo cáo bán hàng', href: '/shop/cafe/reports' }
    ]
  },
  { name: 'Đơn hàng', href: '/shop/orders', icon: BarChart3 },
  { name: 'Yêu thích', href: '/shop/wishlist', icon: Heart },
  { name: 'Đánh giá', href: '/shop/reviews', icon: Star },
  { name: 'Đăng ký doanh nghiệp', href: '/shop/enterprise/register', icon: Building2 },
  { name: 'Hồ sơ', href: '/shop/profile', icon: User },
];

export default function UserLayout({ children }: UserLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Auto-expand parent menu when on child page
  useEffect(() => {
    const autoExpandParents = () => {
      const newExpanded: string[] = [];
      
      navigation.forEach(item => {
        if (item.children) {
          const hasActiveChild = item.children.some((child: any) => pathname === child.href);
          if (hasActiveChild && !expandedItems.includes(item.name)) {
            newExpanded.push(item.name);
          }
        }
      });
      
      if (newExpanded.length > 0) {
        setExpandedItems(prev => [...prev, ...newExpanded]);
      }
    };

    autoExpandParents();
  }, [pathname]);

  const handleLogout = () => {
    logout();
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavigationItem = (item: any, isMobile = false) => {
    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive || item.children.some((child: any) => pathname === child.href)
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
            )}
          >
            <div className="flex items-center">
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map((child: any) => {
                const childIsActive = pathname === child.href;
                return (
                  <Link
                    key={child.name}
                    href={child.href}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      childIsActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-100'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                    )}
                    onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
                  >
                    {child.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
        )}
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      >
        <item.icon className="h-5 w-5 mr-3" />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/shop" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">
                  ShopPro
                </span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/shop/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </Link>

              {/* Notifications */}
              <NotificationPopup />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {user?.name || 'Người dùng'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/shop/profile">
                      <User className="h-4 w-4 mr-2" />
                      Hồ sơ cá nhân
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shop/orders">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Đơn hàng của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shop/wishlist">
                      <Heart className="h-4 w-4 mr-2" />
                      Danh sách yêu thích
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700">
            <div className="px-4 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            <nav className="px-4 py-2 space-y-1">
              {navigation.map((item) => renderNavigationItem(item, true))}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:top-16 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => renderNavigationItem(item, false))}
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 md:ml-64 pt-16">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
