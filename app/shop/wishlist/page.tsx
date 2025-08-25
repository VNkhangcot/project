'use client';

import { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Search, 
  Filter,
  ShoppingCart,
  Trash2,
  Star,
  Share2,
  Grid,
  List
} from 'lucide-react';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Mock wishlist data
    const mockWishlistItems: Product[] = [
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
        _id: 'prod_5',
        name: 'Giày thể thao Nike Air Max',
        description: 'Giày thể thao nam Nike Air Max thoải mái',
        price: 2590000,
        currency: 'VND',
        images: ['/api/placeholder/300/300'],
        category: 'Thời trang',
        stock: 75,
        enterpriseId: 'ent_2',
        isActive: true,
        specifications: {
          'Chất liệu': 'Da tổng hợp + Mesh',
          'Đế': 'Cao su',
          'Size': '39-44'
        },
        tags: ['shoes', 'nike', 'sport'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setWishlistItems(mockWishlistItems);
    setLoading(false);
  }, []);

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(items => items.filter(item => item._id !== productId));
  };

  const addToCart = (product: Product) => {
    // Mock add to cart functionality
    console.log('Added to cart:', product.name);
    // You could show a toast notification here
  };

  const shareWishlist = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Danh sách yêu thích của tôi',
        text: 'Xem danh sách sản phẩm yêu thích của tôi',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const categories = Array.from(new Set(wishlistItems.map(item => item.category)));

  const filteredItems = wishlistItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
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

  if (wishlistItems.length === 0) {
    return (
      <ProtectedRoute>
        <UserLayout>
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <Heart className="h-24 w-24 text-slate-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Danh sách yêu thích trống
              </h2>
              <p className="text-slate-500 mb-8">
                Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy khám phá và thêm những sản phẩm bạn thích!
              </p>
              <Link href="/shop">
                <Button>
                  <Heart className="h-4 w-4 mr-2" />
                  Khám phá sản phẩm
                </Button>
              </Link>
            </div>
          </div>
        </UserLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <UserLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Danh sách yêu thích
              </h1>
              <p className="text-slate-500 mt-1">
                {wishlistItems.length} sản phẩm trong danh sách yêu thích
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={shareWishlist}>
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
              <Link href="/shop">
                <Button variant="outline">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {wishlistItems.length}
                    </p>
                    <p className="text-sm text-slate-500">Sản phẩm yêu thích</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {wishlistItems.filter(item => item.stock > 0).length}
                    </p>
                    <p className="text-sm text-slate-500">Còn hàng</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {categories.length}
                    </p>
                    <p className="text-sm text-slate-500">Danh mục</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm sản phẩm yêu thích..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
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

          {/* Wishlist Items */}
          <Card>
            <CardHeader>
              <CardTitle>
                Sản phẩm yêu thích ({filteredItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">Không tìm thấy sản phẩm nào</p>
                </div>
              ) : (
                <div className={cn(
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                )}>
                  {filteredItems.map((product) => (
                    <div key={product._id} className={cn(
                      'group',
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
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="bg-white/80 hover:bg-white text-red-600"
                            onClick={() => removeFromWishlist(product._id)}
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                        {product.stock < 10 && product.stock > 0 && (
                          <Badge variant="destructive" className="absolute top-2 left-2">
                            Sắp hết
                          </Badge>
                        )}
                        {product.stock === 0 && (
                          <Badge variant="secondary" className="absolute top-2 left-2">
                            Hết hàng
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
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => removeFromWishlist(product._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => addToCart(product)}
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {filteredItems.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Thao tác nhanh
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Thực hiện các thao tác với toàn bộ danh sách yêu thích
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const availableItems = filteredItems.filter(item => item.stock > 0);
                        availableItems.forEach(item => addToCart(item));
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Thêm tất cả vào giỏ
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setWishlistItems([])}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa tất cả
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
