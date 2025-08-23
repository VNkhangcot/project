'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Lock, Unlock } from 'lucide-react';
import { User } from '@/lib/types';

// Định nghĩa interface cho mock data vì cấu trúc khác với User trong lib/types.ts
interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

// Chuyển đổi MockUser sang User
const convertToUser = (mockUser: MockUser): User => {
  return {
    _id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
    role: {
      _id: '1',
      name: mockUser.role,
      description: `${mockUser.role} role`,
      permissions: [],
      isDefault: false,
      isActive: true,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.createdAt
    },
    status: mockUser.status as 'active' | 'inactive' | 'suspended',
    lastLogin: mockUser.lastLogin,
    loginAttempts: 0,
    twoFactorEnabled: false,
    emailVerified: true,
    preferences: {
      language: 'vi',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.createdAt
  };
};

const mockUsersData: MockUser[] = [
  {
    id: '1',
    name: 'Nguyễn Văn Admin',
    email: 'admin@company.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 10:30',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'Trần Thị Manager',
    email: 'manager@company.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2024-01-15 09:15',
    createdAt: '2023-02-15',
  },
  {
    id: '3',
    name: 'Lê Văn User',
    email: 'user@company.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-01-10 14:20',
    createdAt: '2023-03-20',
  },
  {
    id: '4',
    name: 'Phạm Thị Editor',
    email: 'editor@company.com',
    role: 'editor',
    status: 'suspended',
    lastLogin: '2024-01-12 16:45',
    createdAt: '2023-04-10',
  },
];

// Chuyển đổi mockUsersData sang User[]
const mockUsers: User[] = mockUsersData.map(convertToUser);

interface UserTableProps {
  searchTerm: string;
  onEditUser: (user: User) => void;
}

export default function UserTable({ searchTerm, onEditUser }: UserTableProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Không hoạt động</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Bị đình chỉ</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'manager':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Manager</Badge>;
      case 'editor':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Editor</Badge>;
      case 'user':
        return <Badge variant="outline">User</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Người dùng
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Vai trò
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Trạng thái
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Đăng nhập cuối
                </th>
                <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr 
                  key={user._id} 
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || ""} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getRoleBadge(user.role.name)}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {user.lastLogin || 'Chưa đăng nhập'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {user.status === 'suspended' ? (
                            <>
                              <Unlock className="h-4 w-4 mr-2" />
                              Kích hoạt
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Đình chỉ
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
