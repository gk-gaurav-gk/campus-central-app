import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserManagement } from './UserManagement';
import { Users, UserPlus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  course_code: string;
  department: string;
}

interface CourseEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSuccess?: () => void;
}

export const CourseEnrollmentModal: React.FC<CourseEnrollmentModalProps> = ({
  isOpen,
  onClose,
  course,
  onSuccess
}) => {
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: User[] }>({
    teachers: [],
    teaching_assistants: [],
    students: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectionChange = (users: User[], role: string) => {
    setSelectedUsers(prev => ({
      ...prev,
      [role]: users
    }));
  };

  const getRoleInCourse = (role: string) => {
    switch (role) {
      case 'teachers':
        return 'instructor';
      case 'teaching_assistants':
        return 'teaching_assistant';
      case 'students':
        return 'learner';
      default:
        return 'learner';
    }
  };

  const handleEnrollUsers = async () => {
    if (!course) return;

    setIsLoading(true);
    
    try {
      const enrollments: any[] = [];
      
      // Prepare enrollments for all selected users
      Object.entries(selectedUsers).forEach(([role, users]) => {
        users.forEach(user => {
          enrollments.push({
            course_id: course.id,
            student_id: user.id,
            role_in_course: getRoleInCourse(role),
            enrollment_date: new Date().toISOString()
          });
        });
      });

      if (enrollments.length === 0) {
        toast({
          title: 'No users selected',
          description: 'Please select at least one user to enroll.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('course_enrollments')
        .insert(enrollments);

      if (error) throw error;

      const totalEnrolled = enrollments.length;
      toast({
        title: 'Enrollment Successful',
        description: `Successfully enrolled ${totalEnrolled} user(s) in ${course.title}`,
      });

      // Reset selections
      setSelectedUsers({
        teachers: [],
        teaching_assistants: [],
        students: []
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast({
        title: 'Enrollment Failed',
        description: error.message || 'Failed to enroll users in the course.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalSelected = () => {
    return Object.values(selectedUsers).reduce((total, users) => total + users.length, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Manage Course Enrollment
          </DialogTitle>
        </DialogHeader>

        {course && (
          <div className="space-y-6">
            {/* Course Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Course Code: {course.course_code}</span>
                  <span>Department: {course.department}</span>
                </div>
              </CardContent>
            </Card>

            {/* Selection Summary */}
            {getTotalSelected() > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Selected Users ({getTotalSelected()})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.teachers.length > 0 && (
                      <Badge variant="outline" className="text-sm">
                        {selectedUsers.teachers.length} Teacher(s)
                      </Badge>
                    )}
                    {selectedUsers.teaching_assistants.length > 0 && (
                      <Badge variant="outline" className="text-sm">
                        {selectedUsers.teaching_assistants.length} Teaching Assistant(s)
                      </Badge>
                    )}
                    {selectedUsers.students.length > 0 && (
                      <Badge variant="outline" className="text-sm">
                        {selectedUsers.students.length} Student(s)
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Management */}
            <UserManagement onSelectionChange={handleSelectionChange} />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleEnrollUsers}
                disabled={isLoading || getTotalSelected() === 0}
              >
                {isLoading ? 'Enrolling...' : `Enroll ${getTotalSelected()} User(s)`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};