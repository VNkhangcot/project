'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Building2, Users, BarChart3, FileText, Settings, Briefcase } from 'lucide-react';
import Link from 'next/link';

// Các thành phần con
import BusinessOverview from '@/components/enterprise/BusinessOverview';
import DepartmentsList from '@/components/enterprise/DepartmentsList';
import EmployeesList from '@/components/enterprise/EmployeesList';
import FinancialStats from '@/components/enterprise/FinancialStats';
import DocumentsList from '@/components/enterprise/DocumentsList';

export default function EnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dữ liệu mẫu cho doanh nghiệp
  const businesses = [
    { 
      id: 1, 
      name: 'Công ty TNHH ABC', 
      type: 'Công nghệ', 
      employees: 45, 
      revenue: '1.2 tỷ VND',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Nhà hàng XYZ', 
      type: 'Ẩm thực', 
      employees: 12, 
      revenue: '450 triệu VND',
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Cửa hàng thời trang Fashion', 
      type: 'Bán lẻ', 
      employees: 8, 
      revenue: '320 triệu VND',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý doanh nghiệp</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Thêm doanh nghiệp mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh nghiệp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {businesses.filter(b => b.status === 'active').length} đang hoạt động
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.reduce((sum, business) => sum + business.employees, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Trên tất cả doanh nghiệp
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.97 tỷ VND</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tháng này
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Doanh nghiệp của bạn</CardTitle>
          <CardDescription>
            Quản lý tất cả doanh nghiệp đã đăng ký của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((business) => (
              <Card key={business.id} className="overflow-hidden">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-2">
                  <CardTitle className="text-lg">{business.name}</CardTitle>
                  <CardDescription>{business.type}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Nhân viên</p>
                      <p className="font-medium">{business.employees}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Doanh thu</p>
                      <p className="font-medium">{business.revenue}</p>
                    </div>
                  </div>
                  <Link href={`/shop/enterprise/business/${business.id}`}>
                    <Button className="w-full">Quản lý</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed flex items-center justify-center h-[200px]">
              <Button variant="outline" className="flex flex-col h-32 w-32 items-center justify-center rounded-md border border-dashed">
                <PlusCircle className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-muted-foreground">Thêm doanh nghiệp</span>
              </Button>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
