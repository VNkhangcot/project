'use client';

import { CurrencyRate, ExchangeRateHistory, ApiResponse } from '@/lib/types';

export class CurrencyService {
  private static baseUrl = '/api/currencies';

  // Lấy danh sách tất cả các loại tiền tệ
  static async getCurrencies(params?: { search?: string, isActive?: boolean }): Promise<ApiResponse<CurrencyRate[]>> {
    try {
      // Xây dựng query string từ params
      const queryParams = new URLSearchParams();
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      if (params?.isActive !== undefined) {
        queryParams.append('isActive', params.isActive.toString());
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      // Gọi API
      const response = await fetch(`${this.baseUrl}${queryString}`);
      const data = await response.json();
      
      return data;
    } catch (error: any) {
      console.error('Error fetching currencies:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to fetch currencies'
      };
    }
  }

  // Lấy thông tin một loại tiền tệ
  static async getCurrency(id: string): Promise<ApiResponse<CurrencyRate>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();
      
      return data;
    } catch (error: any) {
      console.error('Error fetching currency:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to fetch currency'
      };
    }
  }

  // Tạo loại tiền tệ mới
  static async createCurrency(data: Partial<CurrencyRate>): Promise<ApiResponse<CurrencyRate>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      return result;
    } catch (error: any) {
      console.error('Error creating currency:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to create currency'
      };
    }
  }

  // Cập nhật thông tin loại tiền tệ
  static async updateCurrency(id: string, data: Partial<CurrencyRate>): Promise<ApiResponse<CurrencyRate>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      return result;
    } catch (error: any) {
      console.error('Error updating currency:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to update currency'
      };
    }
  }

  // Xóa loại tiền tệ
  static async deleteCurrency(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      return result;
    } catch (error: any) {
      console.error('Error deleting currency:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to delete currency'
      };
    }
  }

  // Lấy lịch sử tỉ giá của một loại tiền tệ
  static async getCurrencyHistory(
    code: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<ApiResponse<ExchangeRateHistory[]>> {
    try {
      // Xây dựng query string
      const queryParams = new URLSearchParams();
      queryParams.append('currencyCode', code);
      
      if (startDate) {
        queryParams.append('startDate', startDate);
      }
      
      if (endDate) {
        queryParams.append('endDate', endDate);
      }
      
      // Gọi API
      const response = await fetch(`${this.baseUrl}/history?${queryParams.toString()}`);
      const data = await response.json();
      
      return data;
    } catch (error: any) {
      console.error('Error fetching currency history:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to fetch currency history'
      };
    }
  }

  // Thêm lịch sử tỉ giá mới
  static async addCurrencyHistory(data: {
    currencyCode: string;
    rate: number;
    date?: string;
    source?: string;
  }): Promise<ApiResponse<ExchangeRateHistory>> {
    try {
      const response = await fetch(`${this.baseUrl}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      return result;
    } catch (error: any) {
      console.error('Error adding currency history:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to add currency history'
      };
    }
  }

  // Cập nhật tỉ giá cho nhiều loại tiền tệ
  static async updateExchangeRates(rates: { code: string, rate: number }[]): Promise<ApiResponse<CurrencyRate[]>> {
    try {
      // Cập nhật từng loại tiền tệ
      const promises = rates.map(async ({ code, rate }) => {
        // Lấy danh sách tiền tệ để tìm ID
        const currenciesResponse = await this.getCurrencies({ search: code });
        
        if (currenciesResponse.status !== 'success' || !currenciesResponse.data) {
          throw new Error(`Failed to find currency with code ${code}`);
        }
        
        const currency = currenciesResponse.data.find(c => c.code === code);
        
        if (!currency) {
          throw new Error(`Currency with code ${code} not found`);
        }
        
        // Cập nhật tỉ giá
        return this.updateCurrency(currency._id, { 
          rate,
          lastUpdated: new Date().toISOString()
        });
      });
      
      const results = await Promise.all(promises);
      
      // Lấy danh sách các tiền tệ đã cập nhật
      const updatedCurrencies = results
        .filter(result => result.status === 'success' && result.data)
        .map(result => result.data as CurrencyRate);
      
      return {
        status: 'success',
        data: updatedCurrencies,
        message: 'Exchange rates updated successfully'
      };
    } catch (error: any) {
      console.error('Error updating exchange rates:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to update exchange rates'
      };
    }
  }

  // Chuyển đổi giá trị giữa các loại tiền tệ
  static async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      // Lấy danh sách tiền tệ
      const currenciesResponse = await this.getCurrencies();
      
      if (currenciesResponse.status !== 'success' || !currenciesResponse.data) {
        throw new Error('Failed to fetch currencies for conversion');
      }
      
      const currencies = currenciesResponse.data;
      const from = currencies.find(c => c.code === fromCurrency);
      const to = currencies.find(c => c.code === toCurrency);
      
      if (!from || !to) {
        throw new Error('Currency not found');
      }
      
      // Chuyển đổi từ fromCurrency sang base currency, sau đó từ base currency sang toCurrency
      return (amount / from.rate) * to.rate;
    } catch (error: any) {
      console.error('Error converting currency:', error);
      throw error;
    }
  }
}
