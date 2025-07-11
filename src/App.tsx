
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
import Index from "./pages/Index";
import AttendancePage from "./pages/AttendancePage";
import QuizListPage from "./pages/QuizListPage";
import NotFound from "./pages/NotFound";
import AssignmentsPage from "./pages/AssignmentsPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
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
