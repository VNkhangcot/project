'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Search, 
  Send, 
  User, 
  Users, 
  Phone, 
  Video, 
  Image as ImageIcon, 
  File, 
  Paperclip, 
  MoreVertical, 
  Plus,
  ChevronRight,
  Star,
  Clock
} from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Định nghĩa kiểu dữ liệu
interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  isRead: boolean;
  attachments?: Array<{
    type: 'image' | 'file';
    name: string;
    url: string;
    size?: string;
  }>;
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
  }>;
  messages: Message[];
  unreadCount: number;
  lastMessageTime: string;
  isGroup?: boolean;
  groupName?: string;
}

// Mock data cho người dùng hiện tại
const currentUser = {
  id: 'user-1',
  name: 'Nguyễn Văn A',
  avatar: '/avatars/user-1.png'
};

// Mock data cho các cuộc trò chuyện
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      {
        id: 'user-2',
        name: 'Trần Thị B',
        avatar: '/avatars/user-2.png',
        status: 'online'
      }
    ],
    messages: [
      {
        id: 'msg-1',
        content: 'Chào anh, anh có thể gửi cho em báo cáo doanh thu tháng 12 được không?',
        sender: {
          id: 'user-2',
          name: 'Trần Thị B'
        },
        timestamp: '10:30',
        isRead: true
      },
      {
        id: 'msg-2',
        content: 'Được, tôi sẽ gửi cho bạn ngay bây giờ.',
        sender: {
          id: 'user-1',
          name: 'Nguyễn Văn A'
        },
        timestamp: '10:32',
        isRead: true
      },
      {
        id: 'msg-3',
        content: 'Đây là báo cáo doanh thu tháng 12. Bạn xem qua nhé.',
        sender: {
          id: 'user-1',
          name: 'Nguyễn Văn A'
        },
        timestamp: '10:33',
        isRead: true,
        attachments: [
          {
            type: 'file',
            name: 'Báo cáo doanh thu T12.xlsx',
            url: '#',
            size: '2.4 MB'
          }
        ]
      },
      {
        id: 'msg-4',
        content: 'Cảm ơn anh nhiều!',
        sender: {
          id: 'user-2',
          name: 'Trần Thị B'
        },
        timestamp: '10:35',
        isRead: false
      }
    ],
    unreadCount: 1,
    lastMessageTime: '10:35'
  },
  {
    id: 'conv-2',
    isGroup: true,
    groupName: 'Nhóm Marketing',
    participants: [
      {
        id: 'user-2',
        name: 'Trần Thị B',
        avatar: '/avatars/user-2.png',
        status: 'online'
      },
      {
        id: 'user-3',
        name: 'Lê Văn C',
        avatar: '/avatars/user-3.png',
        status: 'offline'
      },
      {
        id: 'user-4',
        name: 'Phạm Thị D',
        avatar: '/avatars/user-4.png',
        status: 'away'
      }
    ],
    messages: [
      {
        id: 'msg-5',
        content: 'Chào cả nhóm, chúng ta cần hoàn thành chiến dịch marketing cho Q1/2024 trước ngày 20/01.',
        sender: {
          id: 'user-1',
          name: 'Nguyễn Văn A'
        },
        timestamp: '09:15',
        isRead: true
      },
      {
        id: 'msg-6',
        content: 'Tôi đã chuẩn bị một số ý tưởng, tôi sẽ chia sẻ trong cuộc họp chiều nay.',
        sender: {
          id: 'user-3',
          name: 'Lê Văn C'
        },
        timestamp: '09:20',
        isRead: true
      },
      {
        id: 'msg-7',
        content: 'Tuyệt vời! Tôi cũng có một số ý tưởng về chiến dịch trên mạng xã hội.',
        sender: {
          id: 'user-2',
          name: 'Trần Thị B'
        },
        timestamp: '09:22',
        isRead: true
      }
    ],
    unreadCount: 0,
    lastMessageTime: '09:22'
  },
  {
    id: 'conv-3',
    participants: [
      {
        id: 'user-5',
        name: 'Hoàng Văn E',
        avatar: '/avatars/user-5.png',
        status: 'offline'
      }
    ],
    messages: [
      {
        id: 'msg-8',
        content: 'Anh ơi, anh có thể giúp em kiểm tra lại báo cáo này không?',
        sender: {
          id: 'user-5',
          name: 'Hoàng Văn E'
        },
        timestamp: 'Hôm qua',
        isRead: true,
        attachments: [
          {
            type: 'file',
            name: 'Báo cáo kinh doanh.docx',
            url: '#',
            size: '1.8 MB'
          }
        ]
      },
      {
        id: 'msg-9',
        content: 'Được, tôi sẽ xem qua và phản hồi lại bạn vào ngày mai.',
        sender: {
          id: 'user-1',
          name: 'Nguyễn Văn A'
        },
        timestamp: 'Hôm qua',
        isRead: true
      }
    ],
    unreadCount: 0,
    lastMessageTime: 'Hôm qua'
  }
];

// Mock data cho danh bạ
const mockContacts = [
  {
    id: 'user-2',
    name: 'Trần Thị B',
    avatar: '/avatars/user-2.png',
    department: 'Marketing',
    status: 'online'
  },
  {
    id: 'user-3',
    name: 'Lê Văn C',
    avatar: '/avatars/user-3.png',
    department: 'Kinh doanh',
    status: 'offline'
  },
  {
    id: 'user-4',
    name: 'Phạm Thị D',
    avatar: '/avatars/user-4.png',
    department: 'Nhân sự',
    status: 'away'
  },
  {
    id: 'user-5',
    name: 'Hoàng Văn E',
    avatar: '/avatars/user-5.png',
    department: 'Tài chính',
    status: 'offline'
  },
  {
    id: 'user-6',
    name: 'Nguyễn Thị F',
    avatar: '/avatars/user-6.png',
    department: 'IT',
    status: 'online'
  }
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: Message = {
        id: `msg-${Date.now()}`,
        content: newMessage,
        sender: {
          id: currentUser.id,
          name: currentUser.name
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };
      
      const updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, message],
        lastMessageTime: message.timestamp
      };
      
      setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id ? updatedConversation : conv
      ));
      
      setSelectedConversation(updatedConversation);
      setNewMessage('');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-slate-300';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const participantNames = conv.participants.map(p => p.name.toLowerCase());
    const groupName = conv.groupName?.toLowerCase();
    
    return participantNames.some(name => name.includes(searchQuery.toLowerCase())) ||
           (groupName && groupName.includes(searchQuery.toLowerCase()));
  });

  return (
    <UserLayout>
      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          {/* Search and New Message */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button size="icon" onClick={() => setShowNewMessageDialog(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Conversations List */}
          <Tabs defaultValue="chats" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 mx-4 mt-2">
              <TabsTrigger value="chats">Trò chuyện</TabsTrigger>
              <TabsTrigger value="contacts">Danh bạ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chats" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-1 p-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        selectedConversation?.id === conversation.id ? 'bg-slate-100 dark:bg-slate-800' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      {conversation.isGroup ? (
                        <div className="relative">
                          <div className="bg-slate-200 dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback>{conversation.participants[0].name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${getStatusColor(conversation.participants[0].status)}`}></span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-sm truncate">
                            {conversation.isGroup 
                              ? conversation.groupName 
                              : conversation.participants[0].name}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {conversation.messages[conversation.messages.length - 1].content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="contacts" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-1 p-2">
                  {mockContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${getStatusColor(contact.status)}`}></span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{contact.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {contact.department}
                        </p>
                      </div>
                      
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {selectedConversation.isGroup ? (
                  <div className="bg-slate-200 dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  </div>
                ) : (
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback>{selectedConversation.participants[0].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${getStatusColor(selectedConversation.participants[0].status)}`}></span>
                  </div>
                )}
                
                <div>
                  <h2 className="font-medium">
                    {selectedConversation.isGroup 
                      ? selectedConversation.groupName 
                      : selectedConversation.participants[0].name}
                  </h2>
                  {selectedConversation.isGroup ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedConversation.participants.length} thành viên
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedConversation.participants[0].status === 'online' 
                        ? 'Đang hoạt động' 
                        : selectedConversation.participants[0].status === 'away'
                          ? 'Đang bận'
                          : 'Ngoại tuyến'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex space-x-2 max-w-[70%]">
                      {message.sender.id !== currentUser.id && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div>
                        <div 
                          className={`rounded-lg p-3 ${
                            message.sender.id === currentUser.id 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-slate-100 dark:bg-slate-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div 
                                  key={index} 
                                  className={`flex items-center space-x-2 p-2 rounded ${
                                    message.sender.id === currentUser.id 
                                      ? 'bg-blue-600' 
                                      : 'bg-slate-200 dark:bg-slate-700'
                                  }`}
                                >
                                  {attachment.type === 'image' ? (
                                    <ImageIcon className="h-4 w-4" />
                                  ) : (
                                    <File className="h-4 w-4" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{attachment.name}</p>
                                    {attachment.size && (
                                      <p className="text-xs opacity-70">{attachment.size}</p>
                                    )}
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={`h-6 w-6 ${
                                      message.sender.id === currentUser.id 
                                        ? 'text-blue-100 hover:text-white hover:bg-blue-700' 
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                    }`}
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[40px] flex-1 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                Chọn một cuộc trò chuyện
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Hoặc bắt đầu cuộc trò chuyện mới
              </p>
              <Button 
                className="mt-4"
                onClick={() => setShowNewMessageDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tin nhắn mới
              </Button>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
