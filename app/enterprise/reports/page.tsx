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
  Filter,
  Users,
  Package,
  ShoppingBag,
  Building2,
  Briefcase,
  CreditCard,
  Warehouse,
  Clock,
  Printer
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function EnterpriseReportsPage() {
  const [periodFilter, setPeriodFilter] = useState('month');
  const [yearFilter, setYearFilter] = useState('2024');
  const [monthFilter, setMonthFilter] = useState('1');
  const [quarterFilter, setQuarterFilter] = useState('1');
  
  // Dữ liệu mẫu cho báo cáo tổng quan
  const overviewData = {
    summary: {
      revenue: 2850000000,
      profit: 950000000,
      expenses: 1900000000,
      orders: 1250,
      customers: 850,
      employees: 120,
      products: 1500,
      previousRevenue: 2500000000,
      previousProfit: 800000000,
      revenueGrowth: 14.00,
      profitGrowth: 18.75,
    },
    
    // Dữ liệu cho biểu đồ doanh thu và lợi nhuận theo tháng
    monthlyFinancials: [
      { month: 'T1', revenue: 2850000000, profit: 950000000, expenses: 1900000000 },
      { month: 'T2', revenue: 2700000000, profit: 900000000, expenses: 1800000000 },
      { month: 'T3', revenue: 2900000000, profit: 980000000, expenses: 1920000000 },
      { month: 'T4', revenue: 2800000000, profit: 930000000, expenses: 1870000000 },
      { month: 'T5', revenue: 2950000000, profit: 1000000000, expenses: 1950000000 },
      { month: 'T6', revenue: 3100000000, profit: 1050000000, expenses: 2050000000 },
      { month: 'T7', revenue: 2750000000, profit: 920000000, expenses: 1830000000 },
      { month: 'T8', revenue: 2650000000, profit: 880000000, expenses: 1770000000 },
      { month: 'T9', revenue: 2800000000, profit: 940000000, expenses: 1860000000 },
      { month: 'T10', revenue: 2900000000, profit: 970000000, expenses: 1930000000 },
      { month: 'T11', revenue: 3050000000, profit: 1020000000, expenses: 2030000000 },
      { month: 'T12', revenue: 3200000000, profit: 1100000000, expenses: 2100000000 }
    ],
    
    // Dữ liệu cho biểu đồ doanh thu theo danh mục sản phẩm
    revenueByCategory: [
      { category: 'Điện tử', value: 1200000000 },
      { category: 'Thời trang', value: 750000000 },
      { category: 'Đồ gia dụng', value: 450000000 },
      { category: 'Thực phẩm', value: 300000000 },
      { category: 'Khác', value: 150000000 }
    ],
    
    // Dữ liệu cho biểu đồ chi phí theo loại
    expensesByType: [
      { type: 'Nhân sự', value: 950000000 },
      { type: 'Vận hành', value: 350000000 },
      { type: 'Marketing', value: 250000000 },
      { type: 'Thuê mặt bằng', value: 200000000 },
      { type: 'Khác', value: 150000000 }
    ],
    
    // Dữ liệu cho biểu đồ doanh thu theo kênh bán hàng
    revenueByChannel: [
      { channel: 'Trực tuyến', value: 1500000000 },
      { channel: 'Cửa hàng', value: 950000000 },
      { channel: 'Đại lý', value: 400000000 }
    ],
    
    // Dữ liệu cho biểu đồ nhân sự theo phòng ban
    employeesByDepartment: [
      { department: 'Kinh doanh', count: 35 },
      { department: 'Kỹ thuật', count: 25 },
      { department: 'Marketing', count: 15 },
      { department: 'Nhân sự', count: 10 },
      { department: 'Tài chính', count: 12 },
      { department: 'Vận hành', count: 18 },
      { department: 'Khác', count: 5 }
    ]
  };
  
  // Dữ liệu mẫu cho báo cáo nhân sự
  const hrData = {
    summary: {
      totalEmployees: 120,
      newHires: 8,
      turnover: 3,
      openPositions: 5,
      averageSalary: 15000000,
      totalSalary: 1800000000,
      maleEmployees: 65,
      femaleEmployees: 55
    },
    
    // Dữ liệu cho biểu đồ nhân sự theo phòng ban
    employeesByDepartment: [
      { department: 'Kinh doanh', count: 35, maleCount: 20, femaleCount: 15 },
      { department: 'Kỹ thuật', count: 25, maleCount: 18, femaleCount: 7 },
      { department: 'Marketing', count: 15, maleCount: 6, femaleCount: 9 },
      { department: 'Nhân sự', count: 10, maleCount: 3, femaleCount: 7 },
      { department: 'Tài chính', count: 12, maleCount: 5, femaleCount: 7 },
      { department: 'Vận hành', count: 18, maleCount: 10, femaleCount: 8 },
      { department: 'Khác', count: 5, maleCount: 3, femaleCount: 2 }
    ],
    
    // Dữ liệu cho biểu đồ nhân sự theo chức vụ
    employeesByPosition: [
      { position: 'Giám đốc', count: 5 },
      { position: 'Trưởng phòng', count: 12 },
      { position: 'Trưởng nhóm', count: 18 },
      { position: 'Nhân viên', count: 85 }
    ],
    
    // Dữ liệu cho biểu đồ lương theo phòng ban
    salaryByDepartment: [
      { department: 'Kinh doanh', averageSalary: 16500000, totalSalary: 577500000 },
      { department: 'Kỹ thuật', averageSalary: 18000000, totalSalary: 450000000 },
      { department: 'Marketing', averageSalary: 15000000, totalSalary: 225000000 },
      { department: 'Nhân sự', averageSalary: 14000000, totalSalary: 140000000 },
      { department: 'Tài chính', averageSalary: 16000000, totalSalary: 192000000 },
      { department: 'Vận hành', averageSalary: 12000000, totalSalary: 216000000 }
    ],
    
    // Dữ liệu cho biểu đồ tuyển dụng theo tháng
    hiringByMonth: [
      { month: 'T1', hired: 8, left: 3 },
      { month: 'T2', hired: 5, left: 2 },
      { month: 'T3', hired: 7, left: 1 },
      { month: 'T4', hired: 4, left: 2 },
      { month: 'T5', hired: 6, left: 3 },
      { month: 'T6', hired: 5, left: 2 },
      { month: 'T7', hired: 3, left: 1 },
      { month: 'T8', hired: 4, left: 2 },
      { month: 'T9', hired: 6, left: 1 },
      { month: 'T10', hired: 5, left: 2 },
      { month: 'T11', hired: 7, left: 3 },
      { month: 'T12', hired: 6, left: 2 }
    ],
    
    // Dữ liệu cho top nhân viên hiệu quả
    topPerformers: [
      { id: '1', name: 'Nguyễn Văn A', department: 'Kinh doanh', position: 'Trưởng phòng', performance: 95, sales: 350000000 },
      { id: '2', name: 'Trần Thị B', department: 'Kinh doanh', position: 'Nhân viên', performance: 92, sales: 280000000 },
      { id: '3', name: 'Lê Văn C', department: 'Kỹ thuật', position: 'Trưởng nhóm', performance: 90, sales: null },
      { id: '4', name: 'Phạm Thị D', department: 'Marketing', position: 'Trưởng phòng', performance: 88, sales: null },
      { id: '5', name: 'Hoàng Văn E', department: 'Kinh doanh', position: 'Nhân viên', performance: 87, sales: 250000000 }
    ]
  };
  
  // Dữ liệu mẫu cho báo cáo kho hàng
  const inventoryData = {
    summary: {
      totalProducts: 1500,
      totalValue: 3500000000,
      lowStockItems: 85,
      outOfStockItems: 25,
      totalImport: 750000000,
      totalExport: 850000000,
      inventoryTurnover: 4.2
    },
    
    // Dữ liệu cho biểu đồ giá trị tồn kho theo tháng
    inventoryValueByMonth: [
      { month: 'T1', value: 3500000000 },
      { month: 'T2', value: 3450000000 },
      { month: 'T3', value: 3600000000 },
      { month: 'T4', value: 3550000000 },
      { month: 'T5', value: 3650000000 },
      { month: 'T6', value: 3700000000 },
      { month: 'T7', value: 3600000000 },
      { month: 'T8', value: 3550000000 },
      { month: 'T9', value: 3650000000 },
      { month: 'T10', value: 3700000000 },
      { month: 'T11', value: 3750000000 },
      { month: 'T12', value: 3800000000 }
    ],
    
    // Dữ liệu cho biểu đồ giá trị tồn kho theo danh mục
    inventoryValueByCategory: [
      { category: 'Điện tử', value: 1400000000 },
      { category: 'Thời trang', value: 850000000 },
      { category: 'Đồ gia dụng', value: 650000000 },
      { category: 'Thực phẩm', value: 350000000 },
      { category: 'Khác', value: 250000000 }
    ],
    
    // Dữ liệu cho biểu đồ nhập xuất kho theo tháng
    inventoryMovementByMonth: [
      { month: 'T1', import: 750000000, export: 850000000 },
      { month: 'T2', import: 700000000, export: 800000000 },
      { month: 'T3', import: 800000000, export: 750000000 },
      { month: 'T4', import: 750000000, export: 800000000 },
      { month: 'T5', import: 850000000, export: 800000000 },
      { month: 'T6', import: 900000000, export: 850000000 },
      { month: 'T7', import: 750000000, export: 800000000 },
      { month: 'T8', import: 700000000, export: 750000000 },
      { month: 'T9', import: 800000000, export: 750000000 },
      { month: 'T10', import: 850000000, export: 800000000 },
      { month: 'T11', import: 900000000, export: 850000000 },
      { month: 'T12', import: 950000000, export: 900000000 }
    ],
    
    // Dữ liệu cho top sản phẩm tồn kho nhiều nhất
    topStockProducts: [
      { id: '1', name: 'Laptop ABC', sku: 'SP001', quantity: 120, value: 360000000, category: 'Điện tử' },
      { id: '2', name: 'Điện thoại XYZ', sku: 'SP002', quantity: 85, value: 255000000, category: 'Điện tử' },
      { id: '3', name: 'Áo thun nam', sku: 'SP003', quantity: 350, value: 87500000, category: 'Thời trang' },
      { id: '4', name: 'Nồi cơm điện', sku: 'SP004', quantity: 95, value: 76000000, category: 'Đồ gia dụng' },
      { id: '5', name: 'Bàn làm việc', sku: 'SP005', quantity: 65, value: 130000000, category: 'Đồ gia dụng' }
    ],
    
    // Dữ liệu cho sản phẩm sắp hết hàng
    lowStockProducts: [
      { id: '1', name: 'Tai nghe không dây', sku: 'SP010', quantity: 5, threshold: 20, status: 'low' },
      { id: '2', name: 'Bàn phím cơ', sku: 'SP011', quantity: 8, threshold: 25, status: 'low' },
      { id: '3', name: 'Chuột gaming', sku: 'SP012', quantity: 0, threshold: 30, status: 'out' },
      { id: '4', name: 'Áo khoác nữ', sku: 'SP013', quantity: 7, threshold: 30, status: 'low' },
      { id: '5', name: 'Đèn bàn', sku: 'SP014', quantity: 0, threshold: 15, status: 'out' }
    ]
  };
  
  // Dữ liệu mẫu cho báo cáo bán hàng
  const salesData = {
    summary: {
      revenue: 2850000000,
      orders: 1250,
      averageOrderValue: 2280000,
      customers: 850,
      newCustomers: 120,
      returnRate: 3.5,
      conversionRate: 2.8
    },
    
    // Dữ liệu cho biểu đồ doanh thu theo tháng
    revenueByMonth: [
      { month: 'T1', value: 2850000000 },
      { month: 'T2', value: 2700000000 },
      { month: 'T3', value: 2900000000 },
      { month: 'T4', value: 2800000000 },
      { month: 'T5', value: 2950000000 },
      { month: 'T6', value: 3100000000 },
      { month: 'T7', value: 2750000000 },
      { month: 'T8', value: 2650000000 },
      { month: 'T9', value: 2800000000 },
      { month: 'T10', value: 2900000000 },
      { month: 'T11', value: 3050000000 },
      { month: 'T12', value: 3200000000 }
    ],
    
    // Dữ liệu cho biểu đồ doanh thu theo danh mục sản phẩm
    revenueByCategoryAndChannel: [
      { category: 'Điện tử', online: 800000000, store: 300000000, agent: 100000000 },
      { category: 'Thời trang', online: 400000000, store: 300000000, agent: 50000000 },
      { category: 'Đồ gia dụng', online: 200000000, store: 200000000, agent: 50000000 },
      { category: 'Thực phẩm', online: 50000000, store: 200000000, agent: 50000000 },
      { category: 'Khác', online: 50000000, store: 50000000, agent: 50000000 }
    ],
    
    // Dữ liệu cho biểu đồ đơn hàng theo tháng
    ordersByMonth: [
      { month: 'T1', count: 1250 },
      { month: 'T2', count: 1180 },
      { month: 'T3', count: 1300 },
      { month: 'T4', count: 1220 },
      { month: 'T5', count: 1350 },
      { month: 'T6', count: 1400 },
      { month: 'T7', count: 1250 },
      { month: 'T8', count: 1200 },
      { month: 'T9', count: 1280 },
      { month: 'T10', count: 1320 },
      { month: 'T11', count: 1380 },
      { month: 'T12', count: 1450 }
    ],
    
    // Dữ liệu cho top sản phẩm bán chạy
    topSellingProducts: [
      { id: '1', name: 'Điện thoại XYZ', sku: 'SP001', sold: 250, revenue: 750000000, category: 'Điện tử' },
      { id: '2', name: 'Laptop ABC', sku: 'SP002', sold: 120, revenue: 600000000, category: 'Điện tử' },
      { id: '3', name: 'Tai nghe không dây', sku: 'SP003', sold: 350, revenue: 140000000, category: 'Điện tử' },
      { id: '4', name: 'Áo thun nam', sku: 'SP004', sold: 500, revenue: 125000000, category: 'Thời trang' },
      { id: '5', name: 'Nồi cơm điện', sku: 'SP005', sold: 180, revenue: 144000000, category: 'Đồ gia dụng' }
    ],
    
    // Dữ liệu cho top khách hàng
    topCustomers: [
      { id: '1', name: 'Nguyễn Văn A', orders: 15, spent: 45000000, type: 'VIP' },
      { id: '2', name: 'Công ty TNHH XYZ', orders: 12, spent: 180000000, type: 'Doanh nghiệp' },
      { id: '3', name: 'Trần Thị B', orders: 18, spent: 36000000, type: 'VIP' },
      { id: '4', name: 'Lê Văn C', orders: 10, spent: 25000000, type: 'Thường' },
      { id: '5', name: 'Công ty ABC', orders: 8, spent: 120000000, type: 'Doanh nghiệp' }
    ]
  };
  
  // Dữ liệu mẫu cho báo cáo tài chính
  const financeData = {
    summary: {
      revenue: 2850000000,
      expenses: 1900000000,
      profit: 950000000,
      tax: 190000000,
      netProfit: 760000000,
      assets: 12000000000,
      liabilities: 5000000000,
      equity: 7000000000
    },
    
    // Dữ liệu cho biểu đồ doanh thu, chi phí và lợi nhuận theo tháng
    financialsByMonth: [
      { month: 'T1', revenue: 2850000000, expenses: 1900000000, profit: 950000000 },
      { month: 'T2', revenue: 2700000000, expenses: 1800000000, profit: 900000000 },
      { month: 'T3', revenue: 2900000000, expenses: 1920000000, profit: 980000000 },
      { month: 'T4', revenue: 2800000000, expenses: 1870000000, profit: 930000000 },
      { month: 'T5', revenue: 2950000000, expenses: 1950000000, profit: 1000000000 },
      { month: 'T6', revenue: 3100000000, expenses: 2050000000, profit: 1050000000 },
      { month: 'T7', revenue: 2750000000, expenses: 1830000000, profit: 920000000 },
      { month: 'T8', revenue: 2650000000, expenses: 1770000000, profit: 880000000 },
      { month: 'T9', revenue: 2800000000, expenses: 1860000000, profit: 940000000 },
      { month: 'T10', revenue: 2900000000, expenses: 1930000000, profit: 970000000 },
      { month: 'T11', revenue: 3050000000, expenses: 2030000000, profit: 1020000000 },
      { month: 'T12', revenue: 3200000000, expenses: 2100000000, profit: 1100000000 }
    ],
    
    // Dữ liệu cho biểu đồ chi phí theo loại
    expensesByType: [
      { type: 'Nhân sự', value: 950000000 },
      { type: 'Vận hành', value: 350000000 },
      { type: 'Marketing', value: 250000000 },
      { type: 'Thuê mặt bằng', value: 200000000 },
      { type: 'Khác', value: 150000000 }
    ],
    
    // Dữ liệu cho biểu đồ doanh thu theo kênh bán hàng
    revenueByChannel: [
      { channel: 'Trực tuyến', value: 1500000000 },
      { channel: 'Cửa hàng', value: 950000000 },
      { channel: 'Đại lý', value: 400000000 }
    ],
    
    // Dữ liệu cho bảng cân đối kế toán
    balanceSheet: {
      assets: {
        current: {
          cash: 2000000000,
          accountsReceivable: 1500000000,
          inventory: 3500000000,
          otherCurrent: 500000000
        },
        nonCurrent: {
          fixedAssets: 3500000000,
          intangibleAssets: 800000000,
          otherNonCurrent: 200000000
        }
      },
      liabilities: {
        current: {
          accountsPayable: 1200000000,
          shortTermLoans: 1500000000,
          otherCurrent: 300000000
        },
        nonCurrent: {
          longTermLoans: 1800000000,
          otherNonCurrent: 200000000
        }
      },
      equity: {
        capital: 5000000000,
        retainedEarnings: 2000000000
      }
    },
    
    // Dữ liệu cho báo cáo lưu chuyển tiền tệ
    cashFlow: {
      operating: 1200000000,
      investing: -800000000,
      financing: -200000000,
      netCashFlow: 200000000
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
      return `Báo cáo tổng quan ${monthNames[parseInt(monthFilter) - 1]} năm ${yearFilter}`;
    } else if (periodFilter === 'quarter') {
      return `Báo cáo tổng quan Quý ${quarterFilter} năm ${yearFilter}`;
    } else {
      return `Báo cáo tổng quan năm ${yearFilter}`;
    }
  };

  // Hàm lấy màu cho loại khách hàng
  const getCustomerTypeColor = (type: string) => {
    switch(type) {
      case 'VIP':
        return 'bg-amber-100 text-amber-800';
      case 'Doanh nghiệp':
        return 'bg-blue-100 text-blue-800';
      case 'Thường':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy màu cho trạng thái tồn kho
  const getStockStatusColor = (status: string) => {
    switch(status) {
      case 'low':
        return 'bg-amber-100 text-amber-800';
      case 'out':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho trạng thái tồn kho
  const getStockStatusText = (status: string) => {
    switch(status) {
      case 'low':
        return 'Sắp hết';
      case 'out':
        return 'Hết hàng';
      default:
        return 'Bình thường';
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getReportTitle()}
            </h1>
            <p className="text-muted-foreground">
              Xem báo cáo tổng quan về tình hình kinh doanh của doanh nghiệp
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Chọn kỳ báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Tháng</SelectItem>
                  <SelectItem value="quarter">Quý</SelectItem>
                  <SelectItem value="year">Năm</SelectItem>
                </SelectContent>
              </Select>
              
              {periodFilter === 'month' && (
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Tháng {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {periodFilter === 'quarter' && (
                <Select value={quarterFilter} onValueChange={setQuarterFilter}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Quý" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 4 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Quý {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
            
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              In báo cáo
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="hr">
              <Users className="mr-2 h-4 w-4" />
              Nhân sự
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Warehouse className="mr-2 h-4 w-4" />
              Kho hàng
            </TabsTrigger>
            <TabsTrigger value="sales">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Bán hàng
            </TabsTrigger>
            <TabsTrigger value="finance">
              <DollarSign className="mr-2 h-4 w-4" />
              Tài chính
            </TabsTrigger>
          </TabsList>
          
          {/* Tab Tổng quan */}
          <TabsContent value="overview" className="space-y-6">
            {/* Thống kê tổng quan */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Doanh thu
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(overviewData.summary.revenue)}</div>
                  <div className="flex items-center pt-1">
                    {getGrowthIcon(overviewData.summary.revenueGrowth)}
                    <p className={`text-xs ${getGrowthColor(overviewData.summary.revenueGrowth)}`}>
                      {formatPercent(overviewData.summary.revenueGrowth)}
                    </p>
                    <p className="text-xs text-muted-foreground ml-1">so với kỳ trước</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Lợi nhuận
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(overviewData.summary.profit)}</div>
                  <div className="flex items-center pt-1">
                    {getGrowthIcon(overviewData.summary.profitGrowth)}
                    <p className={`text-xs ${getGrowthColor(overviewData.summary.profitGrowth)}`}>
                      {formatPercent(overviewData.summary.profitGrowth)}
                    </p>
                    <p className="text-xs text-muted-foreground ml-1">so với kỳ trước</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Đơn hàng
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewData.summary.orders.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Tổng số đơn hàng trong kỳ</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Khách hàng
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overviewData.summary.customers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Tổng số khách hàng</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Biểu đồ doanh thu và lợi nhuận theo tháng */}
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu và lợi nhuận theo tháng</CardTitle>
                <CardDescription>
                  Biểu đồ thể hiện doanh thu, chi phí và lợi nhuận theo tháng
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full rounded-md border p-6">
                  {/* Giả lập biểu đồ */}
                  <div className="flex h-full w-full flex-col justify-between">
                    <div className="flex justify-between">
                      {overviewData.monthlyFinancials.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="flex space-x-1">
                            <div 
                              className="bg-blue-500" 
                              style={{ 
                                height: `${(item.revenue / 3500000000) * 200}px`, 
                                width: '12px',
                                borderTopLeftRadius: '3px',
                                borderTopRightRadius: '3px'
                              }}
                            />
                            <div 
                              className="bg-red-500" 
                              style={{ 
                                height: `${(item.expenses / 3500000000) * 200}px`, 
                                width: '12px',
                                borderTopLeftRadius: '3px',
                                borderTopRightRadius: '3px'
                              }}
                            />
                            <div 
                              className="bg-green-500" 
                              style={{ 
                                height: `${(item.profit / 3500000000) * 200}px`, 
                                width: '12px',
                                borderTopLeftRadius: '3px',
                                borderTopRightRadius: '3px'
                              }}
                            />
                          </div>
                          <span className="mt-2 text-xs">{item.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center space-x-4">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-1" />
                        <span className="text-xs">Doanh thu</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-1" />
                        <span className="text-xs">Chi phí</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-1" />
                        <span className="text-xs">Lợi nhuận</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Biểu đồ doanh thu theo danh mục và chi phí theo loại */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo danh mục</CardTitle>
                  <CardDescription>
                    Phân bổ doanh thu theo danh mục sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {overviewData.revenueByCategory.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                        </div>
                        <Progress value={(item.value / 1200000000) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Chi phí theo loại</CardTitle>
                  <CardDescription>
                    Phân bổ chi phí theo loại
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {overviewData.expensesByType.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.type}</span>
                          <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                        </div>
                        <Progress value={(item.value / 950000000) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Biểu đồ doanh thu theo kênh bán hàng và nhân sự theo phòng ban */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo kênh bán hàng</CardTitle>
                  <CardDescription>
                    Phân bổ doanh thu theo kênh bán hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {overviewData.revenueByChannel.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.channel}</span>
                          <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                        </div>
                        <Progress value={(item.value / 1500000000) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Nhân sự theo phòng ban</CardTitle>
                  <CardDescription>
                    Phân bổ nhân sự theo phòng ban
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {overviewData.employeesByDepartment.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.department}</span>
                          <span className="text-sm font-medium">{item.count} nhân viên</span>
                        </div>
                        <Progress value={(item.count / 35) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Nhân sự */}
          <TabsContent value="hr" className="space-y-6">
            {/* Thống kê nhân sự */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng nhân viên
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hrData.summary.totalEmployees}</div>
                  <div className="flex items-center pt-1">
                    <p className="text-xs text-muted-foreground">
                      Nam: {hrData.summary.maleEmployees} | Nữ: {hrData.summary.femaleEmployees}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tuyển dụng mới
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hrData.summary.newHires}</div>
                  <div className="flex items-center pt-1">
                    <p className="text-xs text-muted-foreground">
                      Nghỉ việc: {hrData.summary.turnover} | Vị trí mở: {hrData.summary.openPositions}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Lương trung bình
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(hrData.summary.averageSalary)}</div>
                  <p className="text-xs text-muted-foreground">Tổng quỹ lương: {formatCurrency(hrData.summary.totalSalary)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Vị trí tuyển dụng
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hrData.summary.openPositions}</div>
                  <p className="text-xs text-muted-foreground">Vị trí đang tuyển dụng</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Biểu đồ nhân sự theo phòng ban */}
            <Card>
              <CardHeader>
                <CardTitle>Nhân sự theo phòng ban</CardTitle>
                <CardDescription>
                  Phân bổ nhân sự theo phòng ban và giới tính
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {hrData.employeesByDepartment.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.department}</span>
                        <span className="text-sm font-medium">{item.count} nhân viên</span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                        <div 
                          className="bg-blue-500" 
                          style={{ width: `${(item.maleCount / item.count) * 100}%` }}
                        />
                        <div 
                          className="bg-pink-500" 
                          style={{ width: `${(item.femaleCount / item.count) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Nam: {item.maleCount} ({((item.maleCount / item.count) * 100).toFixed(1)}%)</span>
                        <span>Nữ: {item.femaleCount} ({((item.femaleCount / item.count) * 100).toFixed(1)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-1" />
                    <span className="text-xs">Nam</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-pink-500 mr-1" />
                    <span className="text-xs">Nữ</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Top nhân viên hiệu quả */}
            <Card>
              <CardHeader>
                <CardTitle>Top nhân viên hiệu quả</CardTitle>
                <CardDescription>
                  Danh sách nhân viên có hiệu suất cao nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nhân viên</TableHead>
                      <TableHead>Phòng ban</TableHead>
                      <TableHead>Chức vụ</TableHead>
                      <TableHead>Hiệu suất</TableHead>
                      <TableHead className="text-right">Doanh số</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hrData.topPerformers.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={employee.performance} className="h-2 w-[60px]" />
                            <span className="text-sm">{employee.performance}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {employee.sales ? formatCurrency(employee.sales) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Kho hàng */}
          <TabsContent value="inventory" className="space-y-6">
            {/* Thống kê kho hàng */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng sản phẩm
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventoryData.summary.totalProducts.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Tổng số sản phẩm trong kho</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Giá trị tồn kho
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(inventoryData.summary.totalValue)}</div>
                  <p className="text-xs text-muted-foreground">Tổng giá trị hàng tồn kho</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sản phẩm sắp hết
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventoryData.summary.lowStockItems}</div>
                  <p className="text-xs text-muted-foreground">Hết hàng: {inventoryData.summary.outOfStockItems}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Vòng quay tồn kho
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventoryData.summary.inventoryTurnover.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Vòng quay tồn kho trung bình</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Sản phẩm sắp hết hàng */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm sắp hết hàng</CardTitle>
                <CardDescription>
                  Danh sách sản phẩm sắp hết hoặc đã hết hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Mã SKU</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Ngưỡng tối thiểu</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.lowStockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.threshold}</TableCell>
                        <TableCell>
                          <Badge className={getStockStatusColor(product.status)}>
                            {getStockStatusText(product.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Top sản phẩm tồn kho */}
            <Card>
              <CardHeader>
                <CardTitle>Top sản phẩm tồn kho</CardTitle>
                <CardDescription>
                  Danh sách sản phẩm có giá trị tồn kho cao nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Mã SKU</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead className="text-right">Giá trị</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.topStockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.quantity.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Bán hàng */}
          <TabsContent value="sales" className="space-y-6">
            {/* Thống kê bán hàng */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo tổng quan</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Lịch sử báo cáo
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              In báo cáo
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-slate-600">Doanh thu</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(overviewData.summary.revenueGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(overviewData.summary.revenueGrowth)}`}>
                      {formatPercent(overviewData.summary.revenueGrowth)}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{formatCurrency(overviewData.summary.revenue)}</p>
                <p className="text-xs text-slate-500 mt-1">Kỳ trước: {formatCurrency(overviewData.summary.previousRevenue)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium text-slate-600">Lợi nhuận</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(overviewData.summary.profitGrowth)}
                    <span className={`text-xs font-medium ${getGrowthColor(overviewData.summary.profitGrowth)}`}>
                      {formatPercent(overviewData.summary.profitGrowth)}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{formatCurrency(overviewData.summary.profit)}</p>
                <p className="text-xs text-slate-500 mt-1">Kỳ trước: {formatCurrency(overviewData.summary.previousProfit)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                  <p className="text-sm font-medium text-slate-600">Đơn hàng</p>
                </div>
                <p className="text-2xl font-bold mt-2">{overviewData.summary.orders.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Trung bình: {formatCurrency(overviewData.summary.revenue / overviewData.summary.orders)}/đơn</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-600" />
                  <p className="text-sm font-medium text-slate-600">Nhân sự</p>
                </div>
                <p className="text-2xl font-bold mt-2">{overviewData.summary.employees.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Chi phí: {formatCurrency(financeData.expensesByType[0].value)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="finance">Tài chính</TabsTrigger>
            <TabsTrigger value="sales">Bán hàng</TabsTrigger>
            <TabsTrigger value="inventory">Kho hàng</TabsTrigger>
            <TabsTrigger value="hr">Nhân sự</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Revenue & Profit Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Doanh thu & Lợi nhuận</CardTitle>
                  <CardDescription>
                    Biểu đồ doanh thu và lợi nhuận theo tháng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ doanh thu và lợi nhuận theo tháng</p>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Doanh thu theo danh mục</CardTitle>
                  <CardDescription>
                    Phân bổ doanh thu theo danh mục sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ doanh thu theo danh mục</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expenses by Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Chi phí theo loại</CardTitle>
                  <CardDescription>
                    Phân bổ chi phí theo từng loại
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ chi phí theo loại</p>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Channel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Doanh thu theo kênh</CardTitle>
                  <CardDescription>
                    Phân bổ doanh thu theo kênh bán hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ doanh thu theo kênh bán hàng</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Chỉ số kinh doanh chính</CardTitle>
                <CardDescription>
                  Các chỉ số quan trọng của doanh nghiệp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                      Tài chính
                    </h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tổng tài sản:</span>
                        <span className="font-medium">{formatCurrency(financeData.summary.assets)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tổng nợ:</span>
                        <span className="font-medium">{formatCurrency(financeData.summary.liabilities)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Vốn chủ sở hữu:</span>
                        <span className="font-medium">{formatCurrency(financeData.summary.equity)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Lợi nhuận ròng:</span>
                        <span className="font-medium">{formatCurrency(financeData.summary.netProfit)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2 text-green-600" />
                      Bán hàng
                    </h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tổng đơn hàng:</span>
                        <span className="font-medium">{salesData.summary.orders.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Giá trị đơn TB:</span>
                        <span className="font-medium">{formatCurrency(salesData.summary.averageOrderValue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tỷ lệ chuyển đổi:</span>
                        <span className="font-medium">{salesData.summary.conversionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tỷ lệ hoàn trả:</span>
                        <span className="font-medium">{salesData.summary.returnRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <Warehouse className="h-4 w-4 mr-2 text-amber-600" />
                      Kho hàng
                    </h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tổng sản phẩm:</span>
                        <span className="font-medium">{inventoryData.summary.totalProducts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Giá trị tồn kho:</span>
                        <span className="font-medium">{formatCurrency(inventoryData.summary.totalValue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Vòng quay tồn kho:</span>
                        <span className="font-medium">{inventoryData.summary.inventoryTurnover}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Sản phẩm sắp hết:</span>
                        <span className="font-medium">{inventoryData.summary.lowStockItems}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Revenue, Expenses & Profit Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Doanh thu, Chi phí & Lợi nhuận</CardTitle>
                  <CardDescription>
                    Biểu đồ tài chính theo tháng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ tài chính theo tháng</p>
                  </div>
                </CardContent>
              </Card>

              {/* Expenses by Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Chi phí theo loại</CardTitle>
                  <CardDescription>
                    Phân bổ chi phí theo từng loại
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-slate-300" />
                    <p className="text-slate-500 ml-2">Biểu đồ chi phí theo loại</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Balance Sheet */}
            <Card>
              <CardHeader>
                <CardTitle>Bảng cân đối kế toán</CardTitle>
                <CardDescription>
                  Tóm tắt tình hình tài chính của doanh nghiệp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-medium mb-3">Tài sản</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Tài sản ngắn hạn</h4>
                        <div className="space-y-1 ml-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Tiền mặt & tương đương:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.assets.current.cash)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Khoản phải thu:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.assets.current.accountsReceivable)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Hàng tồn kho:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.assets.current.inventory)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Tài sản ngắn hạn khác:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.assets.current.otherCurrent)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Tài sản dài hạn</h4>
                        <div className="space-y-1 ml-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Tài sản cố định:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.assets.nonCurrent.fixedAssets)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Tài sản vô hình:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.assets.nonCurrent.intangibleAssets)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Tài sản dài hạn khác:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.assets.nonCurrent.otherNonCurrent)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Tổng tài sản:</span>
                          <span>{formatCurrency(financeData.summary.assets)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-medium mb-3">Nợ & Vốn chủ sở hữu</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Nợ ngắn hạn</h4>
                        <div className="space-y-1 ml-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Khoản phải trả:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.liabilities.current.accountsPayable)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Vay ngắn hạn:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.liabilities.current.shortTermLoans)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Nợ ngắn hạn khác:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.liabilities.current.otherCurrent)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Nợ dài hạn</h4>
                        <div className="space-y-1 ml-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Vay dài hạn:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.liabilities.nonCurrent.longTermLoans)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Nợ dài hạn khác:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.liabilities.nonCurrent.otherNonCurrent)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Vốn chủ sở hữu</h4>
                        <div className="space-y-1 ml-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Vốn góp:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.equity.capital)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Lợi nhuận giữ lại:</span>
                            <span className="font-medium">{formatCurrency(financeData.balanceSheet.equity.retainedEarnings)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Tổng nợ & vốn chủ sở hữu:</span>
                          <span>{formatCurrency(financeData.summary.liabilities + financeData.summary.equity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow */}
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo lưu chuyển tiền tệ</CardTitle>
                <CardDescription>
                  Tóm tắt dòng tiền của doanh nghiệp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Dòng tiền từ hoạt động kinh doanh</p>
                      <p className="text-xs text-slate-500">Tiền thu từ bán hàng, dịch vụ trừ chi phí hoạt động</p>
                    </div>
                    <p className={`text-lg font-medium ${financeData.cashFlow.operating >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(financeData.cashFlow.operating)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Dòng tiền từ hoạt động đầu tư</p>
                      <p className="text-xs text-slate-500">Tiền chi cho mua sắm, đầu tư tài sản</p>
                    </div>
                    <p className={`text-lg font-medium ${financeData.cashFlow.investing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(financeData.cashFlow.investing)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Dòng tiền từ hoạt động tài chính</p>
                      <p className="text-xs text-slate-500">Tiền thu từ vay, góp vốn trừ trả nợ, cổ tức</p>
                    </div>
                    <p className={`text-lg font-medium ${financeData.cashFlow.financing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(financeData.cashFlow.financing)}
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-base font-medium">Lưu chuyển tiền thuần trong kỳ</p>
                      <p className={`text-xl font-medium ${financeData.cashFlow.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(financeData.cashFlow.netCashFlow)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Doanh thu theo tháng</CardTitle>
                  <CardDescription>
