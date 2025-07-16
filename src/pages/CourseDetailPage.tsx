import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Calendar, 
  MessageSquare, 
  Video, 
  FileText, 
  UserCheck,
  ClipboardList,
  Bell,
  Upload,
  Download,
  Save
} from 'lucide-react';
import CourseResources from '@/components/courses/CourseResources';
import CourseAssignments from '@/components/courses/CourseAssignments';
import CourseAttendance from '@/components/courses/CourseAttendance';
import CourseVideoSessions from '@/components/courses/CourseVideoSessions';
import CourseAnnouncements from '@/components/courses/CourseAnnouncements';
import CourseGroups from '@/components/courses/CourseGroups';

interface Course {
  id: string;
  title: string;
  description: string;
  course_code: string;
  department: string;
  credits: number;
  semester: string;
  academic_year: string;
  instructor_name?: string;
  section?: string;
  enrolled_students?: number;
  max_students: number;
}

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resources');
  const [isCreating, setIsCreating] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    course_code: '',
    department: '',
    credits: 3,
    semester: '',
    academic_year: '',
    max_students: 50
  });
  const { toast } = useToast();
  const { currentRole, user } = useRole();

  const isCreateMode = courseId === 'create';

  useEffect(() => {
    if (courseId && !isCreateMode) {
      fetchCourse();
    } else if (isCreateMode) {
      setLoading(false);
    }
  }, [courseId, isCreateMode]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(first_name, last_name)
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;

      const courseWithDetails = {
        ...data,
        instructor_name: data.profiles 
          ? `${data.profiles.first_name || ''} ${data.profiles.last_name || ''}`.trim()
          : 'TBD',
        section: 'SEC A', // Mock section data
        enrolled_students: Math.floor(Math.random() * data.max_students) // Mock enrollment
      };

      setCourse(courseWithDetails);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({
        title: 'Error',
        description: 'Failed to load course details',
        variant: 'destructive',
      });
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    setIsCreating(true);
    try {
      // For admins creating courses, instructor_id can be null initially
      // For teachers creating courses, they become the instructor
      const courseData = {
        ...courseForm,
        instructor_id: currentRole === 'teacher' ? user.id : null
      };

      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Course created successfully',
      });

      navigate(`/courses/${data.id}`);
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: 'Error',
        description: 'Failed to create course. Please check your permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getTabsForRole = () => {
    const baseTabs = [
      { value: 'content', label: 'Content', icon: FileText },
      { value: 'recording', label: 'Recording', icon: Video },
      { value: 'assessments', label: 'Assessments', icon: ClipboardList },
      { value: 'announcements', label: 'Announcements', icon: Bell },
    ];

    if (currentRole === 'teacher' || currentRole === 'admin') {
      baseTabs.push(
        { value: 'groups', label: 'Groups', icon: Users },
        { value: 'attendance', label: 'Attendance', icon: UserCheck }
      );
    } else if (currentRole === 'student') {
      // Students don't see groups and attendance
    }

    return baseTabs;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-muted rounded mb-6"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (isCreateMode) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/courses')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Create New Course</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                    placeholder="e.g., Introduction to Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course_code">Course Code</Label>
                  <Input
                    id="course_code"
                    value={courseForm.course_code}
                    onChange={(e) => setCourseForm({...courseForm, course_code: e.target.value})}
                    placeholder="e.g., CS101"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  placeholder="Brief description of the course..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={courseForm.department}
                    onChange={(e) => setCourseForm({...courseForm, department: e.target.value})}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Credits</Label>
                  <Select
                    value={courseForm.credits.toString()}
                    onValueChange={(value) => setCourseForm({...courseForm, credits: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Credit</SelectItem>
                      <SelectItem value="2">2 Credits</SelectItem>
                      <SelectItem value="3">3 Credits</SelectItem>
                      <SelectItem value="4">4 Credits</SelectItem>
                      <SelectItem value="5">5 Credits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_students">Max Students</Label>
                  <Input
                    id="max_students"
                    type="number"
                    value={courseForm.max_students}
                    onChange={(e) => setCourseForm({...courseForm, max_students: parseInt(e.target.value) || 50})}
                    min="1"
                    max="500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={courseForm.semester}
                    onValueChange={(value) => setCourseForm({...courseForm, semester: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academic_year">Academic Year</Label>
                  <Input
                    id="academic_year"
                    value={courseForm.academic_year}
                    onChange={(e) => setCourseForm({...courseForm, academic_year: e.target.value})}
                    placeholder="e.g., 2024-25"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/courses')}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCourse}
                  disabled={isCreating || !courseForm.title || !courseForm.course_code}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isCreating ? 'Creating...' : 'Create Course'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => navigate('/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const tabs = getTabsForRole();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/courses')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{course.course_code}</Badge>
                    <Badge variant="outline">{course.section}</Badge>
                    <Badge>{course.credits} Credits</Badge>
                  </div>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>
                {currentRole === 'teacher' && (
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Material
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Instructor: {course.instructor_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{course.semester} {course.academic_year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.department}</span>
                </div>
                {currentRole !== 'student' && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolled_students}/{course.max_students} Students</span>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <CourseResources courseId={course.id} />
          </TabsContent>

          <TabsContent value="recording" className="mt-6">
            <CourseVideoSessions courseId={course.id} />
          </TabsContent>

          <TabsContent value="assessments" className="mt-6">
            <CourseAssignments courseId={course.id} />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <CourseAnnouncements courseId={course.id} />
          </TabsContent>

          {(currentRole === 'teacher' || currentRole === 'admin') && (
            <>
              <TabsContent value="groups" className="mt-6">
                <CourseGroups courseId={course.id} />
              </TabsContent>
              
              <TabsContent value="attendance" className="mt-6">
                <CourseAttendance courseId={course.id} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetailPage;