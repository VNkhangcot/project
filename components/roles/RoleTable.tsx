'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';
import { Role, Permission } from '@/lib/types';

const mockRoles: Role[] = [
  {
    _id: '1',
    name: 'Admin',
    description: 'Quyền quản trị tối cao của hệ thống',
    userCount: 2,
    permissions: ['read', 'write', 'delete', 'manage_users', 'view_analytics', 'system_settings'] as Permission[],
    isDefault: true,
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    _id: '2',
    name: 'Manager',
    description: 'Quản lý các hoạt động và báo cáo',
    userCount: 5,
    permissions: ['read', 'write', 'manage_users', 'view_analytics'] as Permission[],
    isDefault: false,
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    _id: '3',
    name: 'Editor',
    description: 'Chỉnh sửa nội dung và dữ liệu',
    userCount: 12,
    permissions: ['read', 'write'] as Permission[],
    isDefault: false,
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
  {
    _id: '4',
    name: 'User',
    description: 'Người dùng cơ bản với quyền xem',
    userCount: 150,
    permissions: ['read'] as Permission[],
    isDefault: true,
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  },
];

interface RoleTableProps {
  onEditRole: (role: Role) => void;
}

export default function RoleTable({ onEditRole }: RoleTableProps) {
  const [roles] = useState<Role[]>(mockRoles);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách vai trò ({roles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Vai trò
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Số người dùng
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Quyền hạn
                </th>
                <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr 
                  key={role._id} 
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{role.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>{role.userCount}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditRole(role)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" disabled={Boolean(role.userCount && role.userCount > 0)}>
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
