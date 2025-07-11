import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, Plus, Send, Paperclip, Smile, Users, Hash } from 'lucide-react';

interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  group_type: 'course' | 'study_group' | 'project' | 'private';
  created_by: string;
  is_private: boolean;
  max_members: number;
  created_at: string;
  course_title?: string;
  members_count: number;
}

interface ChatMessage {
  id: string;
  content: string;
  message_type: 'text' | 'file' | 'image' | 'location';
  created_at: string;
  sender_name?: string;
  sender_id: string;
  is_edited: boolean;
}

const ChatGroups = () => {
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    description: '',
    group_type: 'study_group' as const,
    is_private: false,
    max_members: 50,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchMessages(selectedGroup.id);
      // Set up real-time subscription for messages
      const channel = supabase
        .channel(`chat_messages_${selectedGroup.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `group_id=eq.${selectedGroup.id}`
          },
          (payload) => {
            fetchMessages(selectedGroup.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_groups')
        .select(`
          *,
          courses(title),
          chat_messages(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const groupsWithDetails = data?.map(group => ({
        ...group,
        group_type: group.group_type as 'course' | 'study_group' | 'project' | 'private',
        course_title: group.courses?.title || null,
        members_count: group.chat_messages?.length || 0,
      })) || [];

      setGroups(groupsWithDetails);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat groups',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles!chat_messages_sender_id_fkey(first_name, last_name)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      const messagesWithSender = data?.map(message => ({
        ...message,
        message_type: message.message_type as 'text' | 'file' | 'image' | 'location',
        sender_name: message.profiles 
          ? `${message.profiles.first_name || ''} ${message.profiles.last_name || ''}`.trim()
          : 'Unknown',
      })) || [];

      setMessages(messagesWithSender);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    }
  };

  const handleCreateGroup = async () => {
    if (!groupFormData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a group name',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_groups')
        .insert({
          name: groupFormData.name,
          description: groupFormData.description || null,
          group_type: groupFormData.group_type,
          is_private: groupFormData.is_private,
          max_members: groupFormData.max_members,
          created_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Chat group created successfully',
      });

      setIsCreateGroupOpen(false);
      setGroupFormData({
        name: '',
        description: '',
        group_type: 'study_group',
        is_private: false,
        max_members: 50,
      });
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create chat group',
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedGroup || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          group_id: selectedGroup.id,
          sender_id: user?.id,
          content: newMessage,
          message_type: 'text',
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <Hash className="w-4 h-4" />;
      case 'study_group':
        return <Users className="w-4 h-4" />;
      case 'project':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getGroupTypeBadge = (type: string) => {
    const variants = {
      course: 'default',
      study_group: 'secondary',
      project: 'outline',
      private: 'destructive',
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'secondary'}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="lg:col-span-1">
          <Card className="animate-pulse h-full">
            <CardContent className="p-4">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="animate-pulse h-full">
            <CardContent className="p-4">
              <div className="h-full bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Chat Groups List */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Chat Groups
            </CardTitle>
            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Chat Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Group Name</label>
                    <Input
                      value={groupFormData.name}
                      onChange={(e) => setGroupFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter group name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={groupFormData.description}
                      onChange={(e) => setGroupFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter group description"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Group Type</label>
                    <Select
                      value={groupFormData.group_type}
                      onValueChange={(value) => setGroupFormData(prev => ({ ...prev, group_type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select group type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="study_group">Study Group</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Max Members</label>
                    <Input
                      type="number"
                      value={groupFormData.max_members}
                      onChange={(e) => setGroupFormData(prev => ({ ...prev, max_members: parseInt(e.target.value) || 50 }))}
                      min="2"
                      max="100"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="private"
                      checked={groupFormData.is_private}
                      onChange={(e) => setGroupFormData(prev => ({ ...prev, is_private: e.target.checked }))}
                    />
                    <label htmlFor="private" className="text-sm font-medium">Private Group</label>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateGroup} className="flex-1">
                      Create Group
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-2">
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No chat groups available</p>
              </div>
            ) : (
              groups.map((group) => (
                <Card 
                  key={group.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedGroup?.id === group.id ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {getGroupTypeIcon(group.group_type)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{group.name}</h4>
                          {getGroupTypeBadge(group.group_type)}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {group.description || 'No description'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {group.members_count} messages
                          </span>
                          {group.course_title && (
                            <Badge variant="outline" className="text-xs">
                              {group.course_title}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat Messages */}
      <div className="lg:col-span-2">
        {selectedGroup ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getGroupTypeIcon(selectedGroup.group_type)}
                    {selectedGroup.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedGroup.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  {getGroupTypeBadge(selectedGroup.group_type)}
                  <Badge variant="outline">
                    {selectedGroup.max_members} max
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No messages yet</h3>
                    <p className="text-muted-foreground">
                      Start the conversation by sending the first message.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.sender_id === user?.id ? 'order-2' : 'order-1'}`}>
                        {message.sender_id !== user?.id && (
                          <p className="text-xs text-muted-foreground mb-1">{message.sender_name}</p>
                        )}
                        <div 
                          className={`p-3 rounded-lg ${
                            message.sender_id === user?.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${
                              message.sender_id === user?.id 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground'
                            }`}>
                              {new Date(message.created_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {message.is_edited && (
                              <span className={`text-xs ${
                                message.sender_id === user?.id 
                                  ? 'text-primary-foreground/70' 
                                  : 'text-muted-foreground'
                              }`}>
                                edited
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Select a Chat Group</h3>
                <p className="text-muted-foreground">
                  Choose a chat group from the left to start messaging.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatGroups;