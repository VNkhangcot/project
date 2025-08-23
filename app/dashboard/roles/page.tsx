'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RoleTable from '@/components/roles/RoleTable';
import RoleDialog from '@/components/roles/RoleDialog';
import PermissionMatrix from '@/components/roles/PermissionMatrix';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Role } from '@/lib/types';

export default function RolesPage() {
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý vai trò & quyền</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Cấu hình vai trò và phân quyền hệ thống
            </p>
          </div>
          <Button onClick={() => setShowRoleDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm vai trò
          </Button>
        </div>

        <Tabs defaultValue="roles" className="w-full">
          <TabsList>
            <TabsTrigger value="roles">Vai trò</TabsTrigger>
            <TabsTrigger value="permissions">Ma trận quyền</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles" className="space-y-6">
            <RoleTable 
              onEditRole={(role) => {
                setSelectedRole(role);
                setShowRoleDialog(true);
              }}
            />
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-6">
            <PermissionMatrix />
          </TabsContent>
        </Tabs>

        <RoleDialog
          open={showRoleDialog}
          onOpenChange={setShowRoleDialog}
          role={selectedRole}
          onClose={() => {
            setShowRoleDialog(false);
            setSelectedRole(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
}