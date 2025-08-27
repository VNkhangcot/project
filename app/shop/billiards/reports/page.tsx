'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock,
  Gamepad2
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Định nghĩa kiểu dữ liệu
interface RevenueData {
  date: string;
  tableSales: number;
  foodSales: number;
  drinkSales: number;
  totalSales: number;
  customers: number;
  playTime: number; // phút
  tables: {
    [key: string]: {
      revenue: number;
      sessions: number;
      playTime: number;
    }
  };
}

// Mock data cho báo cáo doanh thu
const mockRevenueData: RevenueData[] = [
  {
    date: '15/01/2024',
    tableSales: 450000,
    foodSales: 120000,
    drinkSales: 350000,
    totalSales: 920000,
    customers: 15,
    playTime: 480,
    tables: {
      'Bàn 1': { revenue: 150000, sessions: 3, playTime: 180 },
      'Bàn 2': { revenue: 120000, sessions: 2, playTime: 120 },
      'Bàn 3': { revenue: 180000, sessions: 2, playTime: 180 }
    }
  },
  {
    date: '14/01/2024',
    tableSales: 520000,
    foodSales: 180000,
    drinkSales: 420000,
    totalSales: 1120000,
    customers: 20,
    playTime: 600,
    tables: {
      'Bàn 1': { revenue: 180000, sessions: 3, playTime: 210 },
      'Bàn 2': { revenue: 150000, sessions: 2, playTime: 150 },
      'Bàn 3': { revenue: 190000, sessions: 3, playTime: 240 }
    }
  },
  {
    date: '13/01/2024',
    tableSales: 380000,
    foodSales: 100000,
    drinkSales: 280000,
    totalSales: 760000,
    customers: 12,
    playTime: 360,
    tables: {
      'Bàn 1': { revenue: 120000, sessions: 2, playTime: 120 },
      'Bàn 2': { revenue: 90000, sessions: 1, playTime: 90 },
      'Bàn 3': { revenue: 170000, sessions: 2, playTime: 150 }
    }
  },
  {
    date: '12/01/2024',
    tableSales: 480000,
    foodSales: 150000,
    drinkSales: 320000,
    totalSales: 950000,
    customers: 18,
    playTime: 540,
    tables: {
      'Bàn 1': { revenue: 160000, sessions: 3, playTime: 180 },
      'Bàn 2': { revenue: 140000, sessions: 2, playTime: 150 },
      'Bàn 3': { revenue: 180000, sessions: 2, playTime: 210 }
    }
  },
  {
    date: '11/01/2024',
    tableSales: 420000,
    foodSales: 130000,
    drinkSales: 300000,
    totalSales: 850000,
    customers: 16,
    playTime: 480,
    tables: {
      'Bàn 1': { revenue: 140000, sessions: 2, playTime: 150 },
      'Bàn 2': { revenue: 130000, sessions: 2, playTime: 150 },
      'Bàn 3': { revenue: 150000, sessions: 2, playTime: 180 }
    }
  }
];

export default function BilliardsReportsPage() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>(mockRevenueData);
  const [dateRange, setDateRange] = useState<string>('week');
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours} giờ ` : ''}${mins > 0 ? `${mins} phút` : ''}`;
  };

  // Calculate stats
  const totalRevenue = revenueData.reduce((sum, day) => sum + day.totalSales, 0);
  const totalTableSales = revenueData.reduce((sum, day) => sum + day.tableSales, 0);
  const totalFoodSales = revenueData.reduce((sum, day) => sum + day.foodSales, 0);
  const totalDrinkSales = revenueData.reduce((sum, day) => sum + day.drinkSales, 0);
  const totalCustomers = revenueData.reduce((sum, day) => sum + day.customers, 0);
  const totalPlayTime = revenueData.reduce((sum, day) => sum + day.playTime, 0);
  
  // Calculate averages
  const avgDailyRevenue = totalRevenue / revenueData.length;
  const avgCustomersPerDay = totalCustomers / revenueData.length;
  const avgPlayTimePerDay = totalPlayTime / revenueData.length;
  const avgRevenuePerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  // Calculate table performance
  const tablePerformance: {
    tableName: string;
    revenue: number;
    sessions: number;
    playTime: number;
    avgRevenuePerSession: number;
  }[] = [];

  // Collect all table names
  const tableNames = new Set<string>();
  revenueData.forEach(day => {
    Object.keys(day.tables).forEach(tableName => {
      tableNames.add(tableName);
    });
  });

  // Calculate performance for each table
  Array.from(tableNames).forEach(tableName => {
    let revenue = 0;
    let sessions = 0;
    let playTime = 0;

    revenueData.forEach(day => {
      if (day.tables[tableName]) {
        revenue += day.tables[tableName].revenue;
        sessions += day.tables[tableName].sessions;
        playTime += day.tables[tableName].playTime;
      }
    });

    tablePerformance.push({
      tableName,
      revenue,
      sessions,
      playTime,
      avgRevenuePerSession: sessions > 0 ? revenue / sessions : 0
    });
  });

  // Sort tables by revenue
  tablePerformance.sort((a, b) => b.revenue - a.revenue);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Báo cáo doanh thu
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Phân tích doanh thu và hiệu suất kinh doanh quán bida
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex justify-between items-center">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="yesterday">Hôm qua</SelectItem>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    TB: {formatCurrency(avgDailyRevenue)}/ngày
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Khách hàng</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalCustomers}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    TB: {Math.round(avgCustomersPerDay)}/ngày
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Thời gian chơi</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatTime(totalPlayTime)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    TB: {formatTime(Math.round(avgPlayTimePerDay))}/ngày
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Doanh thu/khách</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(avgRevenuePerCustomer)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
                    Tăng 5% so với tuần trước
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Phân tích doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Tiền bàn</p>
                  <p className="text-sm font-bold">{formatCurrency(totalTableSales)}</p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(totalTableSales / totalRevenue) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {Math.round((totalTableSales / totalRevenue) * 100)}% tổng doanh thu
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Đồ ăn</p>
                  <p className="text-sm font-bold">{formatCurrency(totalFoodSales)}</p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${(totalFoodSales / totalRevenue) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {Math.round((totalFoodSales / totalRevenue) * 100)}% tổng doanh thu
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Đồ uống</p>
                  <p className="text-sm font-bold">{formatCurrency(totalDrinkSales)}</p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-600 h-2.5 rounded-full" 
                    style={{ width: `${(totalDrinkSales / totalRevenue) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {Math.round((totalDrinkSales / totalRevenue) * 100)}% tổng doanh thu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="tables">Hiệu suất bàn</TabsTrigger>
            <TabsTrigger value="daily">Doanh thu theo ngày</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Biểu đồ doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <BarChart className="h-16 w-16 text-slate-300" />
                  <p className="ml-4 text-slate-500 dark:text-slate-400">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tables Tab */}
          <TabsContent value="tables" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất bàn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Bàn</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Doanh thu</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Lượt chơi</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thời gian chơi</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">TB/lượt</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Hiệu suất</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {tablePerformance.map((table) => (
                        <tr key={table.tableName} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                            {table.tableName}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {formatCurrency(table.revenue)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {table.sessions}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {formatTime(table.playTime)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                            {formatCurrency(table.avgRevenuePerSession)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center">
                              <div className="w-full max-w-[100px] bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${(table.revenue / tablePerformance[0].revenue) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Tab */}
          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo ngày</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tiền bàn</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Đồ ăn</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Đồ uống</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tổng doanh thu</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Khách hàng</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thời gian chơi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {revenueData.map((day) => (
                        <tr key={day.date} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                            {day.date}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {formatCurrency(day.tableSales)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {formatCurrency(day.foodSales)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {formatCurrency(day.drinkSales)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                            {formatCurrency(day.totalSales)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {day.customers}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                            {formatTime(day.playTime)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
}
