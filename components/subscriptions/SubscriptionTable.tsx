'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, CreditCard, Users, Star, DollarSign } from 'lucide-react';
import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionPackage } from '@/lib/types';

interface SubscriptionTableProps {
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  onEditSubscription: (subscription: SubscriptionPackage) => void;
}

export default function SubscriptionTable({ 
  searchTerm, 
  statusFilter, 
  categoryFilter, 
  onEditSubscription 
}: SubscriptionTableProps) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, [searchTerm, statusFilter, categoryFilter]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await SubscriptionService.getSubscriptionPackages({
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter,
        role: categoryFilter === 'all' ? undefined : categoryFilter
      });
      setSubscriptions(response.data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">Hoạt động</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">Không hoạt động</Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'basic': 'bg-blue-100 text-blue-800',
      'premium': 'bg-purple-100 text-purple-800',
      'enterprise': 'bg-orange-100 text-orange-800',
      'custom': 'bg-gray-100 text-gray-800',
    };
    
    const labels = {
      'basic': 'Cơ bản',
      'premium': 'Chuyên nghiệp',
      'enterprise': 'Doanh nghiệp',
      'custom': 'Tùy chỉnh',
    };
    
    return (
      <Badge variant="secondary" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {labels[category as keyof typeof labels] || category}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa gói đăng ký này?')) {
      try {
        await SubscriptionService.deleteSubscriptionPackage(id);
        loadSubscriptions();
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách gói đăng ký ({subscriptions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Gói đăng ký
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Danh mục
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Giá cả
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Giới hạn người dùng
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Doanh nghiệp
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Trạng thái
                </th>
                <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr 
                  key={subscription._id} 
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{subscription.name}</span>
                        {subscription.isPopular && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{subscription.code}</p>
                      <p className="text-xs text-slate-500">{subscription.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getCategoryBadge(subscription.category)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{formatPrice(subscription.price.monthly)}/tháng</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {formatPrice(subscription.price.yearly)}/năm
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>{subscription.limits.users === 9999 ? 'Không giới hạn' : subscription.limits.users}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <span>{subscription.enterpriseCount || 0}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(subscription.isActive)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditSubscription(subscription)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          disabled={(subscription.enterpriseCount || 0) > 0}
                          onClick={() => handleDelete(subscription._id)}
                        >
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
        </div>
      </CardContent>
    </Card>
  );
}
