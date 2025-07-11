
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  UserCheck, 
  BookOpen, 
  BarChart3, 
  Users, 
  Settings,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  Video,
  Calendar,
  FileText,
  Shield,
  Database,
  CreditCard,
  Bus,
  Car,
  HeartHandshake,
  Trophy,
  Briefcase
} from 'lucide-react';
import { useRoleAccess } from '@/hooks/useRoleAccess';

const AppSidebar = () => {
  const { userRole, canAccess, isStudent, isTeacher, isAdmin } = useRoleAccess();

  // Define menu items with role-based access
  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: '/', roles: ['student', 'teacher', 'admin'] },
    ];

    const studentItems = [
      { icon: UserCheck, label: 'Attendance', path: '/attendance', roles: ['student'] },
      { icon: GraduationCap, label: 'Quizzes', path: '/quizzes', roles: ['student'] },
      { icon: ClipboardList, label: 'Assignments', path: '/assignments', roles: ['student'] },
      { icon: BookOpen, label: 'Courses', path: '/courses', roles: ['student'] },
      { icon: MessageSquare, label: 'Messages', path: '/messages', roles: ['student'] },
      { icon: CreditCard, label: 'Fees', path: '/fees', roles: ['student'] },
      { icon: Bus, label: 'Transport', path: '/transport', roles: ['student'] },
      { icon: Car, label: 'Cab Sharing', path: '/cab-sharing', roles: ['student'] },
      { icon: HeartHandshake, label: 'Counseling', path: '/counseling', roles: ['student'] },
      { icon: Trophy, label: 'Rewards', path: '/rewards', roles: ['student'] },
    ];

    const teacherItems = [
      { icon: UserCheck, label: 'Attendance', path: '/attendance', roles: ['teacher'] },
      { icon: GraduationCap, label: 'Quizzes', path: '/quizzes', roles: ['teacher'] },
      { icon: ClipboardList, label: 'Assignments', path: '/assignments', roles: ['teacher'] },
      { icon: BookOpen, label: 'Courses', path: '/courses', roles: ['teacher'] },
      { icon: Users, label: 'Students', path: '/students', roles: ['teacher'] },
      { icon: Video, label: 'Video Classes', path: '/video-classes', roles: ['teacher'] },
      { icon: MessageSquare, label: 'Messages', path: '/messages', roles: ['teacher'] },
      { icon: BarChart3, label: 'Analytics', path: '/analytics', roles: ['teacher'] },
      { icon: FileText, label: 'Research', path: '/research', roles: ['teacher'] },
      { icon: Briefcase, label: 'Placements', path: '/placements', roles: ['teacher'] },
    ];

    const adminItems = [
      { icon: UserCheck, label: 'Attendance', path: '/attendance', roles: ['admin'] },
      { icon: GraduationCap, label: 'Quizzes', path: '/quizzes', roles: ['admin'] },
      { icon: ClipboardList, label: 'Assignments', path: '/assignments', roles: ['admin'] },
      { icon: BookOpen, label: 'Courses', path: '/courses', roles: ['admin'] },
      { icon: Users, label: 'Users', path: '/users', roles: ['admin'] },
      { icon: Video, label: 'Video Classes', path: '/video-classes', roles: ['admin'] },
      { icon: MessageSquare, label: 'Messages', path: '/messages', roles: ['admin'] },
      { icon: BarChart3, label: 'Analytics', path: '/analytics', roles: ['admin'] },
      { icon: CreditCard, label: 'Fee Management', path: '/fee-management', roles: ['admin'] },
      { icon: Bus, label: 'Transport', path: '/transport-admin', roles: ['admin'] },
      { icon: HeartHandshake, label: 'Counseling', path: '/counseling-admin', roles: ['admin'] },
      { icon: Trophy, label: 'Gamification', path: '/gamification', roles: ['admin'] },
      { icon: FileText, label: 'Research', path: '/research', roles: ['admin'] },
      { icon: Briefcase, label: 'Placements', path: '/placements', roles: ['admin'] },
      { icon: Shield, label: 'Security', path: '/security', roles: ['admin'] },
      { icon: Database, label: 'System', path: '/system', roles: ['admin'] },
    ];

    const settingsItem = [
      { icon: Settings, label: 'Settings', path: '/settings', roles: ['student', 'teacher', 'admin'] },
    ];

    let items = [...baseItems];
    
    if (isStudent()) {
      items = [...items, ...studentItems];
    } else if (isTeacher()) {
      items = [...items, ...teacherItems];
    } else if (isAdmin()) {
      items = [...items, ...adminItems];
    }
    
    items = [...items, ...settingsItem];
    
    // Filter items based on user role
    return items.filter(item => 
      item.roles.includes(userRole) || item.roles.includes('*')
    );
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">EduPlatform</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AppSidebar;
