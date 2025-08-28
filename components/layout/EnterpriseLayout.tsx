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
  Building2,
  Users,
  BarChart3,
  FileText,
  Settings,
  Briefcase,
  CreditCard,
  ShoppingBag,
  Package,
  Warehouse,
  Calendar,
  MessageSquare,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

// Các mục điều hướng chính
const mainNavigation: NavigationItem[] = [
  { name: 'Tổng quan', href: '/enterprise/dashboard', icon: Home },
  { name: 'Doanh nghiệp', href: '/enterprise/businesses', icon: Building2 },
  { 
    name: 'Nhân sự', 
    href: '/enterprise/hr', 
    icon: Users,
    children: [
      { name: 'Phòng ban', href: '/enterprise/hr/departments' },
      { name: 'Nhân viên', href: '/enterprise/hr/employees' },
      { name: 'Tuyển dụng', href: '/enterprise/hr/recruitment' },
      { name: 'Chấm công', href: '/enterprise/hr/attendance' },
    ]
  },
  { 
    name: 'Tài chính', 
    href: '/enterprise/finance', 
    icon: CreditCard,
    children: [
      { name: 'Thu chi', href: '/enterprise/finance/transactions' },
      { name: 'Hóa đơn', href: '/enterprise/finance/invoices' },
      { name: 'Lương thưởng', href: '/enterprise/finance/payroll' },
      { name: 'Báo cáo', href: '/enterprise/finance/reports' },
    ]
  },
  { 
    name: 'Sản phẩm', 
    href: '/enterprise/products', 
    icon: Package,
    children: [
      { name: 'Danh sách sản phẩm', href: '/enterprise/products/list' },
      { name: 'Danh mục', href: '/enterprise/products/categories' },
      { name: 'Nhà cung cấp', href: '/enterprise/products/suppliers' },
    ]
  },
  { 
    name: 'Kho hàng', 
    href: '/enterprise/inventory', 
    icon: Warehouse,
    children: [
      { name: 'Tồn kho', href: '/enterprise/inventory/stock' },
      { name: 'Nhập kho', href: '/enterprise/inventory/import' },
      { name: 'Xuất kho', href: '/enterprise/inventory/export' },
      { name: 'Kiểm kê', href: '/enterprise/inventory/check' },
    ]
  },
  { 
    name: 'Bán hàng', 
    href: '/enterprise/sales', 
    icon: ShoppingBag,
    children: [
      { name: 'Đơn hàng', href: '/enterprise/sales/orders' },
      { name: 'Khách hàng', href: '/enterprise/sales/customers' },
      { name: 'Khuyến mãi', href: '/enterprise/sales/promotions' },
      { name: 'Báo cáo', href: '/enterprise/sales/reports' },
    ]
  },
  { 
    name: 'Văn phòng', 
    href: '/enterprise/office', 
    icon: Briefcase,
    children: [
      { name: 'Tài liệu', href: '/enterprise/office/documents' },
      { name: 'Lịch làm việc', href: '/enterprise/office/calendar' },
      { name: 'Tin nhắn', href: '/enterprise/office/messages' },
      { name: 'Công việc', href: '/enterprise/office/tasks' },
    ]
  },
  { name: 'Báo cáo', href: '/enterprise/reports', icon: BarChart3 },
  { name: 'Cài đặt', href: '/enterprise/settings', icon: Settings },
];

export default function EnterpriseLayout({ children }: EnterpriseLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<string>(businesses[0].id.toString());
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Auto-expand parent menu when on child page
  useEffect(() => {
    const autoExpandParents = () => {
      const newExpanded: string[] = [];
      
      mainNavigation.forEach(item => {
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
    logout();
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavigationItem = (item: NavigationItem, isMobile = false) => {
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
              isActive || (item.children && item.children.some(child => pathname === child.href))
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

            {/* Business Selector */}
            <div className="hidden md:flex flex-1 max-w-xs mx-8">
              <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn doanh nghiệp" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id.toString()}>
                      {business.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    <div className="flex items-center text-blue-600">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Thêm doanh nghiệp mới
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="pl-10 w-64"
                />
              </div>

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
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.png" alt={user?.name || 'User'} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
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
                    <Link href="/enterprise/profile">
                      <Users className="h-4 w-4 mr-2" />
                      Hồ sơ cá nhân
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/enterprise/businesses">
                      <Building2 className="h-4 w-4 mr-2" />
                      Quản lý doanh nghiệp
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/enterprise/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Cài đặt
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
              <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn doanh nghiệp" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id.toString()}>
                      {business.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    <div className="flex items-center text-blue-600">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Thêm doanh nghiệp mới
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="px-4 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            <nav className="px-4 py-2 space-y-1">
              {mainNavigation.map((item) => renderNavigationItem(item, true))}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:top-16 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {mainNavigation.map((item) => renderNavigationItem(item, false))}
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
