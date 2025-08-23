'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubscriptionTable from '@/components/subscriptions/SubscriptionTable';
import SubscriptionDialog from '@/components/subscriptions/SubscriptionDialog';
import SubscriptionStats from '@/components/subscriptions/SubscriptionStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, CreditCard } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { SubscriptionPackage } from '@/lib/types';

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionPackage | null>(null);

  return (
    <ProtectedRoute requiredPermissions={['manage_subscriptions']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-green-600" />
                <span>Quản lý Gói Đăng ký</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Cấu hình các gói dịch vụ và định giá cho doanh nghiệp
              </p>
            </div>
            <Button onClick={() => setShowSubscriptionDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm gói đăng ký
            </Button>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">Danh sách gói</TabsTrigger>
              <TabsTrigger value="stats">Thống kê</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm kiếm gói đăng ký..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="basic">Cơ bản</SelectItem>
                    <SelectItem value="premium">Chuyên nghiệp</SelectItem>
                    <SelectItem value="enterprise">Doanh nghiệp</SelectItem>
                    <SelectItem value="custom">Tùy chỉnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <SubscriptionTable 
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                categoryFilter={categoryFilter}
                onEditSubscription={(subscription) => {
                  setSelectedSubscription(subscription);
                  setShowSubscriptionDialog(true);
                }}
              />
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-6">
              <SubscriptionStats />
            </TabsContent>
          </Tabs>

          <SubscriptionDialog
            open={showSubscriptionDialog}
            onOpenChange={setShowSubscriptionDialog}
            subscription={selectedSubscription}
            onClose={() => {
              setShowSubscriptionDialog(false);
              setSelectedSubscription(null);
            }}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
