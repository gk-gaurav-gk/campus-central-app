import React, { useState } from 'react';
import { Bell, Search, User, Settings, UserCog, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import RoleChangeRequest from '@/components/auth/RoleChangeRequest';

const Header = ({ user, notifications = 3, onLogout }) => {
  const { userRole, getRoleBadgeColor } = useRoleAccess();
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      default: return role;
    }
  };
  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="lg:block">
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
              <div className="flex items-center gap-2 justify-end">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getRoleBadgeColor()} cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => setShowRoleDialog(true)}
                  title="Click to request role change"
                >
                  {getRoleDisplayName(userRole || user?.role)}
                </Badge>
                {userRole !== 'admin' && (
                  <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        title="Request role change"
                      >
                        <UserCog className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <RoleChangeRequest
                        currentRole={userRole || user?.role || 'student'}
                        userEmail={user?.email || ''}
                        onClose={() => setShowRoleDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;