'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserTable from '@/components/users/UserTable';
import UserDialog from '@/components/users/UserDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { User } from '@/lib/types';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Quản lý tài khoản và quyền hạn người dùng
            </p>
          </div>
          <Button onClick={() => setShowUserDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>

        <UserTable 
          searchTerm={searchTerm}
          onEditUser={(user) => {
            setSelectedUser(user);
            setShowUserDialog(true);
          }}
        />

        <UserDialog
          open={showUserDialog}
          onOpenChange={setShowUserDialog}
          user={selectedUser}
          onClose={() => {
            setShowUserDialog(false);
            setSelectedUser(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
}