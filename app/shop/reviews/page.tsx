'use client';

import { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Star, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Plus,
  ThumbsUp,
  MessageSquare,
  Camera,
  Send
} from 'lucide-react';
import { ProductReview, Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: [] as string[]
  });

  useEffect(() => {
    // Mock reviews data
    const mockReviews: ProductReview[] = [
      {
        _id: 'review_1',
        productId: 'prod_1',
        product: {
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
          specifications: {},
          tags: ['smartphone', 'apple', 'premium'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        userId: 'user_1',
        rating: 5,
        title: 'Sản phẩm tuyệt vời!',
        comment: 'iPhone 15 Pro Max thực sự xuất sắc. Hiệu năng mạnh mẽ, camera chụp ảnh đẹp, pin trâu. Rất hài lòng với sản phẩm này.',
        images: ['/api/placeholder/400/300'],
        isVerifiedPurchase: true,
        helpfulVotes: 12,
        createdAt: '2024-01-16T00:00:00Z',
        updatedAt: '2024-01-16T00:00:00Z'
      },
      {
        _id: 'review_2',
        productId: 'prod_3',
        product: {
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
          specifications: {},
          tags: ['shirt', 'men', 'office'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        userId: 'user_1',
        rating: 4,
        title: 'Chất lượng tốt, giá hợp lý',
        comment: 'Áo sơ mi chất lượng cotton mềm mại, form dáng đẹp. Giá cả hợp lý. Sẽ mua thêm.',
        isVerifiedPurchase: true,
        helpfulVotes: 8,
        createdAt: '2024-01-14T00:00:00Z',
        updatedAt: '2024-01-14T00:00:00Z'
      }
    ];

    const mockPendingReviews: Product[] = [
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
        specifications: {},
        tags: ['kitchen', 'rice-cooker', 'panasonic'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setReviews(mockReviews);
    setPendingReviews(mockPendingReviews);
    setLoading(false);
  }, []);

  const handleSubmitReview = async () => {
    if (!selectedProduct) return;

    const newReview: ProductReview = {
      _id: `review_${Date.now()}`,
      productId: selectedProduct._id,
      product: selectedProduct,
      userId: 'user_1',
      rating: reviewForm.rating,
      title: reviewForm.title,
      comment: reviewForm.comment,
      images: reviewForm.images,
      isVerifiedPurchase: true,
      helpfulVotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setReviews([newReview, ...reviews]);
    setPendingReviews(pendingReviews.filter(p => p._id !== selectedProduct._id));
    setShowReviewForm(false);
    setSelectedProduct(null);
    setReviewForm({
      rating: 5,
      title: '',
      comment: '',
      images: []
    });
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={cn(
              'transition-colors',
              interactive && 'hover:text-yellow-400',
              !interactive && 'cursor-default'
            )}
            disabled={!interactive}
          >
            <Star
              className={cn(
                'h-4 w-4',
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300'
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === null || review.rating === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Đánh giá của tôi
            </h1>
            <p className="text-slate-500 mt-1">
              Quản lý và chia sẻ đánh giá về các sản phẩm bạn đã mua
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {reviews.length}
                    </p>
                    <p className="text-sm text-slate-500">Đánh giá đã viết</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ThumbsUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {reviews.reduce((sum, review) => sum + review.helpfulVotes, 0)}
                    </p>
                    <p className="text-sm text-slate-500">Lượt hữu ích</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0).toFixed(1)}
                    </p>
                    <p className="text-sm text-slate-500">Điểm trung bình</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Reviews */}
          {pendingReviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm chờ đánh giá</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingReviews.map((product) => (
                    <div key={product._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.images[0] || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 dark:text-white truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {formatPrice(product.price, product.currency)}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowReviewForm(true);
                        }}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Đánh giá
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm đánh giá..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={ratingFilter || ''}
                onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả đánh giá</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">Chưa có đánh giá nào</p>
                </CardContent>
              </Card>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={review.product?.images[0] || '/api/placeholder/300/300'}
                          alt={review.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">
                              {review.product?.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-slate-500">
                                {formatDate(review.createdAt)}
                              </span>
                              {review.isVerifiedPurchase && (
                                <Badge variant="secondary" className="text-xs">
                                  Đã mua hàng
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                              {review.title}
                            </h4>
                            <p className="text-slate-600 dark:text-slate-300">
                              {review.comment}
                            </p>
                          </div>

                          {review.images && review.images.length > 0 && (
                            <div className="flex space-x-2">
                              {review.images.map((image, index) => (
                                <div key={index} className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden">
                                  <img
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span>{review.helpfulVotes} người thấy hữu ích</span>
                            </div>
                            <Button size="sm" variant="outline">
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Hữu ích
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Review Form Modal */}
          {showReviewForm && selectedProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Đánh giá sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Product Info */}
                  <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={selectedProduct.images[0] || '/api/placeholder/300/300'}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {formatPrice(selectedProduct.price, selectedProduct.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <Label>Đánh giá tổng thể</Label>
                    <div className="flex items-center space-x-3">
                      {renderStars(reviewForm.rating, true, (rating) => 
                        setReviewForm({ ...reviewForm, rating })
                      )}
                      <span className="text-sm text-slate-500">
                        ({reviewForm.rating} sao)
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề đánh giá</Label>
                    <Input
                      id="title"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      placeholder="Tóm tắt đánh giá của bạn"
                    />
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <Label htmlFor="comment">Nội dung đánh giá</Label>
                    <Textarea
                      id="comment"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      rows={4}
                    />
                  </div>

                  {/* Images */}
                  <div className="space-y-2">
                    <Label>Hình ảnh (tùy chọn)</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Thêm ảnh
                      </Button>
                      <span className="text-sm text-slate-500">
                        Tối đa 5 ảnh
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-4">
                    <Button onClick={handleSubmitReview} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Gửi đánh giá
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReviewForm(false);
                        setSelectedProduct(null);
                        setReviewForm({
                          rating: 5,
                          title: '',
                          comment: '',
                          images: []
                        });
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </UserLayout>
    </ProtectedRoute>
  );
}
