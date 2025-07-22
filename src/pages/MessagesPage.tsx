
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRole } from '@/contexts/RoleContext';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Plus, 
  Paperclip, 
  Star,
  Archive,
  Users
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher' | 'admin';
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  isStarred: boolean;
  isArchived: boolean;
  unreadCount: number;
  title: string;
  type: 'direct' | 'group';
}

const MessagesPage = () => {
  const { currentRole, user } = useRole();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Mock conversations data
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      participants: ['Dr. Sarah Wilson', user.name],
      lastMessage: {
        id: '1',
        senderId: 'teacher-1',
        senderName: 'Dr. Sarah Wilson',
        senderRole: 'teacher',
        content: 'Please submit your assignment by tomorrow.',
        timestamp: '2024-01-15T14:30:00Z',
        isRead: false,
        attachments: []
      },
      isStarred: true,
      isArchived: false,
      unreadCount: 1,
      title: 'Dr. Sarah Wilson',
      type: 'direct'
    },
    {
      id: '2',
      participants: ['Class Representatives', user.name],
      lastMessage: {
        id: '2',
        senderId: 'student-1',
        senderName: 'Alex Johnson',
        senderRole: 'student',
        content: 'Meeting scheduled for tomorrow at 3 PM.',
        timestamp: '2024-01-15T12:15:00Z',
        isRead: true,
        attachments: []
      },
      isStarred: false,
      isArchived: false,
      unreadCount: 0,
      title: 'Class Representatives Group',
      type: 'group'
    },
    {
      id: '3',
      participants: ['Admin Office', user.name],
      lastMessage: {
        id: '3',
        senderId: 'admin-1',
        senderName: 'Admin Office',
        senderRole: 'admin',
        content: 'Your registration is confirmed.',
        timestamp: '2024-01-14T16:45:00Z',
        isRead: true,
        attachments: ['registration_confirmation.pdf']
      },
      isStarred: false,
      isArchived: false,
      unreadCount: 0,
      title: 'Admin Office',
      type: 'direct'
    }
  ]);

  // Mock messages for selected conversation
  const [messages] = useState<{ [key: string]: Message[] }>({
    '1': [
      {
        id: '1',
        senderId: 'teacher-1',
        senderName: 'Dr. Sarah Wilson',
        senderRole: 'teacher',
        content: 'Hello! I hope you\'re doing well in the course.',
        timestamp: '2024-01-15T10:00:00Z',
        isRead: true,
        attachments: []
      },
      {
        id: '2',
        senderId: user.id,
        senderName: user.name,
        senderRole: currentRole,
        content: 'Thank you, Professor! I have a question about the assignment.',
        timestamp: '2024-01-15T10:15:00Z',
        isRead: true,
        attachments: []
      },
      {
        id: '3',
        senderId: 'teacher-1',
        senderName: 'Dr. Sarah Wilson',
        senderRole: 'teacher',
        content: 'Please submit your assignment by tomorrow.',
        timestamp: '2024-01-15T14:30:00Z',
        isRead: false,
        attachments: []
      }
    ]
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
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

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with teachers, students, and administrators
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Conversations</span>
                </CardTitle>
                <Dialog open={showNewMessage} onOpenChange={setShowNewMessage}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Message</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Search users..." />
                      <Textarea placeholder="Type your message..." />
                      <Button className="w-full">Send Message</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 hover:bg-muted cursor-pointer border-l-2 transition-colors ${
                      selectedConversation === conversation.id 
                        ? 'bg-muted border-l-primary' 
                        : 'border-l-transparent'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${conversation.title}`} />
                        <AvatarFallback>
                          {conversation.type === 'group' ? <Users className="w-4 h-4" /> : conversation.title.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate flex items-center space-x-1">
                            <span>{conversation.title}</span>
                            {conversation.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={getRoleColor(conversation.lastMessage.senderRole)}>
                            {conversation.lastMessage.senderRole}
                          </Badge>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversationData ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedConversationData.title}`} />
                        <AvatarFallback>
                          {selectedConversationData.type === 'group' ? <Users className="w-4 h-4" /> : selectedConversationData.title.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedConversationData.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversationData.type === 'group' ? 'Group Chat' : 'Direct Message'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          message.senderId === user.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        } rounded-lg p-3`}>
                          {message.senderId !== user.id && (
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-sm">{message.senderName}</span>
                              <Badge className={getRoleColor(message.senderRole)}>
                                {message.senderRole}
                              </Badge>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center space-x-2 text-xs">
                                  <Paperclip className="w-3 h-3" />
                                  <span>{attachment}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <span className="text-xs opacity-70 block mt-1">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
