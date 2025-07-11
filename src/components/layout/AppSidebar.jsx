import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  Calendar,
  Users,
  BookOpen,
  CheckSquare,
  BarChart3,
  MessageSquare,
  CreditCard,
  Car,
  Star,
  Award,
  GraduationCap,
  Settings,
  User
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home
  },
  {
    title: 'Attendance',
    url: '/attendance',
    icon: CheckSquare
  },
  {
    title: 'Timetable',
    url: '/timetable',
    icon: Calendar
  },
  {
    title: 'Groups',
    url: '/groups',
    icon: Users
  },
  {
    title: 'Content',
    url: '/content',
    icon: BookOpen
  },
  {
    title: 'Assessments',
    url: '/assessments',
    icon: Award
  },
  {
    title: 'Messages',
    url: '/messages',
    icon: MessageSquare
  },
  {
    title: 'Fees',
    url: '/fees',
    icon: CreditCard
  },
  {
    title: 'Transport',
    url: '/transport',
    icon: Car
  },
  {
    title: 'Gamification',
    url: '/gamification',
    icon: Star
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3
  },
  {
    title: 'Alumni',
    url: '/alumni',
    icon: GraduationCap
  }
];

const AppSidebar = () => {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <Sidebar className="border-r border-border/50 bg-card/30 backdrop-blur-md">
      <SidebarContent>
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  EduFlow
                </h2>
                <p className="text-xs text-muted-foreground">College ERP</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  >
                    <User className="h-5 w-5" />
                    {!collapsed && <span>Profile</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  >
                    <Settings className="h-5 w-5" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;