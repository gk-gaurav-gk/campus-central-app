
import React from 'react';
import { Users, UserCheck, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RoleSelector = ({ currentRole, onRoleSwitch }) => {
  return (
    <div className="flex justify-center space-x-1 mb-8 p-1 bg-muted rounded-lg">
      <Button
        variant={currentRole === 'student' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onRoleSwitch('student')}
        className="flex-1 rounded-md"
      >
        <Users className="h-4 w-4 mr-2" />
        Student
      </Button>
      <Button
        variant={currentRole === 'teacher' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onRoleSwitch('teacher')}
        className="flex-1 rounded-md"
      >
        <UserCheck className="h-4 w-4 mr-2" />
        Teacher
      </Button>
      <Button
        variant={currentRole === 'admin' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onRoleSwitch('admin')}
        className="flex-1 rounded-md"
      >
        <BookOpen className="h-4 w-4 mr-2" />
        Admin
      </Button>
    </div>
  );
};

export default RoleSelector;
