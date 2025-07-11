
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
  ClipboardList
} from 'lucide-react';

const AppSidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: UserCheck, label: 'Attendance', path: '/attendance' },
    { icon: GraduationCap, label: 'Quizzes', path: '/quizzes' },
    { icon: ClipboardList, label: 'Assignments', path: '/assignments' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

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
