import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import LoginForm from "./components/auth/LoginForm";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import AttendancePage from "./pages/AttendancePage";
import QuizListPage from "./pages/QuizListPage";
import NotFound from "./pages/NotFound";
import AssignmentsPage from "./pages/AssignmentsPage";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('student');

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleRoleSwitch = (role) => {
    setCurrentRole(role);
  };

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginForm 
            onLogin={handleLogin}
            onRoleSwitch={handleRoleSwitch}
            currentRole={currentRole}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <Layout user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Index user={user} />} />
                <Route path="/attendance" element={<AttendancePage userRole={currentRole} />} />
                <Route path="/quizzes" element={<QuizListPage />} />
                <Route path="/assignments" element={<AssignmentsPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
