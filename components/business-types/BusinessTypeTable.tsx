'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Building, Users, Settings } from 'lucide-react';
import { BusinessTypeService } from '@/services/enterpriseService';
import { BusinessType } from '@/lib/types';

interface BusinessTypeTableProps {
  searchTerm: string;
  onEditBusinessType: (businessType: BusinessType) => void;
}

export default function BusinessTypeTable({ searchTerm, onEditBusinessType }: BusinessTypeTableProps) {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinessTypes();
  }, [searchTerm]);

  const loadBusinessTypes = async () => {
    try {
      setLoading(true);
      const response = await BusinessTypeService.getBusinessTypes();
      let filteredTypes = response.data || [];
      
      if (searchTerm) {
        filteredTypes = filteredTypes.filter(type =>
          type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          type.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setBusinessTypes(filteredTypes);
    } catch (error) {
      console.error('Error loading business types:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">Hoạt động</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">Không hoạt động</Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Finance': 'bg-green-100 text-green-800',
      'Manufacturing': 'bg-orange-100 text-orange-800',
      'Education': 'bg-purple-100 text-purple-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Retail': 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <Badge variant="secondary" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách loại doanh nghiệp ({businessTypes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Loại doanh nghiệp
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Danh mục
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Số doanh nghiệp
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Giới hạn mặc định
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Tính năng
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Trạng thái
                </th>
                <th className="text-right py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {businessTypes.map((businessType) => (
                <tr 
                  key={businessType._id} 
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{businessType.name}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{businessType.code}</p>
                      <p className="text-xs text-slate-500">{businessType.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getCategoryBadge(businessType.category)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-slate-400" />
                      <span>{businessType.enterpriseCount || 0}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>{businessType.defaultUserLimit}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {businessType.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature.replace('_', ' ')}
                        </Badge>
                      ))}
                      {businessType.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{businessType.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(businessType.isActive)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditBusinessType(businessType)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Cấu hình
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          disabled={(businessType.enterpriseCount || 0) > 0}
                        >
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