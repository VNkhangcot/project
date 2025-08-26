'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, FileText, Download, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const reportTemplates = [
  {
    id: 'user-activity',
    name: 'Hoạt động người dùng',
    description: 'Báo cáo chi tiết về hoạt động và hành vi người dùng',
    category: 'Người dùng',
  },
  {
    id: 'security-audit',
    name: 'Kiểm toán bảo mật',
    description: 'Phân tích các sự kiện bảo mật và mối đe dọa',
    category: 'Bảo mật',
  },
  {
    id: 'performance-metrics',
    name: 'Metrics hiệu suất',
    description: 'Thống kê hiệu suất hệ thống và ứng dụng',
    category: 'Hiệu suất',
  },
  {
    id: 'financial-summary',
    name: 'Tóm tắt tài chính',
    description: 'Báo cáo tài chính và chi phí vận hành',
    category: 'Tài chính',
  },
];

const dataFields = [
  { id: 'user_count', label: 'Số lượng người dùng', category: 'Người dùng' },
  { id: 'login_attempts', label: 'Lần đăng nhập', category: 'Bảo mật' },
  { id: 'failed_logins', label: 'Đăng nhập thất bại', category: 'Bảo mật' },
  { id: 'cpu_usage', label: 'Sử dụng CPU', category: 'Hiệu suất' },
  { id: 'memory_usage', label: 'Sử dụng Memory', category: 'Hiệu suất' },
  { id: 'response_time', label: 'Thời gian phản hồi', category: 'Hiệu suất' },
  { id: 'error_rate', label: 'Tỷ lệ lỗi', category: 'Hiệu suất' },
  { id: 'revenue', label: 'Doanh thu', category: 'Tài chính' },
  { id: 'costs', label: 'Chi phí', category: 'Tài chính' },
];

export default function ReportGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [reportName, setReportName] = useState('');
  const [description, setDescription] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [schedule, setSchedule] = useState('manual');

  const handleFieldChange = (fieldId: string, checked: boolean) => {
    setSelectedFields(prev => 
      checked 
        ? [...prev, fieldId]
        : prev.filter(id => id !== fieldId)
    );
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      setReportName(template.name);
      setDescription(template.description);
      // Auto-select relevant fields based on template category
      const relevantFields = dataFields
        .filter(field => field.category === template.category)
        .map(field => field.id);
      setSelectedFields(relevantFields);
    }
  };

  const generateReport = () => {
    console.log('Generating report:', {
      template: selectedTemplate,
      name: reportName,
      description,
      dateRange,
      fields: selectedFields,
      format: outputFormat,
      schedule,
    });
    // Here you would typically call an API to generate the report
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Mẫu báo cáo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{template.name}</span>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Cấu hình báo cáo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportName">Tên báo cáo</Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Nhập tên báo cáo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả ngắn về báo cáo"
                  rows={3}
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Khoảng thời gian</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, 'dd/MM/yyyy', { locale: vi }) : 'Từ ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, 'dd/MM/yyyy', { locale: vi }) : 'Đến ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Data Fields */}
            <div className="space-y-2">
              <Label>Trường dữ liệu</Label>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {dataFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={(checked) => handleFieldChange(field.id, !!checked)}
                    />
                    <Label htmlFor={field.id} className="text-sm">
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Định dạng</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lịch trình</Label>
                <Select value={schedule} onValueChange={setSchedule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Thủ công</SelectItem>
                    <SelectItem value="daily">Hàng ngày</SelectItem>
                    <SelectItem value="weekly">Hàng tuần</SelectItem>
                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button onClick={generateReport} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Tạo báo cáo
              </Button>
              <Button variant="outline">
                Lưu mẫu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}