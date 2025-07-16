import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { BookOpen, Users, Calendar, Play, Upload, Settings, Plus } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  course_code: string;
  department: string;
  credits: number;
  semester: string;
  academic_year: string;
  max_students: number;
  is_active: boolean;
  instructor_name?: string;
  section?: string;
  enrolled_students?: number;
}

const CourseGrid = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentRole, user } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [currentRole, user.id]);

  const fetchCourses = async () => {
    try {
      let query = supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(first_name, last_name)
        `);

      // Role-based filtering
      if (currentRole === 'student') {
        // Get courses the student is enrolled in
        query = query
          .eq('is_active', true)
          .in('id', await getStudentCourseIds());
      } else if (currentRole === 'teacher') {
        // Get courses the teacher is assigned to
        query = query.eq('instructor_id', user.id);
      } else if (currentRole === 'admin') {
        // Admins see all courses
        query = query.eq('is_active', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const coursesWithDetails = data?.map(course => ({
        ...course,
        instructor_name: course.profiles 
          ? `${course.profiles.first_name || ''} ${course.profiles.last_name || ''}`.trim()
          : 'TBD',
        section: 'SEC A', // Mock section data
        enrolled_students: Math.floor(Math.random() * course.max_students) // Mock enrollment
      })) || [];

      setCourses(coursesWithDetails);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStudentCourseIds = async () => {
    try {
      const { data } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('student_id', user.id);
      
      return data?.map(enrollment => enrollment.course_id) || [];
    } catch (error) {
      return [];
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const getActionButton = (course: Course) => {
    switch (currentRole) {
      case 'student':
        return (
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => handleCourseClick(course.id)}
          >
            <Play className="w-4 h-4 mr-2" />
            RESUME
          </Button>
        );
      case 'teacher':
        return (
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => handleCourseClick(course.id)}
          >
            <Upload className="w-4 h-4 mr-2" />
            MANAGE
          </Button>
        );
      case 'admin':
        return (
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => handleCourseClick(course.id)}
          >
            <Settings className="w-4 h-4 mr-2" />
            CONFIGURE
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse h-64">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentRole === 'admin' && (
        <div className="flex justify-end">
          <Button onClick={() => navigate('/courses/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No courses available</h3>
          <p className="text-muted-foreground mb-4">
            {currentRole === 'student' ? 'You are not enrolled in any courses yet.' :
             currentRole === 'teacher' ? 'You are not assigned to any courses yet.' :
             'No courses have been created yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
              onClick={() => handleCourseClick(course.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Course Header */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="text-xs">
                        {course.course_code}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.section}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  {/* Course Stats */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{course.instructor_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{course.semester} {course.academic_year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.credits} Credits • {course.department}</span>
                    </div>
                    {currentRole !== 'student' && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolled_students}/{course.max_students} Students</span>
                      </div>
                    )}
                  </div>

                  {/* Progress or Status */}
                  <div className="space-y-2">
                    {currentRole === 'student' && (
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                    {getActionButton(course)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseGrid;