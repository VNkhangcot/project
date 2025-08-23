'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, Download, RefreshCw, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function AuditFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severity, setSeverity] = useState('all');
  const [action, setAction] = useState('all');
  const [user, setUser] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Bộ lọc Audit Logs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and basic filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm trong logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                <SelectItem value="error">Nghiêm trọng</SelectItem>
                <SelectItem value="warning">Cảnh báo</SelectItem>
                <SelectItem value="info">Thông tin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Hành động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả hành động</SelectItem>
                <SelectItem value="USER_LOGIN">Đăng nhập</SelectItem>
                <SelectItem value="USER_LOGOUT">Đăng xuất</SelectItem>
                <SelectItem value="USER_UPDATE">Cập nhật người dùng</SelectItem>
                <SelectItem value="SECURITY_ALERT">Cảnh báo bảo mật</SelectItem>
                <SelectItem value="ROLE_ASSIGN">Gán vai trò</SelectItem>
                <SelectItem value="DATA_BACKUP">Sao lưu dữ liệu</SelectItem>
                <SelectItem value="DATA_DELETE">Xóa dữ liệu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={user} onValueChange={setUser}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Người dùng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả người dùng</SelectItem>
                <SelectItem value="Admin User">Admin User</SelectItem>
                <SelectItem value="Manager User">Manager User</SelectItem>
                <SelectItem value="Editor User">Editor User</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, 'dd/MM/yyyy', { locale: vi }) : 'Từ ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, 'dd/MM/yyyy', { locale: vi }) : 'Đến ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}