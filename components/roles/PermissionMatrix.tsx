'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

const roles = ['Admin', 'Manager', 'Editor', 'User'];
const permissions = [
  'Xem dữ liệu',
  'Chỉnh sửa',
  'Xóa',
  'Quản lý người dùng',
  'Quản lý vai trò',
  'Xem báo cáo',
  'Xuất dữ liệu',
  'Cài đặt hệ thống',
  'Xem nhật ký audit',
];

const permissionMatrix = {
  Admin: [true, true, true, true, true, true, true, true, true],
  Manager: [true, true, false, true, false, true, true, false, false],
  Editor: [true, true, false, false, false, false, false, false, false],
  User: [true, false, false, false, false, false, false, false, false],
};

export default function PermissionMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ma trận phân quyền</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Quyền hạn
                </th>
                {roles.map((role) => (
                  <th key={role} className="text-center py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    <Badge variant="outline">{role}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission, permissionIndex) => (
                <tr 
                  key={permission} 
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">
                    {permission}
                  </td>
                  {roles.map((role) => (
                    <td key={role} className="py-3 px-4 text-center">
                      {permissionMatrix[role as keyof typeof permissionMatrix][permissionIndex] ? (
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}