'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Coffee, 
  Beer, 
  Pizza, 
  Utensils,
  DollarSign,
  Filter,
  ImagePlus,
  Tag,
  CheckCircle,
  Star
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
interface MenuItem {
  id: string;
  name: string;
  category: 'drinks' | 'food' | 'snacks';
  subcategory: string;
  price: number;
  description?: string;
  image?: string;
  available: boolean;
  popular: boolean;
}

// Mock data cho menu
const mockMenuItems: MenuItem[] = [
  {
    id: 'ITEM-001',
    name: 'Bia Tiger',
    category: 'drinks',
    subcategory: 'Bia',
    price: 25000,
    description: 'Bia Tiger lon 330ml',
    image: '/images/tiger-beer.jpg',
    available: true,
    popular: true
  },
  {
    id: 'ITEM-002',
    name: 'Bia Heineken',
    category: 'drinks',
    subcategory: 'Bia',
    price: 30000,
    description: 'Bia Heineken lon 330ml',
    image: '/images/heineken.jpg',
    available: true,
    popular: true
  },
  {
    id: 'ITEM-003',
    name: 'Coca Cola',
    category: 'drinks',
    subcategory: 'Nước ngọt',
    price: 15000,
    description: 'Coca Cola lon 330ml',
    image: '/images/coca-cola.jpg',
    available: true,
    popular: true
  },
  {
    id: 'ITEM-004',
    name: 'Nước suối',
    category: 'drinks',
    subcategory: 'Nước lọc',
    price: 10000,
    description: 'Nước suối Aquafina 500ml',
    image: '/images/water.jpg',
    available: true,
    popular: false
  },
  {
    id: 'ITEM-005',
    name: 'Đậu phộng rang',
    category: 'snacks',
    subcategory: 'Hạt',
    price: 20000,
    description: 'Đậu phộng rang muối',
    image: '/images/peanuts.jpg',
    available: true,
    popular: true
  },
  {
    id: 'ITEM-006',
    name: 'Khô bò',
    category: 'snacks',
    subcategory: 'Thịt khô',
    price: 45000,
    description: 'Khô bò miếng',
    image: '/images/beef-jerky.jpg',
    available: true,
    popular: true
  },
  {
    id: 'ITEM-007',
    name: 'Mì xào hải sản',
    category: 'food',
    subcategory: 'Mì',
    price: 50000,
    description: 'Mì xào với hải sản tươi',
    image: '/images/seafood-noodles.jpg',
    available: true,
    popular: false
  },
  {
    id: 'ITEM-008',
    name: 'Cơm chiên dương châu',
    category: 'food',
    subcategory: 'Cơm',
    price: 55000,
    description: 'Cơm chiên với thịt, trứng và rau củ',
    image: '/images/fried-rice.jpg',
    available: false,
    popular: false
  }
];

export default function BilliardsMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'drinks':
        return <Coffee className="h-5 w-5 text-blue-500" />;
      case 'food':
        return <Utensils className="h-5 w-5 text-orange-500" />;
      case 'snacks':
        return <Pizza className="h-5 w-5 text-yellow-500" />;
      default:
        return <Coffee className="h-5 w-5 text-slate-500" />;
    }
  };

  const getSubcategoryIcon = (subcategory: string) => {
    switch (subcategory) {
      case 'Bia':
        return <Beer className="h-4 w-4 text-amber-500" />;
      case 'Nước ngọt':
        return <Coffee className="h-4 w-4 text-red-500" />;
      case 'Nước lọc':
        return <Coffee className="h-4 w-4 text-blue-500" />;
      case 'Hạt':
        return <Pizza className="h-4 w-4 text-yellow-500" />;
      case 'Thịt khô':
        return <Pizza className="h-4 w-4 text-brown-500" />;
      case 'Mì':
        return <Utensils className="h-4 w-4 text-orange-500" />;
      case 'Cơm':
        return <Utensils className="h-4 w-4 text-green-500" />;
      default:
        return <Coffee className="h-4 w-4 text-slate-500" />;
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesAvailability = availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && item.available) ||
      (availabilityFilter === 'unavailable' && !item.available);
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'drinks' && item.category === 'drinks') ||
      (activeTab === 'food' && item.category === 'food') ||
      (activeTab === 'snacks' && item.category === 'snacks') ||
      (activeTab === 'popular' && item.popular);
    
    return matchesSearch && matchesCategory && matchesAvailability && matchesTab;
  });

  // Calculate stats
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.available).length;
  const popularItems = menuItems.filter(item => item.popular).length;
  
  // Count unique subcategories
  const subcategories = menuItems.map(item => item.subcategory);
  const uniqueSubcategories = new Set(subcategories);
  const categories = uniqueSubcategories.size;

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Menu & Đồ uống
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý menu đồ ăn và thức uống cho quán bida
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng số món</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalItems}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Utensils className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Có sẵn</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{availableItems}</p>
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
                  <p className="text-sm text-slate-500 dark:text-slate-400">Phổ biến</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{popularItems}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Danh mục</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{categories}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Tag className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="drinks">Đồ uống</TabsTrigger>
              <TabsTrigger value="food">Đồ ăn</TabsTrigger>
              <TabsTrigger value="snacks">Đồ ăn vặt</TabsTrigger>
              <TabsTrigger value="popular">Phổ biến</TabsTrigger>
            </TabsList>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm món mới
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm món ăn, thức uống..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <select
                className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Tất cả loại</option>
                <option value="drinks">Đồ uống</option>
                <option value="food">Đồ ăn</option>
                <option value="snacks">Đồ ăn vặt</option>
              </select>
              <select
                className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="available">Có sẵn</option>
                <option value="unavailable">Hết hàng</option>
              </select>
            </div>
          </div>

          {/* Menu Items Grid */}
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <ImagePlus className="h-12 w-12 text-slate-400" />
                    </div>
                    {item.popular && (
                      <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
                        Phổ biến
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="flex items-center space-x-1 mt-1">
                          {getSubcategoryIcon(item.subcategory)}
                          <span className="text-sm text-slate-500 dark:text-slate-400">{item.subcategory}</span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{formatCurrency(item.price)}</p>
                        <Badge className={`mt-1 ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.available ? 'Có sẵn' : 'Hết hàng'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedItem(item);
                            setShowItemDialog(true);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Tag className="h-4 w-4 mr-2" />
                            {item.popular ? 'Bỏ phổ biến' : 'Đánh dấu phổ biến'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {item.available ? 'Đánh dấu hết hàng' : 'Đánh dấu có sẵn'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="py-12 text-center">
                <Coffee className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">Không tìm thấy món ăn hoặc thức uống nào</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Item Detail Dialog */}
        {selectedItem && (
          <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Chi tiết món</DialogTitle>
                <DialogDescription>
                  Xem và chỉnh sửa thông tin món ăn/thức uống
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tên món</label>
                  <Input value={selectedItem.name} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Loại</label>
                    <select className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm mt-1">
                      <option value="drinks">Đồ uống</option>
                      <option value="food">Đồ ăn</option>
                      <option value="snacks">Đồ ăn vặt</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Danh mục con</label>
                    <Input value={selectedItem.subcategory} className="mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Giá</label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input value={selectedItem.price.toString()} className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Mô tả</label>
                  <textarea 
                    className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm mt-1"
                    rows={3}
                    value={selectedItem.description || ''}
                  ></textarea>
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="available" 
                      checked={selectedItem.available} 
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="available" className="ml-2 text-sm">Có sẵn</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="popular" 
                      checked={selectedItem.popular} 
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="popular" className="ml-2 text-sm">Phổ biến</label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowItemDialog(false)}>
                  Hủy
                </Button>
                <Button>
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </UserLayout>
  );
}
