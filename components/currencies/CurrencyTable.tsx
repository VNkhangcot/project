'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  DollarSign, 
  BarChart4, 
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import { CurrencyRate } from '@/lib/types';
import { CurrencyService } from '@/services/currencyService';
import { format } from 'date-fns';

interface CurrencyTableProps {
  searchTerm: string;
  onEditCurrency: (currency: CurrencyRate) => void;
  refreshTrigger?: number;
}

export default function CurrencyTable({ 
  searchTerm, 
  onEditCurrency,
  refreshTrigger = 0
}: CurrencyTableProps) {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const response = await CurrencyService.getCurrencies();
      setCurrencies(response.data || []);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, [refreshTrigger]);

  // Apply search filter
  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  const formatRate = (rate: number, isBaseCurrency: boolean) => {
    if (isBaseCurrency) {
      return '1.00';
    }
    return rate.toFixed(6);
  };

  if (loading) {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách tiền tệ ({filteredCurrencies.length})</CardTitle>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Cập nhật tỉ giá
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Mã tiền tệ
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Tên tiền tệ
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Tỉ giá
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Trạng thái
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Cập nhật lần cuối
                </th>
                <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCurrencies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Không có tiền tệ nào phù hợp với tìm kiếm
                  </td>
                </tr>
              ) : (
                filteredCurrencies.map((currency) => (
                  <tr 
                    key={currency._id} 
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                          {currency.symbol}
                        </div>
                        <span className="font-medium">{currency.code}</span>
                        {currency.isBaseCurrency && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Cơ sở
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {currency.name}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{formatRate(currency.rate, currency.isBaseCurrency)}</span>
                        {!currency.isBaseCurrency && (
                          <span className="text-xs text-slate-500">
                            (1 {currency.code} = {(1/currency.rate).toLocaleString()} VND)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {currency.isActive ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                          <X className="h-3 w-3 mr-1" />
                          Không hoạt động
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(currency.lastUpdated)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditCurrency(currency)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart4 className="h-4 w-4 mr-2" />
                            Xem biểu đồ
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={currency.isBaseCurrency} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
