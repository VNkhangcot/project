'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar, 
  Clock, 
  Search, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle
} from 'lucide-react';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AttendanceRecord {
  id: number;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dữ liệu mẫu
  const attendanceData: AttendanceRecord[] = [
    { 
      id: 1, 
      employeeName: 'Nguyễn Văn A', 
      department: 'Ban Giám đốc', 
      date: '2024-01-15', 
      checkIn: '08:00', 
      checkOut: '17:30', 
      status: 'present'
    },
    { 
      id: 2, 
      employeeName: 'Trần Thị B', 
      department: 'Phòng Kinh doanh', 
      date: '2024-01-15', 
      checkIn: '08:15', 
      checkOut: '17:00', 
      status: 'present'
    },
    { 
      id: 3, 
      employeeName: 'Lê Văn C', 
      department: 'Phòng Kỹ thuật', 
      date: '2024-01-15', 
      checkIn: '08:45', 
      checkOut: '17:15', 
      status: 'late'
    }
  ];

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Hàm lấy tên hiển thị cho trạng thái
  const getStatusText = (status: string) => {
    switch(status) {
      case 'present':
        return 'Có mặt';
      case 'absent':
        return 'Vắng mặt';
      case 'late':
        return 'Đi muộn';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy icon cho trạng thái
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý chấm công</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Chấm công thủ công
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-slate-600">Có mặt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-slate-600">Vắng mặt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-slate-600">Đi muộn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhân viên..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách chấm công</CardTitle>
            <CardDescription>
              Thông tin chấm công của nhân viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Giờ vào</TableHead>
                  <TableHead>Giờ ra</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {record.employeeName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{record.employeeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(record.status)}
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
