'use client';

import { useState, useEffect } from 'react';
import { CurrencyService } from '@/services/currencyService';
import { CurrencyRate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CurrencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency?: CurrencyRate | null;
  onClose: () => void;
}

export default function CurrencyDialog({
  open,
  onOpenChange,
  currency,
  onClose,
}: CurrencyDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    rate: 1,
    isBaseCurrency: false,
    isActive: true
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currency) {
      setFormData({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        rate: currency.rate,
        isBaseCurrency: currency.isBaseCurrency,
        isActive: currency.isActive
      });
    } else {
      // Reset form for new currency
      setFormData({
        code: '',
        name: '',
        symbol: '',
        rate: 1,
        isBaseCurrency: false,
        isActive: true
      });
    }
    setError(null);
  }, [currency, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.code || !formData.name || !formData.symbol) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (formData.code.length !== 3) {
      setError('Mã tiền tệ phải có đúng 3 ký tự (ví dụ: USD, VND, EUR)');
      return;
    }

    if (formData.rate <= 0) {
      setError('Tỉ giá phải lớn hơn 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (currency) {
        await CurrencyService.updateCurrency(currency._id, formData);
      } else {
        await CurrencyService.createCurrency(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving currency:', error);
      setError('Có lỗi xảy ra khi lưu thông tin tiền tệ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            {currency ? 'Chỉnh sửa tiền tệ' : 'Thêm tiền tệ mới'}
          </DialogTitle>
          <DialogDescription>
            {currency ? 'Cập nhật thông tin tiền tệ' : 'Thêm loại tiền tệ mới vào hệ thống'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã tiền tệ *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="USD"
                  maxLength={3}
                  className="uppercase"
                  disabled={!!currency}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Ký hiệu *</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                  placeholder="$"
                  maxLength={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Tỉ giá *</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.000001"
                  value={formData.rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                  placeholder="1.0"
                  disabled={formData.isBaseCurrency}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Tên tiền tệ *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="US Dollar"
                required
              />
            </div>

            <div className="flex items-center justify-between space-y-0 pt-2">
              <Label htmlFor="isBaseCurrency">Đặt làm tiền tệ cơ sở</Label>
              <Switch
                id="isBaseCurrency"
                checked={formData.isBaseCurrency}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    isBaseCurrency: checked,
                    rate: checked ? 1 : prev.rate
                  }));
                }}
                disabled={!!currency && currency.isBaseCurrency}
              />
            </div>

            <div className="flex items-center justify-between space-y-0 pt-2">
              <Label htmlFor="isActive">Kích hoạt</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                disabled={formData.isBaseCurrency}
              />
            </div>
          </div>

          {formData.isBaseCurrency && (
            <Card className="mb-4 bg-amber-50 border-amber-200">
              <CardContent className="p-4 text-sm text-amber-800">
                <p>Tiền tệ cơ sở sẽ có tỉ giá là 1.0 và được sử dụng làm cơ sở để quy đổi các loại tiền tệ khác.</p>
                <p className="mt-2">Lưu ý: Chỉ có thể có một tiền tệ cơ sở trong hệ thống.</p>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : (currency ? 'Cập nhật' : 'Thêm mới')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
