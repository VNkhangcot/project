'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Warehouse, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Package,
  ClipboardCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  User,
  AlertTriangle
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
import { Progress } from '@/components/ui/progress';

// Định nghĩa kiểu dữ liệu
interface StocktakeItem {
  id: string;
  productId: string;
  productName: string;
  expectedQuantity: number;
  actualQuantity: number;
  difference: number;
  notes?: string;
  status: 'pending' | 'counted' | 'adjusted';
}

interface Stocktake {
  id: string;
  name: string;
  date: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  location: string;
  items: StocktakeItem[];
  totalItems: number;
  countedItems: number;
  discrepancies: number;
  createdBy: string;
  completedBy?: string;
  completedDate?: string;
  notes?: string;
}

// Mock data cho kiểm kê
const mockStocktakes: Stocktake[] = [
  {
    id: 'STK-001',
    name: 'Kiểm kê tháng 1/2024',
    date: '15/01/2024',
    status: 'completed',
    location: 'Kho chính',
    items: [
      {
        id: 'ITEM-001',
        productId: 'PRD-001',
        productName: 'Sản phẩm A',
        expectedQuantity: 100,
        actualQuantity: 98,
        difference: -2,
        notes: 'Có thể bị hư hỏng hoặc thất lạc',
        status: 'adjusted'
      },
      {
        id: 'ITEM-002',
        productId: 'PRD-002',
        productName: 'Sản phẩm B',
        expectedQuantity: 50,
        actualQuantity: 50,
        difference: 0,
        status: 'counted'
      }
    ],
    totalItems: 2,
    countedItems: 2,
    discrepancies: 1,
    createdBy: 'Nguyễn Văn A',
    completedBy: 'Trần Thị B',
    completedDate: '16/01/2024',
    notes: 'Kiểm kê định kỳ tháng 1/2024'
  },
  {
    id: 'STK-002',
    name: 'Kiểm kê kho phụ',
    date: '10/01/2024',
    status: 'in_progress',
    location: 'Kho phụ',
    items: [
      {
        id: 'ITEM-003',
        productId: 'PRD-003',
        productName: 'Sản phẩm C',
        expectedQuantity: 75,
        actualQuantity: 70,
        difference: -5,
        status: 'counted'
      }
    ],
    totalItems: 1,
    countedItems: 1,
    discrepancies: 1,
    createdBy: 'Nguyễn Văn A'
  }
];

export default function StocktakePage() {
  const [stocktakes, setStocktakes] = useState<Stocktake[]>(mockStocktakes);
  const [selectedStocktake, setSelectedStocktake] = useState<Stocktake | null>(null);
  const [showStocktakeDialog, setShowStocktakeDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-slate-100 text-slate-800">Nháp</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">Đang thực hiện</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getItemStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-slate-100 text-slate-800">Chưa đếm</Badge>;
      case 'counted':
        return <Badge className="bg-blue-100 text-blue-800">Đã đếm</Badge>;
      case 'adjusted':
        return <Badge className="bg-orange-100 text-orange-800">Đã điều chỉnh</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getDifferenceDisplay = (difference: number) => {
    if (difference === 0) {
      return <span className="text-green-600">0</span>;
    } else if (difference > 0) {
      return <span className="text-blue-600">+{difference}</span>;
    } else {
      return <span className="text-red-600">{difference}</span>;
    }
  };

  const getCompletionPercentage = (stocktake: Stocktake) => {
    if (stocktake.totalItems === 0) return 0;
    return Math.round((stocktake.countedItems / stocktake.totalItems) * 100);
  };

  const filteredStocktakes = stocktakes.filter(stocktake => {
    const matchesSearch = 
      stocktake.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stocktake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stocktake.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || stocktake.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedStocktakes = filteredStocktakes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredStocktakes.length / itemsPerPage);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Kiểm kê kho
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý và thực hiện kiểm kê hàng hóa trong kho
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng số đợt kiểm kê</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stocktakes.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ClipboardCheck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Đã hoàn thành</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{filteredStocktakes.filter(s => s.status === 'completed').length}</p>
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
                  <p className="text-sm text-slate-500 dark:text-slate-400">Đang thực hiện</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{filteredStocktakes.filter(s => s.status === 'in_progress').length}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng số chênh lệch</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{filteredStocktakes.reduce((sum, s) => sum + s.discrepancies, 0)}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
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
              placeholder="Tìm kiếm đợt kiểm kê theo mã, tên, vị trí..."
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
              <option value="draft">Nháp</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo đợt kiểm kê mới
            </Button>
          </div>
        </div>

        {/* Stocktakes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đợt kiểm kê</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã đợt</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tên đợt kiểm kê</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày tạo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Vị trí</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Tiến độ</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {paginatedStocktakes.map((stocktake) => (
                    <tr key={stocktake.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {stocktake.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {stocktake.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {stocktake.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {stocktake.location}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-full">
                            <Progress value={getCompletionPercentage(stocktake)} className="h-2" />
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {stocktake.countedItems}/{stocktake.totalItems} ({getCompletionPercentage(stocktake)}%)
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(stocktake.status)}
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
                              setSelectedStocktake(stocktake);
                              setShowStocktakeDialog(true);
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {(stocktake.status === 'draft' || stocktake.status === 'in_progress') && (
                              <>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ClipboardCheck className="h-4 w-4 mr-2" />
                                  Tiếp tục kiểm kê
                                </DropdownMenuItem>
                                {stocktake.status === 'in_progress' && stocktake.countedItems === stocktake.totalItems && (
                                  <DropdownMenuItem>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Hoàn thành kiểm kê
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Hủy kiểm kê
                                </DropdownMenuItem>
                              </>
                            )}
                            {stocktake.status === 'completed' && (
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Xuất báo cáo
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredStocktakes.length === 0 && (
                <div className="py-8 text-center">
                  <ClipboardCheck className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy đợt kiểm kê nào</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredStocktakes.length)} trong số {filteredStocktakes.length} đợt kiểm kê
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

        {/* Stocktake Detail Dialog */}
        {selectedStocktake && (
          <Dialog open={showStocktakeDialog} onOpenChange={setShowStocktakeDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Chi tiết đợt kiểm kê</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết về đợt kiểm kê {selectedStocktake.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Stocktake Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold">{selectedStocktake.name}</h3>
                      {getStatusBadge(selectedStocktake.status)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Mã đợt: {selectedStocktake.id}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ngày tạo: {selectedStocktake.date}
                    </p>
                    {selectedStocktake.completedDate && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Ngày hoàn thành: {selectedStocktake.completedDate}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <p className="text-sm font-medium">Tiến độ kiểm kê:</p>
                    <div className="mt-2">
                      <Progress value={getCompletionPercentage(selectedStocktake)} className="h-2" />
                    </div>
                    <p className="text-sm mt-1">
                      {selectedStocktake.countedItems}/{selectedStocktake.totalItems} sản phẩm ({getCompletionPercentage(selectedStocktake)}%)
                    </p>
                  </div>
                </div>
                
                {/* Stocktake Items */}
                {selectedStocktake.items.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Danh sách sản phẩm</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-700">
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Mã SP</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Tên sản phẩm</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">SL dự kiến</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">SL thực tế</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Chênh lệch</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {selectedStocktake.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-2 text-sm">{item.productId}</td>
                              <td className="px-4 py-2 text-sm font-medium">{item.productName}</td>
                              <td className="px-4 py-2 text-sm text-right">{item.expectedQuantity}</td>
                              <td className="px-4 py-2 text-sm text-right">{item.status === 'pending' ? '-' : item.actualQuantity}</td>
                              <td className="px-4 py-2 text-sm text-right font-medium">
                                {item.status === 'pending' ? '-' : getDifferenceDisplay(item.difference)}
                              </td>
                              <td className="px-4 py-2 text-center">
                                {getItemStatusBadge(item.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Notes */}
                {selectedStocktake.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Ghi chú</h4>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <p className="text-sm">{selectedStocktake.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowStocktakeDialog(false)}>
                  Đóng
                </Button>
                {selectedStocktake.status === 'completed' && (
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Xuất báo cáo
                  </Button>
                )}
                {selectedStocktake.status === 'in_progress' && (
                  <Button>
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Tiếp tục kiểm kê
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </UserLayout>
  );
}
