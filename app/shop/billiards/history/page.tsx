'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  History, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Gamepad2,
  BarChart
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Định nghĩa kiểu dữ liệu
interface PlaySession {
  id: string;
  tableId: number;
  tableName: string;
  tableType: string;
  startTime: string;
  endTime: string;
  duration: number; // phút
  players: string[];
  cost: number;
  orderTotal: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  date: string;
}

// Mock data cho lịch sử chơi
const mockSessions: PlaySession[] = [
  {
    id: 'SESSION-001',
    tableId: 1,
    tableName: 'Bàn 1',
    tableType: 'Lỗ',
    startTime: '14:30',
    endTime: '15:15',
    duration: 45,
    players: ['Nguyễn Văn A', 'Trần Văn B'],
    cost: 37500,
    orderTotal: 65000,
    total: 102500,
    paymentMethod: 'cash',
    date: '15/01/2024'
  },
  {
    id: 'SESSION-002',
    tableId: 3,
    tableName: 'Bàn 3',
    tableType: 'Lỗ',
    startTime: '13:15',
    endTime: '14:45',
    duration: 90,
    players: ['Lê Văn C', 'Phạm Văn D'],
    cost: 75000,
    orderTotal: 130000,
    total: 205000,
    paymentMethod: 'card',
    date: '15/01/2024'
  },
  {
    id: 'SESSION-003',
    tableId: 2,
    tableName: 'Bàn 2',
    tableType: 'Carom',
    startTime: '16:00',
    endTime: '17:30',
    duration: 90,
    players: ['Hoàng Văn E'],
    cost: 90000,
    orderTotal: 45000,
    total: 135000,
    paymentMethod: 'cash',
    date: '14/01/2024'
  },
  {
    id: 'SESSION-004',
    tableId: 4,
    tableName: 'Bàn 4',
    tableType: 'Carom',
    startTime: '18:00',
    endTime: '20:00',
    duration: 120,
    players: ['Nguyễn Thị F', 'Trần Thị G', 'Lê Thị H'],
    cost: 120000,
    orderTotal: 180000,
    total: 300000,
    paymentMethod: 'transfer',
    date: '14/01/2024'
  },
  {
    id: 'SESSION-005',
    tableId: 1,
    tableName: 'Bàn 1',
    tableType: 'Lỗ',
    startTime: '20:30',
    endTime: '22:00',
    duration: 90,
    players: ['Phạm Văn I', 'Hoàng Văn J'],
    cost: 75000,
    orderTotal: 120000,
    total: 195000,
    paymentMethod: 'card',
    date: '13/01/2024'
  }
];

export default function BilliardsHistoryPage() {
  const [sessions, setSessions] = useState<PlaySession[]>(mockSessions);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [tableFilter, setTableFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'cash':
        return <Badge className="bg-green-100 text-green-800">Tiền mặt</Badge>;
      case 'card':
        return <Badge className="bg-blue-100 text-blue-800">Thẻ</Badge>;
      case 'transfer':
        return <Badge className="bg-purple-100 text-purple-800">Chuyển khoản</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.players.some(player => player.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDate = dateFilter === 'all' || session.date === dateFilter;
    const matchesTable = tableFilter === 'all' || session.tableName === tableFilter;
    
    return matchesSearch && matchesDate && matchesTable;
  });

  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

  // Calculate stats
  const totalSessions = sessions.length;
  const totalRevenue = sessions.reduce((sum, session) => sum + session.total, 0);
  const totalPlayTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  const averageSessionDuration = totalSessions > 0 ? totalPlayTime / totalSessions : 0;

  // Get unique dates and tables for filters
  const uniqueDates = Array.from(new Set(sessions.map(session => session.date)));
  const uniqueTables = Array.from(new Set(sessions.map(session => session.tableName)));

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <History className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Lịch sử chơi
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Xem lịch sử sử dụng bàn bida và thống kê
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng lượt chơi</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalSessions}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Gamepad2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalRevenue)}</p>
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
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tổng thời gian chơi</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatTime(totalPlayTime)}</p>
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
                  <p className="text-sm text-slate-500 dark:text-slate-400">Thời gian trung bình</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatTime(Math.round(averageSessionDuration))}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã, bàn, người chơi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ngày</SelectItem>
                {uniqueDates.map(date => (
                  <SelectItem key={date} value={date}>{date}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Bàn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả bàn</SelectItem>
                {uniqueTables.map(table => (
                  <SelectItem key={table} value={table}>{table}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử chơi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Mã</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Ngày</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Bàn</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Thời gian</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Thời lượng</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Người chơi</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tiền bàn</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tiền đồ uống</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Tổng tiền</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">Thanh toán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {paginatedSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {session.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {session.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {session.tableName} ({session.tableType})
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {session.startTime} - {session.endTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {formatTime(session.duration)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {session.players.join(', ')}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                        {formatCurrency(session.cost)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">
                        {formatCurrency(session.orderTotal)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                        {formatCurrency(session.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getPaymentMethodBadge(session.paymentMethod)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredSessions.length === 0 && (
                <div className="py-8 text-center">
                  <History className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Không tìm thấy lịch sử chơi nào</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredSessions.length)} trong số {filteredSessions.length} lượt chơi
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}
