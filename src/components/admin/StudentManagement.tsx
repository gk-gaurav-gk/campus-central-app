import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  GraduationCap,
  Users,
  Download,
  Upload
} from 'lucide-react';

interface StudentProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  roll_number: string;
  department: string;
  batch: string;
  semester: number;
  admission_year: number;
}

interface Course {
  id: string;
  title: string;
  course_code: string;
}

const StudentManagement: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load students with their profiles
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          student_profiles (
            roll_number,
            department,
            batch,
            semester,
            admission_year
          )
        `)
        .eq('role', 'student');

      if (studentsError) throw studentsError;

      // Transform data
      const transformedStudents = studentsData.map(student => ({
        id: student.id,
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        email: student.email || '',
        roll_number: student.student_profiles?.[0]?.roll_number || '',
        department: student.student_profiles?.[0]?.department || '',
        batch: student.student_profiles?.[0]?.batch || '',
        semester: student.student_profiles?.[0]?.semester || 1,
        admission_year: student.student_profiles?.[0]?.admission_year || new Date().getFullYear()
      }));

      setStudents(transformedStudents);

      // Load courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, course_code');

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load student data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (formData: FormData) => {
    try {
      const studentData = {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: formData.get('email') as string,
        role: 'student' as const
      };

      const profileData = {
        roll_number: formData.get('rollNumber') as string,
        department: formData.get('department') as string,
        batch: formData.get('batch') as string,
        semester: parseInt(formData.get('semester') as string),
        admission_year: parseInt(formData.get('admissionYear') as string)
      };

      // Create user in profiles table - generate a random ID since we can't create auth users directly
      const userId = crypto.randomUUID();
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({ ...studentData, id: userId })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create student profile
      const { error: studentProfileError } = await supabase
        .from('student_profiles')
        .insert({
          user_id: profile.id,
          ...profileData
        });

      if (studentProfileError) throw studentProfileError;

      await loadData();
      setShowAddStudent(false);
      
      toast({
        title: 'Success',
        description: 'Student added successfully',
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error',
        description: 'Failed to add student',
        variant: 'destructive',
      });
    }
  };

  const handleEnrollStudent = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          student_id: selectedStudent
        });

      if (error) throw error;

      setShowEnrollDialog(false);
      setSelectedStudent('');
      
      toast({
        title: 'Success',
        description: 'Student enrolled in course successfully',
      });
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast({
        title: 'Error',
        description: 'Failed to enroll student',
        variant: 'destructive',
      });
    }
  };

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded animate-pulse"></div>
        <div className="h-96 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Manage students and course enrollments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddStudent(formData);
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input id="rollNumber" name="rollNumber" required />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select name="department">
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                        <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="batch">Batch</Label>
                    <Input id="batch" name="batch" placeholder="e.g., CS-A" required />
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select name="semester">
                      <SelectTrigger>
                        <SelectValue placeholder="Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(sem => (
                          <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="admissionYear">Admission Year</Label>
                    <Input 
                      id="admissionYear" 
                      name="admissionYear" 
                      type="number" 
                      defaultValue={new Date().getFullYear()} 
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">Add Student</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">
                  {new Set(students.map(s => s.department)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students by name, email, roll number, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Students Table */}
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No students found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Add your first student to get started'}
                </p>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div 
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">
                        {student.first_name} {student.last_name}
                      </h4>
                      <Badge variant="outline">
                        {student.roll_number}
                      </Badge>
                      <Badge variant="secondary">
                        {student.department}
                      </Badge>
                      <Badge variant="outline">
                        Sem {student.semester}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{student.email}</span>
                      <span>•</span>
                      <span>Batch: {student.batch}</span>
                      <span>•</span>
                      <span>Year: {student.admission_year}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedStudent(student.id);
                        setShowEnrollDialog(true);
                      }}
                    >
                      Enroll in Course
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enroll Student Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Student in Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Course</Label>
              <Select onValueChange={handleEnrollStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.course_code} - {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManagement;