'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Building2, Users, BarChart3, FileText, Settings, Briefcase, CreditCard, ShoppingBag, Package, Warehouse } from 'lucide-react';
import Link from 'next/link';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';
// import { BarChart, LineChart, PieChart } from '@/components/ui/chart';

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

  // Dữ liệu mẫu cho phòng ban
  const departments = [
    { id: 1, name: 'Ban Giám đốc', employees: 3, businessId: 1 },
    { id: 2, name: 'Phòng Kinh doanh', employees: 12, businessId: 1 },
    { id: 3, name: 'Phòng Kỹ thuật', employees: 8, businessId: 1 },
    { id: 4, name: 'Phòng Marketing', employees: 6, businessId: 1 },
    { id: 5, name: 'Phòng Hành chính', employees: 4, businessId: 1 },
    { id: 6, name: 'Phòng Nhân sự', employees: 3, businessId: 1 },
    { id: 7, name: 'Quản lý', employees: 2, businessId: 2 },
    { id: 8, name: 'Nhân viên phục vụ', employees: 6, businessId: 2 },
    { id: 9, name: 'Đầu bếp', employees: 4, businessId: 2 },
    { id: 10, name: 'Quản lý', employees: 1, businessId: 3 },
    { id: 11, name: 'Nhân viên bán hàng', employees: 5, businessId: 3 },
    { id: 12, name: 'Kho vận', employees: 2, businessId: 3 },
  ];

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan doanh nghiệp</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Thêm doanh nghiệp mới
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tổng phòng ban</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Trên tất cả doanh nghiệp
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="businesses">Doanh nghiệp</TabsTrigger>
            <TabsTrigger value="departments">Phòng ban</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo tháng</CardTitle>
                  <CardDescription>
                    Biểu đồ doanh thu 12 tháng gần nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ doanh thu (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố nhân viên theo doanh nghiệp</CardTitle>
                  <CardDescription>
                    Số lượng nhân viên trong từng doanh nghiệp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-slate-50 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Biểu đồ phân bố nhân viên (Dữ liệu mẫu)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>
                  Các hoạt động mới nhất trên tất cả doanh nghiệp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Nhân viên mới được thêm vào Công ty TNHH ABC</p>
                      <p className="text-xs text-muted-foreground">2 giờ trước</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-green-100 p-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Thanh toán lương tháng 5 đã hoàn tất</p>
                      <p className="text-xs text-muted-foreground">5 giờ trước</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-yellow-100 p-2">
                      <Package className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sản phẩm mới được thêm vào Cửa hàng thời trang Fashion</p>
                      <p className="text-xs text-muted-foreground">1 ngày trước</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-purple-100 p-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Báo cáo doanh thu tháng 4 đã được tạo</p>
                      <p className="text-xs text-muted-foreground">2 ngày trước</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="businesses" className="space-y-4">
            <Card>
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
                        <Link href={`/enterprise/business/${business.id}`}>
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
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Phòng ban theo doanh nghiệp</CardTitle>
                <CardDescription>
                  Danh sách phòng ban trong từng doanh nghiệp
                </CardDescription>
              </CardHeader>
              <CardContent>
                {businesses.map((business) => (
                  <div key={business.id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{business.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {departments
                        .filter(dept => dept.businessId === business.id)
                        .map((department) => (
                          <Card key={department.id}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">{department.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs text-muted-foreground">Nhân viên</p>
                                  <p className="text-lg font-bold">{department.employees}</p>
                                </div>
                                <Link href={`/enterprise/hr/departments/${department.id}`}>
                                  <Button variant="outline" size="sm">Chi tiết</Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      <Card className="border-dashed flex items-center justify-center">
                        <Button variant="ghost" className="flex items-center gap-2">
                          <PlusCircle className="h-4 w-4" />
                          Thêm phòng ban
                        </Button>
                      </Card>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo doanh thu</CardTitle>
                <CardDescription>
                  Báo cáo doanh thu theo từng doanh nghiệp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/9] bg-slate-50 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Biểu đồ báo cáo doanh thu (Dữ liệu mẫu)</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Báo cáo gần đây</CardTitle>
                  <CardDescription>
                    Các báo cáo đã tạo gần đây
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Báo cáo doanh thu tháng 5/2023</span>
                      </div>
                      <Button variant="ghost" size="sm">Xem</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Báo cáo nhân sự Q2/2023</span>
                      </div>
                      <Button variant="ghost" size="sm">Xem</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Báo cáo kho hàng tháng 5/2023</span>
                      </div>
                      <Button variant="ghost" size="sm">Xem</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Báo cáo bán hàng tháng 5/2023</span>
                      </div>
                      <Button variant="ghost" size="sm">Xem</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tạo báo cáo mới</CardTitle>
                  <CardDescription>
                    Tạo báo cáo tùy chỉnh
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      <span>Báo cáo doanh thu</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                      <Users className="h-6 w-6 mb-2" />
                      <span>Báo cáo nhân sự</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                      <Warehouse className="h-6 w-6 mb-2" />
                      <span>Báo cáo kho hàng</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                      <ShoppingBag className="h-6 w-6 mb-2" />
                      <span>Báo cáo bán hàng</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </EnterpriseLayout>
  );
}
