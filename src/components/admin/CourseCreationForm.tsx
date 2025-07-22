
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CourseCreationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Mock data fallback for instructors
const mockInstructors = [
  { id: 'mock-teacher-1', first_name: 'John', last_name: 'Smith', email: 'john.smith@faculty.college.edu' },
  { id: 'mock-teacher-2', first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.johnson@faculty.college.edu' },
  { id: 'mock-teacher-3', first_name: 'Michael', last_name: 'Brown', email: 'michael.brown@faculty.college.edu' },
  { id: 'mock-teacher-4', first_name: 'Emily', last_name: 'Davis', email: 'emily.davis@faculty.college.edu' },
  { id: 'mock-teacher-5', first_name: 'David', last_name: 'Wilson', email: 'david.wilson@faculty.college.edu' },
  { id: 'mock-teacher-6', first_name: 'Lisa', last_name: 'Anderson', email: 'lisa.anderson@faculty.college.edu' },
  { id: 'mock-teacher-7', first_name: 'Robert', last_name: 'Taylor', email: 'robert.taylor@faculty.college.edu' },
  { id: 'mock-teacher-8', first_name: 'Jennifer', last_name: 'Martinez', email: 'jennifer.martinez@faculty.college.edu' }
];

export const CourseCreationForm: React.FC<CourseCreationFormProps> = ({ onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_code: '',
    department: '',
    semester: '',
    academic_year: '2024-25',
    credits: 3,
    max_students: 50,
    instructor_id: ''
  });

  const [teachers, setTeachers] = useState<any[]>([]);
  const [teachersLoaded, setTeachersLoaded] = useState(false);

  React.useEffect(() => {
    const loadTeachers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('role', 'teacher')
          .order('first_name');

        if (error) {
          console.error('Error loading teachers:', error);
          // Use mock data as fallback
          setTeachers(mockInstructors);
        } else if (data && data.length > 0) {
          setTeachers(data);
        } else {
          // Use mock data if no teachers found in database
          console.log('No teachers found in database, using mock data');
          setTeachers(mockInstructors);
        }
        setTeachersLoaded(true);
      } catch (error) {
        console.error('Error loading teachers:', error);
        // Use mock data as fallback
        setTeachers(mockInstructors);
        setTeachersLoaded(true);
      }
    };

    if (!teachersLoaded) {
      loadTeachers();
    }
  }, [teachersLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('courses')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Course Created',
        description: 'Course has been successfully created.',
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create course.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Course
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Introduction to Computer Science"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course_code">Course Code *</Label>
              <Input
                id="course_code"
                value={formData.course_code}
                onChange={(e) => handleInputChange('course_code', e.target.value)}
                placeholder="CS101"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Course description and objectives..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Select value={formData.instructor_id} onValueChange={(value) => handleInputChange('instructor_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Instructor" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall">Fall</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                value={formData.credits}
                onChange={(e) => handleInputChange('credits', parseInt(e.target.value))}
                min="1"
                max="6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_students">Max Students</Label>
              <Input
                id="max_students"
                type="number"
                value={formData.max_students}
                onChange={(e) => handleInputChange('max_students', parseInt(e.target.value))}
                min="1"
                max="200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading || !formData.title || !formData.instructor_id}>
              {isLoading ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
