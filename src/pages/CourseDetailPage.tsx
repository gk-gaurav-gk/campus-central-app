import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Download
} from 'lucide-react';
import CourseResources from '@/components/courses/CourseResources';
import CourseAssignments from '@/components/courses/CourseAssignments';
import CourseMessages from '@/components/courses/CourseMessages';
import CourseAttendance from '@/components/courses/CourseAttendance';
import CourseVideoSessions from '@/components/courses/CourseVideoSessions';
import CourseAnnouncements from '@/components/courses/CourseAnnouncements';

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
  const { toast } = useToast();
  const { currentRole } = useRole();

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

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

  const getTabsForRole = () => {
    const baseTabs = [
      { value: 'resources', label: 'Resources', icon: FileText },
      { value: 'assignments', label: 'Assignments', icon: ClipboardList },
      { value: 'messages', label: 'Messages', icon: MessageSquare },
      { value: 'announcements', label: 'Announcements', icon: Bell },
    ];

    if (currentRole === 'teacher' || currentRole === 'admin') {
      baseTabs.push(
        { value: 'attendance', label: 'Attendance', icon: UserCheck },
        { value: 'video', label: 'Video Classes', icon: Video }
      );
    } else if (currentRole === 'student') {
      baseTabs.push(
        { value: 'video', label: 'Video Classes', icon: Video }
      );
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

          <TabsContent value="resources" className="mt-6">
            <CourseResources courseId={course.id} />
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
            <CourseAssignments courseId={course.id} />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <CourseMessages courseId={course.id} />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <CourseAnnouncements courseId={course.id} />
          </TabsContent>

          {(currentRole === 'teacher' || currentRole === 'admin') && (
            <TabsContent value="attendance" className="mt-6">
              <CourseAttendance courseId={course.id} />
            </TabsContent>
          )}

          <TabsContent value="video" className="mt-6">
            <CourseVideoSessions courseId={course.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetailPage;