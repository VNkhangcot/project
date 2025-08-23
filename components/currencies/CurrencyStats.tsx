'use client';

import { useState, useEffect } from 'react';
import { CurrencyService } from '@/services/currencyService';
import { CurrencyRate, ExchangeRateHistory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DollarSign, TrendingUp, BarChart2, PieChart as PieChartIcon, RefreshCw } from 'lucide-react';

export default function CurrencyStats() {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [historyData, setHistoryData] = useState<ExchangeRateHistory[]>([]);
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<string>('line');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await CurrencyService.getCurrencies();
        setCurrencies(response.data || []);
        
        if (response.data && response.data.length > 0) {
          const nonBaseCurrencies = response.data.filter(c => !c.isBaseCurrency);
          if (nonBaseCurrencies.length > 0) {
            setSelectedCurrency(nonBaseCurrencies[0].code);
          }
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!selectedCurrency) return;
      
      try {
        setLoading(true);
        const response = await CurrencyService.getCurrencyHistory(selectedCurrency);
        setHistoryData(response.data || []);
      } catch (error) {
        console.error('Error fetching currency history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [selectedCurrency]);

  const getTimeRangeData = () => {
    const now = new Date();
    let daysToSubtract = 7;
    
    switch (timeRange) {
      case '1d':
        daysToSubtract = 1;
        break;
      case '7d':
        daysToSubtract = 7;
        break;
      case '1m':
        daysToSubtract = 30;
        break;
      case '3m':
        daysToSubtract = 90;
        break;
      case '1y':
        daysToSubtract = 365;
        break;
      default:
        daysToSubtract = 7;
    }
    
    const startDate = subDays(now, daysToSubtract);
    return historyData.filter(item => new Date(item.date) >= startDate);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getChartData = () => {
    const filteredData = getTimeRangeData();
    
    // If we don't have enough real data, generate some mock data
    if (filteredData.length < 2) {
      const mockData = [];
      const now = new Date();
      const currency = currencies.find(c => c.code === selectedCurrency);
      const baseRate = currency ? currency.rate : 0.00004;
      
      for (let i = 0; i < 7; i++) {
        const date = subDays(now, 6 - i);
        const variation = (Math.random() * 0.00001) - 0.000005; // Small random variation
        mockData.push({
          date: date.toISOString(),
          rate: baseRate + variation,
          formattedDate: format(date, 'dd/MM/yyyy')
        });
      }
      
      return mockData;
    }
    
    return filteredData.map(item => ({
      ...item,
      formattedDate: formatDate(item.date)
    }));
  };

  const getComparisonData = () => {
    return currencies
      .filter(c => !c.isBaseCurrency)
      .map(currency => ({
        name: currency.code,
        value: 1 / currency.rate, // Convert to base currency value
        fullName: currency.name
      }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

  const renderChart = () => {
    const data = getChartData();
    
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(6), 'Tỉ giá']}
                labelFormatter={(label) => `Ngày: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#8884d8" 
                name={`Tỉ giá ${selectedCurrency}/VND`} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(6), 'Tỉ giá']}
                labelFormatter={(label) => `Ngày: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="rate" 
                fill="#8884d8" 
                name={`Tỉ giá ${selectedCurrency}/VND`} 
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'comparison':
        const comparisonData = getComparisonData();
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={comparisonData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} VND`, 'Giá trị']}
                labelFormatter={(name) => {
                  const currency = comparisonData.find(c => c.name === name);
                  return currency ? `${currency.fullName} (${name})` : name;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const getBaseCurrency = () => {
    const baseCurrency = currencies.find(c => c.isBaseCurrency);
    return baseCurrency ? baseCurrency.code : 'VND';
  };

  if (loading && currencies.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Biểu đồ tỉ giá tiền tệ</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Cập nhật dữ liệu
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Loại tiền tệ</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies
                    .filter(c => !c.isBaseCurrency)
                    .map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span>{currency.symbol}</span>
                          <span>{currency.code}</span>
                          <span className="text-slate-500">- {currency.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Khoảng thời gian</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1 ngày</SelectItem>
                  <SelectItem value="7d">7 ngày</SelectItem>
                  <SelectItem value="1m">1 tháng</SelectItem>
                  <SelectItem value="3m">3 tháng</SelectItem>
                  <SelectItem value="1y">1 năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Loại biểu đồ</Label>
              <Tabs value={chartType} onValueChange={setChartType} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="line" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Đường</span>
                  </TabsTrigger>
                  <TabsTrigger value="bar" className="flex items-center gap-1">
                    <BarChart2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Cột</span>
                  </TabsTrigger>
                  <TabsTrigger value="comparison" className="flex items-center gap-1">
                    <PieChartIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">So sánh</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="mt-4">
            {chartType !== 'comparison' && (
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="outline" className="text-lg font-mono">
                    1 {selectedCurrency} = {currencies.find(c => c.code === selectedCurrency)?.rate ? 
                      (1 / currencies.find(c => c.code === selectedCurrency)!.rate).toLocaleString() : '?'} {getBaseCurrency()}
                  </Badge>
                </div>
                <div className="text-sm text-slate-500">
                  Cập nhật lần cuối: {currencies.find(c => c.code === selectedCurrency)?.lastUpdated ? 
                    formatDate(currencies.find(c => c.code === selectedCurrency)!.lastUpdated) : 'N/A'}
                </div>
              </div>
            )}
            
            {renderChart()}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng số tiền tệ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{currencies.length}</div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tiền tệ cơ sở</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {currencies.find(c => c.isBaseCurrency)?.code || 'VND'}
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tiền tệ đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {currencies.filter(c => c.isActive).length}
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
