'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import BusinessTypeTable from '@/components/business-types/BusinessTypeTable';
import BusinessTypeDialog from '@/components/business-types/BusinessTypeDialog';
import BusinessTypeStats from '@/components/business-types/BusinessTypeStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Building } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BusinessType } from '@/lib/types';

export default function BusinessTypesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBusinessTypeDialog, setShowBusinessTypeDialog] = useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);

  return (
    <ProtectedRoute requiredPermissions={['manage_business_types']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
                <Building className="h-8 w-8 text-purple-600" />
                <span>Quản lý Loại Doanh nghiệp</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Cấu hình các loại hình doanh nghiệp và tính năng
              </p>
            </div>
            <Button onClick={() => setShowBusinessTypeDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm loại doanh nghiệp
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
                    placeholder="Tìm kiếm loại doanh nghiệp..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <BusinessTypeTable 
                searchTerm={searchTerm}
                onEditBusinessType={(businessType) => {
                  setSelectedBusinessType(businessType);
                  setShowBusinessTypeDialog(true);
                }}
              />
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-6">
              <BusinessTypeStats />
            </TabsContent>
          </Tabs>

          <BusinessTypeDialog
            open={showBusinessTypeDialog}
            onOpenChange={setShowBusinessTypeDialog}
            businessType={selectedBusinessType}
            onClose={() => {
              setShowBusinessTypeDialog(false);
              setSelectedBusinessType(null);
            }}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
