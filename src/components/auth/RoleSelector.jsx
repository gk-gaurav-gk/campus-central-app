
import React from 'react';
import { Users, UserCheck, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RoleSelector = ({ currentRole, onRoleSwitch, userEmail }) => {
  // Determine suggested role based on email domain
  const getSuggestedRole = (email) => {
    if (!email) return null;
    
    if (email.includes('@admin.') || email.includes('@admin.college.edu')) {
      return 'admin';
    } else if (email.includes('@faculty.') || email.includes('@teacher.') || email.includes('@faculty.college.edu')) {
      return 'teacher';
    } else if (email.includes('@student.') || email.includes('@student.college.edu')) {
      return 'student';
    }
    return 'student'; // Default fallback
  };

  const suggestedRole = getSuggestedRole(userEmail);

  return (
    <div className="mb-8">
      {suggestedRole && (
        <Alert className="mb-4">
          <AlertDescription>
            Based on your email domain, we suggest the <strong>{suggestedRole}</strong> role.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-center space-x-1 p-1 bg-muted rounded-lg">
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
    </div>
  );
};

export default RoleSelector;
