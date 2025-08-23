'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CurrencyTable from '@/components/currencies/CurrencyTable';
import CurrencyDialog from '@/components/currencies/CurrencyDialog';
import CurrencyStats from '@/components/currencies/CurrencyStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, DollarSign } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CurrencyRate } from '@/lib/types';

export default function CurrenciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyRate | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleCurrencyChange = () => {
    // Tăng refreshTrigger để kích hoạt việc tải lại danh sách
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ProtectedRoute requiredPermissions={['system_settings']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <span>Quản lý Tỉ giá tiền tệ</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Cấu hình và quản lý tỉ giá các loại tiền tệ trong hệ thống
              </p>
            </div>
            <Button onClick={() => setShowCurrencyDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm tiền tệ
            </Button>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">Danh sách</TabsTrigger>
              <TabsTrigger value="stats">Thống kê & Biểu đồ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm kiếm tiền tệ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <CurrencyTable 
                searchTerm={searchTerm}
                refreshTrigger={refreshTrigger}
                onEditCurrency={(currency) => {
                  setSelectedCurrency(currency);
                  setShowCurrencyDialog(true);
                }}
              />
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-6">
              <CurrencyStats />
            </TabsContent>
          </Tabs>

          <CurrencyDialog
            open={showCurrencyDialog}
            onOpenChange={setShowCurrencyDialog}
            currency={selectedCurrency}
            onClose={() => {
              setShowCurrencyDialog(false);
              setSelectedCurrency(null);
              handleCurrencyChange(); // Tải lại danh sách sau khi đóng dialog
            }}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
