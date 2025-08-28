'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CreditCard, 
  Warehouse, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell, 
  ChevronDown, 
  ChevronRight,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EnterpriseLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  children?: Array<{
    name: string;
    href: string;
  }>;
}

// Dữ liệu mẫu cho doanh nghiệp
const businesses = [
  { id: 1, name: 'Công ty TNHH ABC', type: 'Công nghệ' },
  { id: 2, name: 'Nhà hàng XYZ', type: 'Ẩm thực' },
  { id: 3, name: 'Cửa hàng thời trang Fashion', type: 'Bán lẻ' }
];

// Các mục điều hướng
const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/enterprise/dashboard', icon: LayoutDashboard },
  { 
    name: 'Quản lý nhân sự', 
    href: '/enterprise/hr', 
    icon: Users,
    children: [
      { name: 'Phòng ban', href: '/enterprise/hr/departments' },
      { name: 'Nhân viên', href: '/enterprise/hr/employees' },
      { name: 'Tuyển dụng', href: '/enterprise/hr/recruitment' },
      { name: 'Chấm công', href: '/enterprise/hr/attendance' }
    ]
  },
  { 
    name: 'Quản lý tài chính', 
    href: '/enterprise/finance', 
    icon: CreditCard,
    children: [
      { name: 'Thu chi', href: '/enterprise/finance/transactions' },
      { name: 'Hóa đơn', href: '/enterprise/finance/invoices' },
      { name: 'Lương thưởng', href: '/enterprise/finance/payroll' },
      { name: 'Báo cáo tài chính', href: '/enterprise/finance/reports' }
    ]
  },
  { 
    name: 'Quản lý kho hàng', 
    href: '/enterprise/inventory', 
    icon: Warehouse,
    children: [
      { name: 'Tồn kho', href: '/enterprise/inventory/stock' },
      { name: 'Nhập kho', href: '/enterprise/inventory/import' },
      { name: 'Xuất kho', href: '/enterprise/inventory/export' },
      { name: 'Kiểm kê', href: '/enterprise/inventory/check' }
    ]
  },
  { 
    name: 'Quản lý bán hàng', 
    href: '/enterprise/sales', 
    icon: CreditCard,
    children: [
      { name: 'Đơn hàng', href: '/enterprise/sales/orders' },
      { name: 'Khách hàng', href: '/enterprise/sales/customers' },
      { name: 'Khuyến mãi', href: '/enterprise/sales/promotions' },
      { name: 'Báo cáo bán hàng', href: '/enterprise/sales/reports' }
    ]
  },
  { 
    name: 'Báo cáo', 
    href: '/enterprise/reports', 
    icon: BarChart3 
  },
  { 
    name: 'Cài đặt', 
    href: '/enterprise/settings', 
    icon: Settings 
  }
];

export default function EnterpriseLayout({ children }: EnterpriseLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState('1');
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('enterpriseUser') || sessionStorage.getItem('enterpriseUser');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (pathname !== '/enterprise/login') {
        // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
        router.push('/enterprise/login');
      }
    };
    
    checkAuth();
  }, [pathname, router]);

  // Auto-expand parent menu when on child page
  useEffect(() => {
    const autoExpandParents = () => {
      const newExpanded: string[] = [];
      
      navigation.forEach(item => {
        if (item.children) {
          const hasActiveChild = item.children.some(child => pathname === child.href);
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
  }, [pathname, expandedItems]);

  const handleLogout = () => {
    localStorage.removeItem('enterpriseUser');
    sessionStorage.removeItem('enterpriseUser');
    router.push('/enterprise/login');
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
    const isActive = pathname === item.href || 
                    (item.children && item.children.some(child => pathname === child.href));
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
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
          {isExpanded && item.children && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map(child => {
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

  // Nếu chưa đăng nhập và không phải trang đăng nhập, không hiển thị layout
  if (!user && pathname !== '/enterprise/login') {
    return null;
  }

  // Nếu là trang đăng nhập, chỉ hiển thị nội dung
  if (pathname === '/enterprise/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/enterprise/dashboard" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">
                  Enterprise
                </span>
              </Link>
            </div>

            {/* Business Selector - Desktop */}
            <div className="hidden md:block flex-1 max-w-xs mx-8">
              <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn doanh nghiệp" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id.toString()}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xs">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {user?.email?.split('@')[0] || 'Người dùng'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Hồ sơ cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Cài đặt
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
              <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn doanh nghiệp" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id.toString()}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="px-4 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
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
