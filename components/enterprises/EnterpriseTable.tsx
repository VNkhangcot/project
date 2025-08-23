'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, Building2, Users, Calendar, CreditCard, Clock } from 'lucide-react';
import { EnterpriseService } from '@/services/enterpriseService';
import { SubscriptionService } from '@/services/subscriptionService';
import { Enterprise, SubscriptionPackage } from '@/lib/types';

interface EnterpriseTableProps {
  searchTerm: string;
  statusFilter: string;
  onEditEnterprise: (enterprise: Enterprise) => void;
}

export default function EnterpriseTable({ searchTerm, statusFilter, onEditEnterprise }: EnterpriseTableProps) {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [subscriptionPackages, setSubscriptionPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnterprises();
    loadSubscriptionPackages();
  }, [searchTerm, statusFilter]);

  const loadEnterprises = async () => {
    try {
      setLoading(true);
      const response = await EnterpriseService.getEnterprises({
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter
      });
      setEnterprises(response.data || []);
    } catch (error) {
      console.error('Error loading enterprises:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptionPackages = async () => {
    try {
      const response = await SubscriptionService.getSubscriptionPackages();
      setSubscriptionPackages(response.data || []);
    } catch (error) {
      console.error('Error loading subscription packages:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Bị đình chỉ</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getSubscriptionBadge = (plan: string) => {
    const pkg = subscriptionPackages.find(p => p.code.toLowerCase() === plan);
    if (pkg) {
      const colors = {
        'basic': 'bg-blue-100 text-blue-800',
        'premium': 'bg-purple-100 text-purple-800',
        'enterprise': 'bg-orange-100 text-orange-800',
        'custom': 'bg-gray-100 text-gray-800',
      };
      return (
        <Badge variant="secondary" className={colors[pkg.category] || 'bg-gray-100 text-gray-800'}>
          {pkg.name}
        </Badge>
      );
    }
    
    // Fallback for old format
    switch (plan) {
      case 'basic':
        return <Badge variant="outline">Basic</Badge>;
      case 'premium':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Premium</Badge>;
      case 'enterprise':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Enterprise</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getSubscriptionPrice = (plan: string) => {
    const pkg = subscriptionPackages.find(p => p.code.toLowerCase() === plan);
    if (pkg) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        notation: 'compact'
      }).format(pkg.price.monthly);
    }
    return '';
  };

  const isSubscriptionExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isSubscriptionExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách doanh nghiệp ({enterprises.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Doanh nghiệp
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Loại hình
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Gói dịch vụ
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Người dùng
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Trạng thái
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Ngày đăng ký
                </th>
                <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {enterprises.map((enterprise) => (
                <tr 
                  key={enterprise._id} 
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={enterprise.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Building2 className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{enterprise.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{enterprise.code}</p>
                        <p className="text-xs text-slate-500">{enterprise.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline">{enterprise.businessType.name}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        {getSubscriptionBadge(enterprise.subscriptionPlan)}
                      </div>
                      {getSubscriptionPrice(enterprise.subscriptionPlan) && (
                        <p className="text-xs text-slate-500">
                          {getSubscriptionPrice(enterprise.subscriptionPlan)}/tháng
                        </p>
                      )}
                      {enterprise.subscriptionExpiry && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span className={`text-xs ${
                            isSubscriptionExpired(enterprise.subscriptionExpiry) 
                              ? 'text-red-600' 
                              : isSubscriptionExpiringSoon(enterprise.subscriptionExpiry)
                              ? 'text-yellow-600'
                              : 'text-slate-500'
                          }`}>
                            Hết hạn: {formatDate(enterprise.subscriptionExpiry)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">
                        {enterprise.currentUserCount}/{enterprise.userLimit}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(enterprise.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">{formatDate(enterprise.registrationDate)}</span>
                    </div>
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
                        <DropdownMenuItem onClick={() => onEditEnterprise(enterprise)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
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
        </div>
      </CardContent>
    </Card>
  );
}