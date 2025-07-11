
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "./components/auth/AuthForm";
import Layout from "./components/layout/Layout";
import LoadingScreen from "./components/layout/LoadingScreen";
import Index from "./pages/Index";
import AttendancePage from "./pages/AttendancePage";
import QuizListPage from "./pages/QuizListPage";
import NotFound from "./pages/NotFound";
import AssignmentsPage from "./pages/AssignmentsPage";
import CoursesPage from "./pages/CoursesPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <LoadingScreen stage="authentication" />;
  }

  if (!user) {
    return <AuthForm />;
  }

  // Create user object compatible with existing components
  const userData = {
    name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : user.email || 'User',
    email: user.email || '',
    role: profile?.role || 'student',
    avatar: profile?.avatar_url || null,
    id: user.id
  };

  const currentRole = profile?.role || 'student';

  return (
    <BrowserRouter>
      <SidebarProvider>
        <Layout user={userData} onLogout={() => {}}>
          <Routes>
            <Route path="/" element={<Index user={userData} />} />
            <Route path="/attendance" element={<AttendancePage userRole={currentRole} />} />
            <Route path="/quizzes" element={<QuizListPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </SidebarProvider>
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
