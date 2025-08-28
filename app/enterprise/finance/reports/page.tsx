'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  Filter
} from 'lucide-react';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function FinanceReportsPage() {
  const [periodFilter, setPeriodFilter] = useState('month');
  const [yearFilter, setYearFilter] = useState('2024');
  const [monthFilter, setMonthFilter] = useState('1');
  const [quarterFilter, setQuarterFilter] = useState('1');
  
  // Dữ liệu mẫu cho báo cáo tài chính
  const financialData = {
    revenue: 1250000000,
    expenses: 850000000,
    profit: 400000000,
    previousRevenue: 1100000000,
    previousExpenses: 780000000,
    previousProfit: 320000000,
    revenueGrowth: 13.64,
    expensesGrowth: 8.97,
    profitGrowth: 25.00,
    
    // Dữ liệu cho biểu đồ doanh thu theo tháng
    monthlyRevenue: [
      { month: 'T1', value: 1250000000 },
      { month: 'T2', value: 0 },
      { month: 'T3', value: 0 },
      { month: 'T4', value: 0 },
      { month: 'T5', value: 0 },
      { month: 'T6', value: 0 },
      { month: 'T7', value: 0 },
      { month: 'T8', value: 0 },
      { month: 'T9', value: 0 },
      { month: 'T10', value: 0 },
      { month: 'T11', value: 0 },
      { month: 'T12', value: 0 }
    ],
    
    // Dữ liệu cho biểu đồ chi phí theo danh mục
    expensesByCategory: [
      { category: 'Lương nhân viên', value: 500000000 },
      { category: 'Vận hành', value: 150000000 },
      { category: 'Marketing', value: 100000000 },
      { category: 'Thuê văn phòng', value: 80000000 },
      { category: 'Khác', value: 20000000 }
    ],
    
    // Dữ liệu cho biểu đồ doanh thu theo sản phẩm/dịch vụ
    revenueByProduct: [
      { product: 'Sản phẩm A', value: 500000000 },
      { product: 'Sản phẩm B', value: 350000000 },
      { product: 'Dịch vụ C', value: 250000000 },
      { product: 'Dịch vụ D', value: 150000000 }
    ],
    
    // Dữ liệu cho bảng cân đối kế toán
    balanceSheet: {
      assets: 5000000000,
      liabilities: 2000000000,
      equity: 3000000000
    },
    
    // Dữ liệu cho báo cáo lưu chuyển tiền tệ
    cashFlow: {
      operatingActivities: 450000000,
      investingActivities: -150000000,
      financingActivities: -50000000,
      netCashFlow: 250000000
    }
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm định dạng phần trăm
  const formatPercent = (percent: number) => {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  // Hàm lấy màu cho chỉ số tăng trưởng
  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Hàm lấy icon cho chỉ số tăng trưởng
  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 
      <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-600" />;
  };

  // Hàm lấy tiêu đề báo cáo dựa trên bộ lọc
  const getReportTitle = () => {
    if (periodFilter === 'month') {
      const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                          'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
      return `Báo cáo tài chính ${monthNames[parseInt(monthFilter) - 1]} năm ${yearFilter}`;
    } else if (periodFilter === 'quarter') {
      return `Báo cáo tài chính Quý ${quarterFilter} năm ${yearFilter}`;
    } else {
      return `Báo cáo tài chính năm ${yearFilter}`;
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo tài chính</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Lịch sử báo cáo
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">Lọc báo cáo:</span>
              </div>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Kỳ báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Tháng</SelectItem>
                  <SelectItem value="quarter">Quý</SelectItem>
                  <SelectItem value="year">Năm</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              
              {periodFilter === 'month' && (
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tháng 1</SelectItem>
                    <SelectItem value="2">Tháng 2</SelectItem>
                    <SelectItem value="3">Tháng 3</SelectItem>
                    <SelectItem value="4">Tháng 4</SelectItem>
                    <SelectItem value="5">Tháng 5</SelectItem>
                    <SelectItem value="6">Tháng 6</SelectItem>
                    <SelectItem value="7">Tháng 7</SelectItem>
                    <SelectItem value="8">Tháng 8</SelectItem>
                    <SelectItem value="9">Tháng 9</SelectItem>
                    <SelectItem value="10">Tháng 10</SelectItem>
                    <SelectItem value="11">Tháng 11</SelectItem>
                    <SelectItem value="12">Tháng 12</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {periodFilter === 'quarter' && (
                <Select value={quarterFilter} onValueChange={setQuarterFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Quý" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Quý 1</SelectItem>
                    <SelectItem value="2">Quý 2</SelectItem>
                    <SelectItem value="3">Quý 3</SelectItem>
                    <SelectItem value="4">Quý 4</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Title */}
        <div className="text-center">
          <h2 className="text-xl font-semibold">{getReportTitle()}</h2>
          <p className="text-sm text-slate-500">So sánh với kỳ trước</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium text-slate-600">Doanh thu</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(financialData.revenueGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(financialData.revenueGrowth)}`}>
                      {formatPercent(financialData.revenueGrowth)}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{formatCurrency(financialData.revenue)}</p>
                <p className="text-xs text-slate-500 mt-1">Kỳ trước: {formatCurrency(financialData.previousRevenue)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <p className="text-sm font-medium text-slate-600">Chi phí</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(-financialData.expensesGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(-financialData.expensesGrowth)}`}>
                      {formatPercent(financialData.expensesGrowth)}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{formatCurrency(financialData.expenses)}</p>
                <p className="text-xs text-slate-500 mt-1">Kỳ trước: {formatCurrency(financialData.previousExpenses)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-slate-600">Lợi nhuận</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(financialData.profitGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(financialData.profitGrowth)}`}>
                      {formatPercent(financialData.profitGrowth)}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{formatCurrency(financialData.profit)}</p>
                <p className="text-xs text-slate-500 mt-1">Kỳ trước: {formatCurrency(financialData.previousProfit)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="income">Báo cáo thu nhập</TabsTrigger>
            <TabsTrigger value="balance">Bảng cân đối</TabsTrigger>
            <TabsTrigger value="cashflow">Lưu chuyển tiền tệ</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Doanh thu theo tháng</CardTitle>
                  <CardDescription>
                    Biểu đồ doanh thu năm {yearFilter}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ doanh thu theo tháng</p>
                  </div>
                </CardContent>
              </Card>

              {/* Expense by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Chi phí theo danh mục</CardTitle>
                  <CardDescription>
                    Phân bổ chi phí theo danh mục
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ chi phí theo danh mục</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue by Product */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Doanh thu theo sản phẩm/dịch vụ</CardTitle>
                <CardDescription>
                  Phân tích doanh thu theo từng sản phẩm/dịch vụ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-slate-300" />
                  <p className="text-slate-500 ml-2">Biểu đồ doanh thu theo sản phẩm/dịch vụ</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Income Statement Tab */}
          <TabsContent value="income" className="space-y-4">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Báo cáo thu nhập</CardTitle>
                <CardDescription>
                  {getReportTitle()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Doanh thu</span>
                      <span>{formatCurrency(financialData.revenue)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Doanh thu từ sản phẩm</span>
                      <span>{formatCurrency(850000000)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Doanh thu từ dịch vụ</span>
                      <span>{formatCurrency(400000000)}</span>
                    </div>
                  </div>
                  
                  <div className="border-b pb-2">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Chi phí</span>
                      <span>{formatCurrency(financialData.expenses)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Chi phí nhân viên</span>
                      <span>{formatCurrency(500000000)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Chi phí vận hành</span>
                      <span>{formatCurrency(150000000)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Chi phí marketing</span>
                      <span>{formatCurrency(100000000)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Chi phí thuê văn phòng</span>
                      <span>{formatCurrency(80000000)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Chi phí khác</span>
                      <span>{formatCurrency(20000000)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between py-2 font-bold">
                      <span>Lợi nhuận</span>
                      <span>{formatCurrency(financialData.profit)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Balance Sheet Tab */}
          <TabsContent value="balance" className="space-y-4">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Bảng cân đối kế toán</CardTitle>
                <CardDescription>
                  {getReportTitle()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Tài sản</span>
                      <span>{formatCurrency(financialData.balanceSheet.assets)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Tài sản ngắn hạn</span>
                      <span>{formatCurrency(2000000000)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Tài sản dài hạn</span>
                      <span>{formatCurrency(3000000000)}</span>
                    </div>
                  </div>
                  
                  <div className="border-b pb-2">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Nợ phải trả</span>
                      <span>{formatCurrency(financialData.balanceSheet.liabilities)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Nợ ngắn hạn</span>
                      <span>{formatCurrency(800000000)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Nợ dài hạn</span>
                      <span>{formatCurrency(1200000000)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Vốn chủ sở hữu</span>
                      <span>{formatCurrency(financialData.balanceSheet.equity)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Vốn góp</span>
                      <span>{formatCurrency(2000000000)}</span>
                    </div>
                    <div className="flex justify-between py-2 pl-4 text-sm text-slate-600">
                      <span>Lợi nhuận chưa phân phối</span>
                      <span>{formatCurrency(1000000000)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between py-2 font-bold">
                      <span>Tổng cộng tài sản</span>
                      <span>{formatCurrency(financialData.balanceSheet.assets)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold">
                      <span>Tổng cộng nguồn vốn</span>
                      <span>{formatCurrency(financialData.balanceSheet.liabilities + financialData.balanceSheet.equity)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Cash Flow Tab */}
          <TabsContent value="cashflow" className="space-y-4">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Báo cáo lưu chuyển tiền tệ</CardTitle>
                <CardDescription>
                  {getReportTitle()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Lưu chuyển tiền từ hoạt động kinh doanh</span>
                      <span className={financialData.cashFlow.operatingActivities >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(financialData.cashFlow.operatingActivities)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-b pb-2">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Lưu chuyển tiền từ hoạt động đầu tư</span>
                      <span className={financialData.cashFlow.investingActivities >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(financialData.cashFlow.investingActivities)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-b pb-2">
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Lưu chuyển tiền từ hoạt động tài chính</span>
                      <span className={financialData.cashFlow.financingActivities >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(financialData.cashFlow.financingActivities)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between py-2 font-bold">
                      <span>Lưu chuyển tiền thuần trong kỳ</span>
                      <span className={financialData.cashFlow.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(financialData.cashFlow.netCashFlow)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Tải báo cáo thu nhập
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Tải bảng cân đối kế toán
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Tải báo cáo lưu chuyển tiền tệ
          </Button>
        </div>
      </div>
    </EnterpriseLayout>
  );
}
