import React from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardHome = ({ user }) => {
  const { isStudent, isTeacher, isAdmin } = useRoleAccess();

  if (isStudent) {
    return <StudentDashboard user={user} />;
  }

  if (isTeacher) {
    return <TeacherDashboard user={user} />;
  }

  if (isAdmin) {
    return <AdminDashboard user={user} />;
  }

  // Fallback to student dashboard
  return <StudentDashboard user={user} />;
};

export default DashboardHome;