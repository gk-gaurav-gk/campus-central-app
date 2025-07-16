import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/contexts/RoleContext';
import { 
  Send, 
  MessageSquare, 
  Users, 
  Plus,
  Search,
  MoreVertical,
  Pin,
  Reply
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  senderRole: 'student' | 'teacher' | 'admin';
  content: string;
  timestamp: string;
  isAnnouncement?: boolean;
  isPinned?: boolean;
  replies?: Message[];
}

interface CourseMessagesProps {
  courseId: string;
}

const CourseMessages: React.FC<CourseMessagesProps> = ({ courseId }) => {
  const { currentRole, user } = useRole();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Dr. Sarah Wilson',
      senderRole: 'teacher',
      content: 'Welcome to the React Fundamentals course! Please introduce yourselves and share your experience with JavaScript.',
      timestamp: '2024-01-15T10:00:00Z',
      isAnnouncement: true,
      isPinned: true
    },
    {
      id: '2',
      sender: 'Alex Johnson',
      senderRole: 'student',
      content: 'Hi everyone! I\'m Alex, a computer science student. I have basic JavaScript knowledge and excited to learn React.',
      timestamp: '2024-01-15T11:30:00Z'
    },
    {
      id: '3',
      sender: 'Maria Garcia',
      senderRole: 'student',
      content: 'Hello! I\'m Maria, working as a junior developer. Looking forward to mastering React components.',
      timestamp: '2024-01-15T12:15:00Z'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: user.name,
        senderRole: currentRole,
        content: newMessage,
        timestamp: new Date().toISOString(),
        isAnnouncement: currentRole === 'teacher' || currentRole === 'admin'
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Discussion</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            {(currentRole === 'teacher' || currentRole === 'admin') && (
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Pin Message
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Messages List */}
            <div className="max-h-96 overflow-y-auto space-y-4">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id}
                  className={`p-4 rounded-lg border ${
                    message.isAnnouncement ? 'border-blue-200 bg-blue-50' : 'border-border'
                  } ${message.isPinned ? 'border-yellow-200 bg-yellow-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender}`} />
                        <AvatarFallback>
                          {message.sender.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{message.sender}</span>
                          <Badge className={getRoleColor(message.senderRole)}>
                            {message.senderRole}
                          </Badge>
                          {message.isAnnouncement && (
                            <Badge variant="outline" className="text-blue-600">
                              Announcement
                            </Badge>
                          )}
                          {message.isPinned && (
                            <Pin className="w-4 h-4 text-yellow-600" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm">{message.content}</p>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                          {(currentRole === 'teacher' || currentRole === 'admin') && (
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t pt-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-20"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      25 course participants
                    </span>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseMessages;