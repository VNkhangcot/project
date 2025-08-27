'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Coffee, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  DollarSign, 
  Tag, 
  MoreVertical,
  Utensils,
  Wine,
  Dessert,
  CupSoda
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Định nghĩa kiểu dữ liệu
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  popular: boolean;
  tags: string[];
}

// Mock data cho menu
const mockMenuItems: MenuItem[] = [
  {
    id: 'item-001',
    name: 'Cà phê đen',
    description: 'Cà phê đen đậm đà, hương vị mạnh mẽ',
    price: 25000,
    category: 'coffee',
    image: '/images/black-coffee.jpg',
    available: true,
    popular: true,
    tags: ['Đồ uống nóng', 'Cà phê']
  },
  {
    id: 'item-002',
    name: 'Cà phê sữa',
    description: 'Cà phê đen kết hợp với sữa đặc, ngọt ngào và béo ngậy',
    price: 30000,
    category: 'coffee',
    image: '/images/milk-coffee.jpg',
    available: true,
    popular: true,
    tags: ['Đồ uống nóng', 'Cà phê', 'Có sữa']
  },
  {
    id: 'item-003',
    name: 'Bạc xỉu',
    description: 'Cà phê sữa với nhiều sữa hơn, ít đắng hơn',
    price: 35000,
    category: 'coffee',
    image: '/images/bac-xiu.jpg',
    available: true,
    popular: false,
    tags: ['Đồ uống nóng', 'Cà phê', 'Có sữa']
  },
  {
    id: 'item-004',
    name: 'Trà đào',
    description: 'Trà đen kết hợp với đào tươi và syrup đào',
    price: 40000,
    category: 'tea',
    image: '/images/peach-tea.jpg',
    available: true,
    popular: true,
    tags: ['Đồ uống lạnh', 'Trà', 'Trái cây']
  },
  {
    id: 'item-005',
    name: 'Trà sữa trân châu',
    description: 'Trà đen, sữa và trân châu đường đen',
    price: 45000,
    category: 'tea',
    image: '/images/bubble-tea.jpg',
    available: true,
    popular: true,
    tags: ['Đồ uống lạnh', 'Trà', 'Có sữa', 'Topping']
  },
  {
    id: 'item-006',
    name: 'Sinh tố xoài',
    description: 'Sinh tố xoài tươi ngọt mát',
    price: 40000,
    category: 'smoothie',
    image: '/images/mango-smoothie.jpg',
    available: true,
    popular: false,
    tags: ['Đồ uống lạnh', 'Sinh tố', 'Trái cây']
  },
  {
    id: 'item-007',
    name: 'Nước ép cam',
    description: 'Nước ép cam tươi, giàu vitamin C',
    price: 35000,
    category: 'juice',
    image: '/images/orange-juice.jpg',
    available: true,
    popular: false,
    tags: ['Đồ uống lạnh', 'Nước ép', 'Trái cây']
  },
  {
    id: 'item-008',
    name: 'Bánh flan',
    description: 'Bánh flan mềm mịn với caramel ngọt ngào',
    price: 25000,
    category: 'dessert',
    image: '/images/flan.jpg',
    available: true,
    popular: true,
    tags: ['Tráng miệng', 'Bánh ngọt']
  },
  {
    id: 'item-009',
    name: 'Bánh tiramisu',
    description: 'Bánh tiramisu với lớp kem phô mai và cà phê',
    price: 35000,
    category: 'dessert',
    image: '/images/tiramisu.jpg',
    available: false,
    popular: false,
    tags: ['Tráng miệng', 'Bánh ngọt', 'Cà phê']
  },
  {
    id: 'item-010',
    name: 'Mì xào hải sản',
    description: 'Mì xào với hải sản tươi và rau củ',
    price: 65000,
    category: 'food',
    image: '/images/seafood-noodles.jpg',
    available: true,
    popular: true,
    tags: ['Món chính', 'Hải sản', 'Mì']
  }
];

export default function CafeMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'coffee',
    available: true,
    popular: false,
    tags: []
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coffee':
        return <Coffee className="h-5 w-5" />;
      case 'tea':
        return <CupSoda className="h-5 w-5" />;
      case 'smoothie':
      case 'juice':
        return <Wine className="h-5 w-5" />;
      case 'dessert':
        return <Dessert className="h-5 w-5" />;
      case 'food':
        return <Utensils className="h-5 w-5" />;
      default:
        return <Coffee className="h-5 w-5" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'coffee':
        return 'Cà phê';
      case 'tea':
        return 'Trà';
      case 'smoothie':
        return 'Sinh tố';
      case 'juice':
        return 'Nước ép';
      case 'dessert':
        return 'Tráng miệng';
      case 'food':
        return 'Đồ ăn';
      default:
        return category;
    }
  };

  const handleAddItem = () => {
    const id = `item-${String(menuItems.length + 1).padStart(3, '0')}`;
    const newMenuItem: MenuItem = {
      id,
      name: newItem.name || '',
      description: newItem.description || '',
      price: newItem.price || 0,
      category: newItem.category || 'coffee',
      image: '/images/placeholder.jpg',
      available: newItem.available !== undefined ? newItem.available : true,
      popular: newItem.popular !== undefined ? newItem.popular : false,
      tags: newItem.tags || []
    };
    
    setMenuItems([...menuItems, newMenuItem]);
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: 'coffee',
      available: true,
      popular: false,
      tags: []
    });
    setShowAddDialog(false);
  };

  const handleEditItem = () => {
    if (selectedItem) {
      setMenuItems(menuItems.map(item => 
        item.id === selectedItem.id ? { ...selectedItem } : item
      ));
      setSelectedItem(null);
      setShowEditDialog(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Menu & Thức uống
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý menu và thức uống cho quán cafe
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm món..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm món mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm món mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin chi tiết cho món mới
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên món
                  </Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Mô tả
                  </Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Giá
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Danh mục
                  </Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coffee">Cà phê</SelectItem>
                      <SelectItem value="tea">Trà</SelectItem>
                      <SelectItem value="smoothie">Sinh tố</SelectItem>
                      <SelectItem value="juice">Nước ép</SelectItem>
                      <SelectItem value="dessert">Tráng miệng</SelectItem>
                      <SelectItem value="food">Đồ ăn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">
                    Thẻ
                  </Label>
                  <Input
                    id="tags"
                    placeholder="Nhập thẻ, phân cách bằng dấu phẩy"
                    value={newItem.tags?.join(', ')}
                    onChange={(e) => setNewItem({ ...newItem, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="available" className="text-right">
                    Có sẵn
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="available"
                      checked={newItem.available}
                      onCheckedChange={(checked) => setNewItem({ ...newItem, available: checked })}
                    />
                    <Label htmlFor="available">
                      {newItem.available ? 'Có' : 'Không'}
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="popular" className="text-right">
                    Phổ biến
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="popular"
                      checked={newItem.popular}
                      onCheckedChange={(checked) => setNewItem({ ...newItem, popular: checked })}
                    />
                    <Label htmlFor="popular">
                      {newItem.popular ? 'Có' : 'Không'}
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Hủy</Button>
                <Button onClick={handleAddItem}>Thêm món</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            {categories.filter(cat => cat !== 'all').map((category) => (
              <TabsTrigger key={category} value={category}>
                {getCategoryName(category)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Menu Items Grid */}
          <TabsContent value={activeCategory} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-slate-300" />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">
                            <div className="flex items-center space-x-1">
                              {getCategoryIcon(item.category)}
                              <span>{getCategoryName(item.category)}</span>
                            </div>
                          </Badge>
                          {item.popular && (
                            <Badge className="bg-orange-100 text-orange-800">Phổ biến</Badge>
                          )}
                          {!item.available && (
                            <Badge variant="destructive">Hết hàng</Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(item);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setMenuItems(menuItems.map(i => 
                              i.id === item.id ? { ...i, available: !i.available } : i
                            ))}
                          >
                            {item.available ? (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Đánh dấu hết hàng
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Đánh dấu có sẵn
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription className="line-clamp-2 h-10">
                      {item.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-lg text-blue-600">
                        {formatCurrency(item.price)}
                      </p>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {item.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="py-8 text-center">
                <Coffee className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">Không tìm thấy món nào</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {selectedItem && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa món</DialogTitle>
                <DialogDescription>
                  Chỉnh sửa thông tin chi tiết cho món
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Tên món
                  </Label>
                  <Input
                    id="edit-name"
                    value={selectedItem.name}
                    onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Mô tả
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={selectedItem.description}
                    onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">
                    Giá
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedItem.price}
                    onChange={(e) => setSelectedItem({ ...selectedItem, price: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Danh mục
                  </Label>
                  <Select
                    value={selectedItem.category}
                    onValueChange={(value) => setSelectedItem({ ...selectedItem, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coffee">Cà phê</SelectItem>
                      <SelectItem value="tea">Trà</SelectItem>
                      <SelectItem value="smoothie">Sinh tố</SelectItem>
                      <SelectItem value="juice">Nước ép</SelectItem>
                      <SelectItem value="dessert">Tráng miệng</SelectItem>
                      <SelectItem value="food">Đồ ăn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-tags" className="text-right">
                    Thẻ
                  </Label>
                  <Input
                    id="edit-tags"
                    placeholder="Nhập thẻ, phân cách bằng dấu phẩy"
                    value={selectedItem.tags.join(', ')}
                    onChange={(e) => setSelectedItem({ ...selectedItem, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-available" className="text-right">
                    Có sẵn
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="edit-available"
                      checked={selectedItem.available}
                      onCheckedChange={(checked) => setSelectedItem({ ...selectedItem, available: checked })}
                    />
                    <Label htmlFor="edit-available">
                      {selectedItem.available ? 'Có' : 'Không'}
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-popular" className="text-right">
                    Phổ biến
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch
                      id="edit-popular"
                      checked={selectedItem.popular}
                      onCheckedChange={(checked) => setSelectedItem({ ...selectedItem, popular: checked })}
                    />
                    <Label htmlFor="edit-popular">
                      {selectedItem.popular ? 'Có' : 'Không'}
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Hủy</Button>
                <Button onClick={handleEditItem}>Lưu thay đổi</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </UserLayout>
  );
}
