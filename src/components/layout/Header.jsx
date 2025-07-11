import React from 'react';
import { Bell, Search, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Header = ({ user, notifications = 3 }) => {
  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EduFlow
            </h1>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses, students, assignments..."
              className="pl-10 bg-background/60 backdrop-blur-sm border-border/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-destructive">
                {notifications}
              </Badge>
            )}
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 pl-2 border-l">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || 'Student'}</p>
              <p className="text-xs text-muted-foreground">{user?.role || 'Computer Science'}</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;