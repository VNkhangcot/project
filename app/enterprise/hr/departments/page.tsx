'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, Edit, Trash2, Users, MoreHorizontal } from 'lucide-react';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Department {
  id: number;
  name: string;
  manager: string;
  employees: number;
  budget: string;
  status: 'active' | 'inactive';
  businessId: number;
}

interface Business {
  id: number;
  name: string;
}

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  
  // Dữ liệu mẫu cho doanh nghiệp
  const businesses: Business[] = [
    { id: 1, name: 'Công ty TNHH ABC' },
    { id: 2, name: 'Nhà hàng XYZ' },
    { id: 3, name: 'Cửa hàng thời trang Fashion' }
  ];
  
  // Dữ liệu mẫu cho phòng ban
  const departments: Department[] = [
    { 
      id: 1, 
      name: 'Ban Giám đốc', 
      manager: 'Nguyễn Văn A', 
      employees: 3, 
      budget: '500 triệu VND',
      status: 'active',
      businessId: 1
    },
    { 
      id: 2, 
      name: 'Phòng Kinh doanh', 
      manager: 'Trần Thị B', 
      employees: 12, 
      budget: '300 triệu VND',
      status: 'active',
      businessId: 1
    },
    { 
      id: 3, 
      name: 'Phòng Kỹ thuật', 
      manager: 'Lê Văn C', 
      employees: 8, 
      budget: '250 triệu VND',
      status: 'active',
      businessId: 1
    },
    { 
      id: 4, 
      name: 'Phòng Marketing', 
      manager: 'Phạm Thị D', 
      employees: 6, 
      budget: '200 triệu VND',
      status: 'active',
      businessId: 1
    },
    { 
      id: 5, 
      name: 'Phòng Hành chính', 
      manager: 'Hoàng Văn E', 
      employees: 4, 
      budget: '150 triệu VND',
      status: 'active',
      businessId: 1
    },
    { 
      id: 6, 
      name: 'Phòng Nhân sự', 
      manager: 'Vũ Thị F', 
      employees: 3, 
      budget: '120 triệu VND',
      status: 'inactive',
      businessId: 1
    },
    { 
      id: 7, 
      name: 'Quản lý', 
      manager: 'Đỗ Văn G', 
      employees: 2, 
      budget: '100 triệu VND',
      status: 'active',
      businessId: 2
    },
    { 
      id: 8, 
      name: 'Nhân viên phục vụ', 
      manager: 'Lý Thị H', 
      employees: 6, 
      budget: '80 triệu VND',
      status: 'active',
      businessId: 2
    },
    { 
      id: 9, 
      name: 'Đầu bếp', 
      manager: 'Trịnh Văn I', 
      employees: 4, 
      budget: '120 triệu VND',
      status: 'active',
      businessId: 2
    },
    { 
      id: 10, 
      name: 'Quản lý', 
      manager: 'Mai Văn K', 
      employees: 1, 
      budget: '50 triệu VND',
      status: 'active',
      businessId: 3
    },
    { 
      id: 11, 
      name: 'Nhân viên bán hàng', 
      manager: 'Ngô Thị L', 
      employees: 5, 
      budget: '70 triệu VND',
      status: 'active',
      businessId: 3
    },
    { 
      id: 12, 
      name: 'Kho vận', 
      manager: 'Đinh Văn M', 
      employees: 2, 
      budget: '40 triệu VND',
      status: 'active',
      businessId: 3
    }
  ];

  // Lọc phòng ban theo từ khóa tìm kiếm và doanh nghiệp
  const filteredDepartments = departments.filter(
    (department) => {
      const matchesSearch = 
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.manager.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBusiness = businessFilter === 'all' || department.businessId === parseInt(businessFilter);
      
      return matchesSearch && matchesBusiness;
    }
  );

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setIsDialogOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setIsDialogOpen(true);
  };

  const handleSaveDepartment = () => {
    // Xử lý lưu phòng ban
    setIsDialogOpen(false);
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý phòng ban</h1>
          <Button className="flex items-center gap-2" onClick={handleAddDepartment}>
            <PlusCircle className="h-4 w-4" />
            Thêm phòng ban
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm phòng ban..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={businessFilter} onValueChange={setBusinessFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Doanh nghiệp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả doanh nghiệp</SelectItem>
                {businesses.map((business) => (
                  <SelectItem key={business.id} value={business.id.toString()}>
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Xuất Excel
            </Button>
            <Button variant="outline" size="sm">
              In danh sách
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách phòng ban</CardTitle>
            <CardDescription>
              Quản lý tất cả phòng ban trong doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phòng ban</TableHead>
                  <TableHead>Doanh nghiệp</TableHead>
                  <TableHead>Trưởng phòng</TableHead>
                  <TableHead>Số nhân viên</TableHead>
                  <TableHead>Ngân sách</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>
                      {businesses.find(b => b.id === department.businessId)?.name}
                    </TableCell>
                    <TableCell>{department.manager}</TableCell>
                    <TableCell>{department.employees}</TableCell>
                    <TableCell>{department.budget}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        department.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {department.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Xem nhân viên
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredDepartments.length} / {departments.length} phòng ban
            </div>
          </CardFooter>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết về phòng ban. Nhấn lưu khi hoàn tất.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên phòng ban
                </Label>
                <Input
                  id="name"
                  defaultValue={editingDepartment?.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="business" className="text-right">
                  Doanh nghiệp
                </Label>
                <Select defaultValue={editingDepartment?.businessId.toString()}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn doanh nghiệp" />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses.map((business) => (
                      <SelectItem key={business.id} value={business.id.toString()}>
                        {business.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manager" className="text-right">
                  Trưởng phòng
                </Label>
                <Input
                  id="manager"
                  defaultValue={editingDepartment?.manager}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">
                  Ngân sách
                </Label>
                <Input
                  id="budget"
                  defaultValue={editingDepartment?.budget}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Trạng thái
                </Label>
                <Select defaultValue={editingDepartment?.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveDepartment}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </EnterpriseLayout>
  );
}
