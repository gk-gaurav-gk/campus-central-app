import React, { useState } from 'react';
import { Bell, X, Calendar, BookOpen, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'assignment',
      icon: BookOpen,
      title: 'New assignment posted',
      message: 'Database Design Assignment is now available',
      time: '2 minutes ago',
      unread: true,
      color: 'text-primary'
    },
    {
      id: 2,
      type: 'calendar',
      icon: Calendar,
      title: 'Upcoming quiz reminder',
      message: 'React Fundamentals Quiz in 1 hour',
      time: '45 minutes ago',
      unread: true,
      color: 'text-coral'
    },
    {
      id: 3,
      type: 'achievement',
      icon: Award,
      title: 'Achievement unlocked!',
      message: 'You earned 50 EduCoins for perfect attendance',
      time: '2 hours ago',
      unread: false,
      color: 'text-pink'
    },
    {
      id: 4,
      type: 'group',
      icon: Users,
      title: 'Study group invitation',
      message: 'Join the Machine Learning study group',
      time: '1 day ago',
      unread: false,
      color: 'text-secondary'
    }
  ];
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2 hover-lift">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 glass-card" align="end">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold font-comfortaa">Notifications</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                p-4 border-b border-border/30 hover:bg-gradient-glass cursor-pointer transition-all
                ${notification.unread ? 'bg-primary/5' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded-full bg-background`}>
                  <notification.icon className={`h-4 w-4 ${notification.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium truncate">
                      {notification.title}
                    </h4>
                    {notification.unread && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t border-border/50">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;