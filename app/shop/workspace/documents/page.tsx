'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FolderPlus, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Share2, 
  Star, 
  File, 
  FileImage, 
  FileSpreadsheet, 
  FileText
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Mock data cho tài liệu
const mockDocuments = [
  {
    id: '1',
    name: 'Báo cáo tài chính Q1 2024.xlsx',
    type: 'spreadsheet',
    size: '2.4 MB',
    owner: 'Nguyễn Văn A',
    lastModified: '15/01/2024',
    shared: true,
    starred: true,
    tags: ['Tài chính', 'Báo cáo']
  },
  {
    id: '2',
    name: 'Kế hoạch marketing 2024.docx',
    type: 'document',
    size: '1.8 MB',
    owner: 'Trần Thị B',
    lastModified: '10/01/2024',
    shared: true,
    starred: false,
    tags: ['Marketing', 'Kế hoạch']
  },
  {
    id: '3',
    name: 'Hình ảnh sản phẩm mới.jpg',
    type: 'image',
    size: '4.2 MB',
    owner: 'Lê Văn C',
    lastModified: '05/01/2024',
    shared: false,
    starred: false,
    tags: ['Sản phẩm', 'Hình ảnh']
  },
  {
    id: '4',
    name: 'Hướng dẫn sử dụng phần mềm.pdf',
    type: 'pdf',
    size: '3.5 MB',
    owner: 'Phạm Thị D',
    lastModified: '02/01/2024',
    shared: true,
    starred: true,
    tags: ['Hướng dẫn', 'Phần mềm']
  }
];

// Mock data cho thư mục
const mockFolders = [
  { id: '1', name: 'Tài liệu Marketing', itemCount: 12, owner: 'Nguyễn Văn A', lastModified: '15/01/2024' },
  { id: '2', name: 'Báo cáo Tài chính', itemCount: 8, owner: 'Trần Thị B', lastModified: '10/01/2024' },
  { id: '3', name: 'Hình ảnh Sản phẩm', itemCount: 24, owner: 'Lê Văn C', lastModified: '05/01/2024' },
  { id: '4', name: 'Tài liệu Nhân sự', itemCount: 15, owner: 'Phạm Thị D', lastModified: '02/01/2024' }
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [folders] = useState(mockFolders);
  const [searchQuery, setSearchQuery] = useState('');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      case 'image':
        return <FileImage className="h-6 w-6 text-purple-500" />;
      case 'pdf':
        return <File className="h-6 w-6 text-red-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      'Tài chính': 'bg-green-100 text-green-800',
      'Báo cáo': 'bg-blue-100 text-blue-800',
      'Marketing': 'bg-purple-100 text-purple-800',
      'Kế hoạch': 'bg-indigo-100 text-indigo-800',
      'Sản phẩm': 'bg-orange-100 text-orange-800',
      'Hình ảnh': 'bg-pink-100 text-pink-800',
      'Hướng dẫn': 'bg-yellow-100 text-yellow-800',
      'Phần mềm': 'bg-cyan-100 text-cyan-800'
    };
    
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  const toggleStar = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, starred: !doc.starred } : doc
    ));
  };

  const filteredDocuments = documents.filter(doc => {
    if (searchQuery) {
      return doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  });

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Tài liệu
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý và chia sẻ tài liệu trong công ty
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Tải lên
            </Button>
            <Button variant="outline">
              <FolderPlus className="h-4 w-4 mr-2" />
              Thư mục mới
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Folders */}
        {folders.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Thư mục</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <Card key={folder.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {folder.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {folder.itemCount} mục • Cập nhật: {folder.lastModified}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Đổi tên
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Chia sẻ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Tài liệu</h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Tên</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Thẻ</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Kích thước</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Người tạo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Cập nhật</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(doc.type)}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{doc.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag, index) => (
                            <Badge key={index} className={getTagColor(tag)}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {doc.size}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {doc.owner}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {doc.lastModified}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleStar(doc.id)}
                          >
                            <Star className={`h-4 w-4 ${doc.starred ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Tải xuống
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Chia sẻ
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Đổi tên
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDocuments.length === 0 && (
              <div className="py-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">Không tìm thấy tài liệu nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
