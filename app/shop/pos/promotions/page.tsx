'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tag, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Percent,
  DollarSign,
  ShoppingBag,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Định nghĩa kiểu dữ liệu
interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'free_shipping';
  value: number;
  code?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired' | 'cancelled';
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  applicableProducts?: string[];
  description?: string;
}

// Mock data cho khuyến mãi
const mockPromotions: Promotion[] = [
  {
    id: 'PROMO-001',
    name: 'Giảm giá mùa hè',
    type: 'percentage',
    value: 15,
    code: 'SUMMER15',
    startDate: '01/06/2024',
    endDate: '31/08/2024',
    status: 'scheduled',
    minPurchase: 500000,
    maxDiscount: 200000,
    usageLimit: 1000,
    usageCount: 0,
    description: 'Giảm 15% cho tất cả sản phẩm trong mùa hè 2024'
  },
  {
    id: 'PROMO-002',
    name: 'Khách hàng mới',
    type: 'fixed',
    value: 100000,
    code: 'WELCOME100',
    startDate: '01/01/2024',
    endDate: '31/12/2024',
    status: 'active',
    minPurchase: 300000,
    usageLimit: 1,
    usageCount: 245,
    description: 'Giảm 100.000đ cho đơn hàng đầu tiên của khách hàng mới'
  },
  {
    id: 'PROMO-003',
    name: 'Mua 1 tặng 1',
    type: 'bogo',
    value: 100,
    startDate: '15/01/2024',
    endDate: '15/02/2024',
    status: 'active',
    usageLimit: 500,
    usageCount: 123,
    applicableProducts: ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C'],
    description: 'Mua 1 tặng 1 cho một số sản phẩm chọn lọc'
  },
  {
    id: 'PROMO-004',
    name: 'Miễn phí vận chuyển',
    type: 'free_shipping',
    value: 0,
    code: 'FREESHIP',
    startDate: '01/01/2024',
    endDate: '31/01/2024',
    status: 'expired',
    minPurchase: 200000,
    usageLimit: 2000,
    usageCount: 1856,
    description: 'Miễn phí vận chuyển cho đơn hàng từ 200.000đ'
  },
  {
    id: 'PROMO-005',
    name: 'Giảm giá Black Friday',
    type: 'percentage',
    value: 30,
    code: 'BLACK30',
    startDate: '24/11/2023',
    endDate: '27/11/2023',
    status: 'expired',
    maxDiscount: 500000,
    usageLimit: 5000,
    usageCount: 4328,
    description: 'Giảm 30% cho tất cả sản phẩm trong dịp Black Friday'
  }
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const itemsPerPage = 10;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Lên lịch</Badge>;
      case 'expired':
        return <Badge className="bg-slate-100 text-slate-800">Đã hết hạn</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'Giảm theo %';
      case 'fixed':
        return 'Giảm số tiền cố định';
      case 'bogo':
        return 'Mua 1 tặng 1';
      case 'free_shipping':
        return 'Miễn phí vận chuyển';
      default:
        return 'Không xác định';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="h-4 w-4" />;
      case 'fixed':
        return <DollarSign className="h-4 w-4" />;
      case 'bogo':
        return <ShoppingBag className="h-4 w-4" />;
      case 'free_shipping':
        return <Tag className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const getValueDisplay = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed':
        return formatCurrency(promotion.value);
      case 'bogo':
        return 'Mua 1 tặng 1';
      case 'free_shipping':
        return 'Miễn phí vận chuyển';
      default:
        return '';
    }
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = 
      promotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (promotion.code && promotion.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      promotion.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    const matchesType = typeFilter === 'all' || promotion.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

  // Calculate stats
  const activePromotions = promotions.filter(p => p.status === 'active').length;
  const scheduledPromotions = promotions.filter(p => p.status === 'scheduled').length;
  const expiredPromotions = promotions.filter(p => p.status === 'expired').length;
  const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Tag className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Khuyến mãi
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý chương trình khuyến mãi, mã giảm giá và ưu đãi
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activePromotions}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Lên lịch</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{scheduledPromotions}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Đã hết hạn</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{expiredPromotions}</p>
                </div>
                <div className="bg-slate-100 p-3 rounded-full">
                  <XCircle className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng lượt sử dụng</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalUsage}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm khuyến mãi theo tên, mã..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="scheduled">Lên lịch</option>
              <option value="expired">Đã hết hạn</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <select
              className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả loại</option>
              <option value="percentage">Giảm theo %</option>
              <option value="fixed">Giảm số tiền cố định</option>
              <option value="bogo">Mua 1 tặng 1</option>
              <option value="free_shipping">Miễn phí vận chuyển</option>
            </select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm khuyến mãi
            </Button>
          </div>
        </div>

        {/* Promotions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khuyến mãi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tên khuyến mãi</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Loại</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Giá trị</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Thời gian</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {paginatedPromotions.map((promotion) => (
                    <tr key={promotion.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{promotion.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{promotion.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {promotion.code ? (
                          <Badge variant="outline" className="font-mono">{promotion.code}</Badge>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(promotion.type)}
                          <span>{getTypeLabel(promotion.type)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {getValueDisplay(promotion)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{promotion.startDate} - {promotion.endDate}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(promotion.status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedPromotion(promotion);
                              setShowPromotionDialog(true);
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredPromotions.length === 0 && (
                <div className="py-8 text-center">
                  <Tag className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy khuyến mãi nào</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredPromotions.length)} trong số {filteredPromotions.length} khuyến mãi
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Promotion Detail Dialog */}
        {selectedPromotion && (
          <Dialog open={showPromotionDialog} onOpenChange={setShowPromotionDialog}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Chi tiết khuyến mãi</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết về chương trình khuyến mãi
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Promotion Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{selectedPromotion.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="font-mono">{selectedPromotion.id}</Badge>
                      {getStatusBadge(selectedPromotion.status)}
                    </div>
                  </div>
                  {selectedPromotion.code && (
                    <div className="text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Mã khuyến mãi</p>
                      <Badge variant="outline" className="font-mono text-base">{selectedPromotion.code}</Badge>
                    </div>
                  )}
                </div>
                
                {/* Promotion Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Thông tin khuyến mãi</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Loại khuyến mãi:</span>
                          <span>{getTypeLabel(selectedPromotion.type)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Giá trị:</span>
                          <span className="font-medium">{getValueDisplay(selectedPromotion)}</span>
                        </div>
                        {selectedPromotion.minPurchase && (
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Giá trị tối thiểu:</span>
                            <span>{formatCurrency(selectedPromotion.minPurchase)}</span>
                          </div>
                        )}
                        {selectedPromotion.maxDiscount && (
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Giảm tối đa:</span>
                            <span>{formatCurrency(selectedPromotion.maxDiscount)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedPromotion.description && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Mô tả</h4>
                        <p className="text-sm">{selectedPromotion.description}</p>
                      </div>
                    )}
                    
                    {selectedPromotion.applicableProducts && selectedPromotion.applicableProducts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Áp dụng cho sản phẩm</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedPromotion.applicableProducts.map((product, index) => (
                            <Badge key={index} variant="outline">{product}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Thời gian</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Ngày bắt đầu:</span>
                          <span>{selectedPromotion.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Ngày kết thúc:</span>
                          <span>{selectedPromotion.endDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Giới hạn sử dụng</h4>
                      <div className="space-y-2">
                        {selectedPromotion.usageLimit && (
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Số lượt tối đa:</span>
                            <span>{selectedPromotion.usageLimit}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Đã sử dụng:</span>
                          <span>{selectedPromotion.usageCount}</span>
                        </div>
                        {selectedPromotion.usageLimit && (
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Còn lại:</span>
                            <span>{selectedPromotion.usageLimit - selectedPromotion.usageCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPromotionDialog(false)}>
                  Đóng
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </UserLayout>
  );
}
