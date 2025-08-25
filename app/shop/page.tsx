'use client';

import { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingBag, 
  Star, 
  Heart, 
  Search,
  Filter,
  Grid,
  List,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { Product, ProductCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ShopHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockCategories: ProductCategory[] = [
      {
        _id: 'cat_1',
        name: 'Điện tử',
        description: 'Thiết bị điện tử và công nghệ',
        icon: '📱',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'cat_2',
        name: 'Thời trang',
        description: 'Quần áo và phụ kiện',
        icon: '👕',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'cat_3',
        name: 'Gia dụng',
        description: 'Đồ gia dụng và nội thất',
        icon: '🏠',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'cat_4',
        name: 'Sách',
        description: 'Sách và văn phòng phẩm',
        icon: '📚',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const mockProducts: Product[] = [
      {
        _id: 'prod_1',
        name: 'iPhone 15 Pro Max',
        description: 'Điện thoại thông minh cao cấp với chip A17 Pro',
        price: 29990000,
        currency: 'VND',
        images: ['/api/placeholder/300/300'],
        category: 'Điện tử',
        stock: 50,
        enterpriseId: 'ent_1',
        isActive: true,
        specifications: {
          'Màn hình': '6.7 inch Super Retina XDR',
          'Chip': 'A17 Pro',
          'Camera': '48MP + 12MP + 12MP',
          'Pin': '4441 mAh'
        },
        tags: ['smartphone', 'apple', 'premium'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'prod_2',
        name: 'MacBook Air M3',
        description: 'Laptop siêu mỏng với chip M3 mạnh mẽ',
        price: 32990000,
        currency: 'VND',
        images: ['/api/placeholder/300/300'],
        category: 'Điện tử',
        stock: 30,
        enterpriseId: 'ent_1',
        isActive: true,
        specifications: {
          'Màn hình': '13.6 inch Liquid Retina',
          'Chip': 'Apple M3',
          'RAM': '8GB',
          'SSD': '256GB'
        },
        tags: ['laptop', 'apple', 'ultrabook'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'prod_3',
        name: 'Áo sơ mi nam công sở',
        description: 'Áo sơ mi nam chất liệu cotton cao cấp',
        price: 299000,
        currency: 'VND',
        images: ['/api/placeholder/300/300'],
        category: 'Thời trang',
        stock: 100,
        enterpriseId: 'ent_2',
        isActive: true,
        specifications: {
          'Chất liệu': '100% Cotton',
          'Màu sắc': 'Trắng, Xanh, Đen',
          'Size': 'S, M, L, XL, XXL'
        },
        tags: ['shirt', 'men', 'office'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'prod_4',
        name: 'Nồi cơm điện Panasonic',
        description: 'Nồi cơm điện 1.8L với công nghệ IH',
        price: 2990000,
        currency: 'VND',
        images: ['/api/placeholder/300/300'],
        category: 'Gia dụng',
        stock: 25,
        enterpriseId: 'ent_3',
        isActive: true,
        specifications: {
          'Dung tích': '1.8L',
          'Công suất': '1000W',
          'Chất liệu': 'Thép không gỉ',
          'Bảo hành': '2 năm'
        },
        tags: ['kitchen', 'rice-cooker', 'panasonic'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setCategories(mockCategories);
    setProducts(mockProducts);
    setFeaturedProducts(mockProducts.slice(0, 3));
    setLoading(false);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <UserLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </UserLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Chào mừng đến với ShopPro!</h1>
            <p className="text-blue-100 mb-4">
              Khám phá hàng ngàn sản phẩm chất lượng từ các doanh nghiệp uy tín
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8" />
                  <div>
                    <p className="text-2xl font-bold">{products.length}</p>
                    <p className="text-sm text-blue-100">Sản phẩm</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8" />
                  <div>
                    <p className="text-2xl font-bold">150+</p>
                    <p className="text-sm text-blue-100">Doanh nghiệp</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8" />
                  <div>
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-sm text-blue-100">Hài lòng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Danh mục sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className="h-20 flex-col space-y-2"
                  onClick={() => setSelectedCategory('all')}
                >
                  <ShoppingBag className="h-6 w-6" />
                  <span className="text-xs">Tất cả</span>
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category._id}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    className="h-20 flex-col space-y-2"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-xs">{category.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <span>Sản phẩm nổi bật</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredProducts.map((product) => (
                    <div key={product._id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg bg-slate-100 aspect-square">
                        <img
                          src={product.images[0] || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <Badge className="absolute top-2 left-2 bg-orange-500">
                          Nổi bật
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(product.price, product.currency)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-slate-500">4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          <Card>
            <CardHeader>
              <CardTitle>
                Sản phẩm ({filteredProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">Không tìm thấy sản phẩm nào</p>
                </div>
              ) : (
                <div className={cn(
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                )}>
                  {filteredProducts.map((product) => (
                    <div key={product._id} className={cn(
                      'group cursor-pointer',
                      viewMode === 'list' && 'flex space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow'
                    )}>
                      <div className={cn(
                        'relative overflow-hidden rounded-lg bg-slate-100',
                        viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24 flex-shrink-0'
                      )}>
                        <img
                          src={product.images[0] || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        {product.stock < 10 && (
                          <Badge variant="destructive" className="absolute top-2 left-2">
                            Sắp hết
                          </Badge>
                        )}
                      </div>
                      <div className={cn('mt-3', viewMode === 'list' && 'mt-0 flex-1')}>
                        <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(product.price, product.currency)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-slate-500">4.5</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <Button size="sm">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Thêm vào giỏ
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
