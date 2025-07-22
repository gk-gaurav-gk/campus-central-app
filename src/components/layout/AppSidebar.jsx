
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Home,
  BookOpen,
  FileText,
  ClipboardList,
  Users,
  Calendar,
  MessageSquare,
  Search,
  Briefcase,
  Settings,
  UserCheck,
  BarChart3
} from 'lucide-react';

const AppSidebar = () => {
  const { currentRole } = useRole();
  const location = useLocation();

  // Navigation items based on role
  const getNavigationItems = () => {
    const commonItems = [
      { title: 'Dashboard', url: '/', icon: Home },
      { title: 'Courses', url: '/courses', icon: BookOpen },
      { title: 'Assignments', url: '/assignments', icon: FileText },
      { title: 'Quizzes', url: '/quizzes', icon: ClipboardList },
      { title: 'Attendance', url: '/attendance', icon: UserCheck },
      { title: 'Messages', url: '/messages', icon: MessageSquare },
      { title: 'Research', url: '/research', icon: Search },
      { title: 'Placements', url: '/placements', icon: Briefcase },
      { title: 'Settings', url: '/settings', icon: Settings },
    ];

    const adminItems = [
      { title: 'Student Management', url: '/admin/students', icon: Users },
      { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
    ];

    return currentRole === 'admin' 
      ? [...commonItems.slice(0, -1), ...adminItems, commonItems[commonItems.length - 1]]
      : commonItems;
  };

  const navigationItems = getNavigationItems();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Academic Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
