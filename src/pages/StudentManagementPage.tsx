import React from 'react';
import StudentManagement from '@/components/admin/StudentManagement';
import { useRole } from '@/contexts/RoleContext';

const StudentManagementPage: React.FC = () => {
  const { currentRole } = useRole();

  if (currentRole !== 'admin') {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Only administrators can access student management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <StudentManagement />
      </div>
    </div>
  );
};

export default StudentManagementPage;