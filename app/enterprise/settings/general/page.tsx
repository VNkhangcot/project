'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Save } from 'lucide-react';
import EnterpriseLayout from '@/components/layout/EnterpriseLayout';

export default function SettingsGeneralPage() {
  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Cài đặt doanh nghiệp</h1>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin doanh nghiệp</CardTitle>
            <CardDescription>
              Cập nhật thông tin cơ bản về doanh nghiệp của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Nội dung cài đặt doanh nghiệp sẽ được hiển thị ở đây.</p>
          </CardContent>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}
