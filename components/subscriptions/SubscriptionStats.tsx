'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  CreditCard, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Package,
  Star,
  Target,
  Activity
} from 'lucide-react';
import { SubscriptionService } from '@/services/subscriptionService';

export default function SubscriptionStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await SubscriptionService.getSubscriptionStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading subscription stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact'
    }).format(price);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Mock trend data
  const trendData = [
    { month: 'T1', revenue: 45000000, subscribers: 45 },
    { month: 'T2', revenue: 52000000, subscribers: 52 },
    { month: 'T3', revenue: 48000000, subscribers: 48 },
    { month: 'T4', revenue: 61000000, subscribers: 61 },
    { month: 'T5', revenue: 55000000, subscribers: 55 },
    { month: 'T6', revenue: 67000000, subscribers: 67 },
    { month: 'T7', revenue: 73000000, subscribers: 73 },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-slate-500">Không thể tải dữ liệu thống kê</p>
        </CardContent>
      </Card>
    );
  }

  const categoryData = Object.entries(stats.categoryStats).map(([key, value]) => ({
    name: key === 'basic' ? 'Cơ bản' : 
          key === 'premium' ? 'Chuyên nghiệp' : 
          key === 'enterprise' ? 'Doanh nghiệp' : 'Tùy chỉnh',
    value: value as number,
    color: COLORS[Object.keys(stats.categoryStats).indexOf(key)]
  }));

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Tổng gói dịch vụ
                </p>
                <p className="text-2xl font-bold">{stats.totalPackages}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats.activePackages} đang hoạt động
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Tổng doanh nghiệp
                </p>
                <p className="text-2xl font-bold">{stats.totalEnterprises}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{stats.growthRate}% so với tháng trước
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Doanh thu tháng
                </p>
                <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{stats.growthRate}% tăng trưởng
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Tỷ lệ chuyển đổi
                </p>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  Từ trial sang trả phí
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Package */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo gói dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.revenueByPackage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatPrice(value)} />
                <Tooltip 
                  formatter={(value: any) => [formatPrice(value), 'Doanh thu']}
                  labelFormatter={(label) => `Gói: ${label}`}
                />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng doanh thu và khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" tickFormatter={(value) => formatPrice(value)} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'revenue' ? formatPrice(value) : value,
                  name === 'revenue' ? 'Doanh thu' : 'Khách hàng'
                ]}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="subscribers"
                stroke="#82ca9d"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Package Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hiệu suất các gói dịch vụ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.revenueByPackage.map((pkg: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{pkg.name}</p>
                    <p className="text-sm text-slate-600">{pkg.enterprises} doanh nghiệp</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatPrice(pkg.revenue)}</p>
                  <p className="text-xs text-slate-500">doanh thu/tháng</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
