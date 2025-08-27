'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  MapPin, 
  AlertCircle,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Định nghĩa kiểu dữ liệu
interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'task' | 'reminder' | 'holiday';
  location?: string;
  description?: string;
  participants?: string[];
  isAllDay?: boolean;
}

// Mock data cho lịch
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Họp nhóm Marketing',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '10:30',
    type: 'meeting',
    location: 'Phòng họp A',
    description: 'Thảo luận về chiến dịch marketing Q1/2024',
    participants: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C']
  },
  {
    id: '2',
    title: 'Nộp báo cáo tài chính',
    date: '2024-01-15',
    startTime: '14:00',
    endTime: '15:00',
    type: 'task',
    description: 'Hoàn thành và nộp báo cáo tài chính tháng 12/2023'
  },
  {
    id: '3',
    title: 'Họp với khách hàng',
    date: '2024-01-16',
    startTime: '10:00',
    endTime: '11:30',
    type: 'meeting',
    location: 'Phòng họp B',
    description: 'Thảo luận về yêu cầu dự án mới',
    participants: ['Nguyễn Văn A', 'Phạm Thị D', 'Khách hàng X']
  },
  {
    id: '4',
    title: 'Nhắc nhở: Đặt lịch kiểm kê kho',
    date: '2024-01-17',
    startTime: '09:00',
    endTime: '09:15',
    type: 'reminder',
    description: 'Liên hệ với bộ phận kho để đặt lịch kiểm kê hàng tháng'
  },
  {
    id: '5',
    title: 'Tết Nguyên Đán',
    date: '2024-02-10',
    startTime: '00:00',
    endTime: '23:59',
    type: 'holiday',
    isAllDay: true,
    description: 'Nghỉ Tết Nguyên Đán'
  },
  {
    id: '6',
    title: 'Đào tạo nhân viên mới',
    date: '2024-01-18',
    startTime: '13:30',
    endTime: '16:30',
    type: 'meeting',
    location: 'Phòng đào tạo',
    description: 'Đào tạo quy trình làm việc cho nhân viên mới',
    participants: ['Nguyễn Văn A', 'Trần Thị B', 'Nhân viên mới']
  }
];

// Mock data cho các ngày trong tháng
const mockDaysInMonth = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  events: mockEvents.filter(event => {
    const eventDay = parseInt(event.date.split('-')[2]);
    return eventDay === i + 1;
  })
}));

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<string>('2024-01-15');
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    date: selectedDate,
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting'
  });
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentMonth, setCurrentMonth] = useState('Tháng 1, 2024');
  const [searchQuery, setSearchQuery] = useState('');

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'task':
        return 'bg-green-100 text-green-800';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800';
      case 'holiday':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'task':
        return <AlertCircle className="h-4 w-4" />;
      case 'reminder':
        return <Clock className="h-4 w-4" />;
      case 'holiday':
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event: Event = {
        id: `event-${Date.now()}`,
        title: newEvent.title || '',
        date: newEvent.date || selectedDate,
        startTime: newEvent.startTime || '09:00',
        endTime: newEvent.endTime || '10:00',
        type: newEvent.type as 'meeting' | 'task' | 'reminder' | 'holiday' || 'meeting',
        location: newEvent.location,
        description: newEvent.description,
        participants: newEvent.participants
      };
      
      setEvents([...events, event]);
      setShowEventDialog(false);
      setNewEvent({
        title: '',
        date: selectedDate,
        startTime: '09:00',
        endTime: '10:00',
        type: 'meeting'
      });
    }
  };

  const filteredEvents = events.filter(event => {
    if (searchQuery) {
      return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
             (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return event.date === selectedDate;
  });

  const eventsForSelectedDate = events.filter(event => event.date === selectedDate);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Lịch làm việc
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý lịch họp, công việc và sự kiện
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm sự kiện
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Thêm sự kiện mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin chi tiết cho sự kiện mới
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="title" className="text-right text-sm font-medium">
                      Tiêu đề
                    </label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="date" className="text-right text-sm font-medium">
                      Ngày
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="startTime" className="text-right text-sm font-medium">
                      Bắt đầu
                    </label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="endTime" className="text-right text-sm font-medium">
                      Kết thúc
                    </label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right text-sm font-medium">
                      Loại
                    </label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn loại sự kiện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Cuộc họp</SelectItem>
                        <SelectItem value="task">Công việc</SelectItem>
                        <SelectItem value="reminder">Nhắc nhở</SelectItem>
                        <SelectItem value="holiday">Ngày nghỉ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="location" className="text-right text-sm font-medium">
                      Địa điểm
                    </label>
                    <Input
                      id="location"
                      value={newEvent.location || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="description" className="text-right text-sm font-medium">
                      Mô tả
                    </label>
                    <Input
                      id="description"
                      value={newEvent.description || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEventDialog(false)}>Hủy</Button>
                  <Button onClick={handleAddEvent}>Thêm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Calendar View Selector */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button 
              variant={viewMode === 'month' ? 'default' : 'outline'} 
              onClick={() => setViewMode('month')}
              size="sm"
            >
              Tháng
            </Button>
            <Button 
              variant={viewMode === 'week' ? 'default' : 'outline'} 
              onClick={() => setViewMode('week')}
              size="sm"
            >
              Tuần
            </Button>
            <Button 
              variant={viewMode === 'day' ? 'default' : 'outline'} 
              onClick={() => setViewMode('day')}
              size="sm"
            >
              Ngày
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-medium">{currentMonth}</h3>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Lịch</TabsTrigger>
            <TabsTrigger value="events">Danh sách sự kiện</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            {viewMode === 'month' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                    <div key={index} className="py-2 text-center font-medium text-slate-500 dark:text-slate-400">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 grid-rows-5 h-[600px]">
                  {mockDaysInMonth.map((day, index) => (
                    <div 
                      key={index} 
                      className={`border-b border-r border-slate-200 dark:border-slate-700 p-2 ${
                        day.day === 15 ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => setSelectedDate(`2024-01-${day.day.toString().padStart(2, '0')}`)}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${
                          day.day === 15 ? 'text-blue-600 dark:text-blue-400' : ''
                        }`}>
                          {day.day}
                        </span>
                        {day.events.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {day.events.length}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-1 space-y-1 max-h-[80px] overflow-hidden">
                        {day.events.slice(0, 2).map((event, eventIndex) => (
                          <div 
                            key={eventIndex} 
                            className={`text-xs p-1 rounded ${getEventTypeColor(event.type)}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            +{day.events.length - 2} sự kiện khác
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {viewMode === 'day' && (
              <Card>
                <CardHeader>
                  <CardTitle>Lịch ngày {selectedDate.split('-')[2]}/{selectedDate.split('-')[1]}/{selectedDate.split('-')[0]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventsForSelectedDate.length > 0 ? (
                      eventsForSelectedDate.map((event, index) => (
                        <div key={index} className="flex space-x-4 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                          <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{event.title}</h3>
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{event.startTime} - {event.endTime}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                {event.description}
                              </p>
                            )}
                            {event.participants && event.participants.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Người tham gia:</p>
                                <div className="flex flex-wrap gap-1">
                                  {event.participants.map((participant, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {participant}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <CalendarIcon className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                        <p>Không có sự kiện nào trong ngày này</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => setShowEventDialog(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Thêm sự kiện
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {viewMode === 'week' && (
              <Card>
                <CardHeader>
                  <CardTitle>Lịch tuần (15/01/2024 - 21/01/2024)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                        <div key={index} className="text-center">
                          <div className="font-medium text-slate-500 dark:text-slate-400">{day}</div>
                          <div className={`text-lg font-bold mt-1 ${index === 2 ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                            {14 + index}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                      <div className="space-y-4">
                        {eventsForSelectedDate.length > 0 ? (
                          eventsForSelectedDate.map((event, index) => (
                            <div key={index} className="flex space-x-4 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                              <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
                                {getEventTypeIcon(event.type)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{event.title}</h3>
                                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{event.startTime} - {event.endTime}</span>
                                </div>
                                {event.location && (
                                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <p>Chọn một ngày để xem sự kiện</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách sự kiện</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                      <div key={index} className="flex space-x-4 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge variant="outline">
                              {event.date.split('-').reverse().join('/')}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                              {event.description}
                            </p>
                          )}
                          {event.participants && event.participants.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Người tham gia:</p>
                              <div className="flex flex-wrap gap-1">
                                {event.participants.map((participant, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {participant}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <CalendarIcon className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                      <p>Không tìm thấy sự kiện nào</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
}
