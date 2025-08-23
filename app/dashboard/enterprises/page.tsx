'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EnterpriseTable from '@/components/enterprises/EnterpriseTable';
import EnterpriseDialog from '@/components/enterprises/EnterpriseDialog';
import EnterpriseStats from '@/components/enterprises/EnterpriseStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
import { Enterprise } from '@/lib/types';

export default function EnterprisesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEnterpriseDialog, setShowEnterpriseDialog] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span>Quản lý Doanh nghiệp</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Quản lý các doanh nghiệp đăng ký sử dụng hệ thống
            </p>
          </div>
          <Button onClick={() => setShowEnterpriseDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm doanh nghiệp
          </Button>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Danh sách</TabsTrigger>
            <TabsTrigger value="stats">Thống kê</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm doanh nghiệp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="suspended">Bị đình chỉ</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </div>

            <EnterpriseTable 
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onEditEnterprise={(enterprise) => {
                setSelectedEnterprise(enterprise);
                setShowEnterpriseDialog(true);
              }}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
            <EnterpriseStats />
          </TabsContent>
        </Tabs>

        <EnterpriseDialog
          open={showEnterpriseDialog}
          onOpenChange={setShowEnterpriseDialog}
          enterprise={selectedEnterprise}
          onClose={() => {
            setShowEnterpriseDialog(false);
            setSelectedEnterprise(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
}