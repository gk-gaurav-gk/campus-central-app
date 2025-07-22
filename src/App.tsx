import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleProvider } from "./contexts/RoleContext";
import Layout from "./components/layout/Layout";

type UserRole = 'student' | 'teacher' | 'admin';
import Index from "./pages/Index";
import AttendancePage from "./pages/AttendancePage";
import QuizListPage from "./pages/QuizListPage";
import NotFound from "./pages/NotFound";
import AssignmentsPage from "./pages/AssignmentsPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import StudentManagementPage from "./pages/StudentManagementPage";
import MessagesPage from "./pages/MessagesPage";
import ResearchPage from "./pages/ResearchPage";
import PlacementsPage from "./pages/PlacementsPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const AppContent = () => {
  // Demo mode - no authentication required
  const [currentRole, setCurrentRole] = useState<UserRole>('student');

  // Mock user data based on current role
  const getUserData = (role: UserRole) => {
    const userData = {
      student: {
        name: 'John Student',
        email: 'student.demo@gmail.com',
        role: 'student' as UserRole,
        avatar: null,
        id: '11111111-1111-1111-1111-111111111111'
      },
      teacher: {
        name: 'Sarah Professor',
        email: 'teacher.demo@gmail.com',
        role: 'teacher' as UserRole,
        avatar: null,
        id: '22222222-2222-2222-2222-222222222222'
      },
      admin: {
        name: 'Admin User',
        email: 'admin.demo@gmail.com',
        role: 'admin' as UserRole,
        avatar: null,
        id: '33333333-3333-3333-3333-333333333333'
      }
    };
    return userData[role] || userData.student;
  };

  const userData = getUserData(currentRole);

  return (
    <BrowserRouter>
      <RoleProvider currentRole={currentRole} user={userData}>
        <SidebarProvider>
          <Layout 
            user={userData} 
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
          >
            <Routes>
              <Route path="/" element={<Index user={userData} />} />
              <Route path="/attendance" element={<AttendancePage userRole={currentRole} />} />
              <Route path="/quizzes" element={<QuizListPage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/placements" element={<PlacementsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin/students" element={<StudentManagementPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </SidebarProvider>
      </RoleProvider>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
