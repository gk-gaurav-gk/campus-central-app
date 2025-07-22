import React, { useState, useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Users, Calendar, Plus, Settings } from 'lucide-react';
import { CourseCreationForm } from '@/components/admin/CourseCreationForm';
import { CourseEnrollmentModal } from '@/components/admin/CourseEnrollmentModal';
import { supabase } from '@/integrations/supabase/client';

const CourseGridAdmin = () => {
  const { currentRole } = useRole();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          course_code,
          department,
          semester,
          academic_year,
          instructor_id,
          credits,
          max_students,
          is_active,
          created_at,
          profiles:instructor_id (
            first_name,
            last_name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseCreated = () => {
    setCreateModalOpen(false);
    loadCourses();
  };

  const handleEnrollmentSuccess = () => {
    setEnrollmentModalOpen(false);
    loadCourses();
  };

  const openEnrollmentModal = (course: any) => {
    setSelectedCourse(course);
    setEnrollmentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-lg">Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with role-based actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Courses</h2>
          <p className="text-muted-foreground mt-1">
            {currentRole === 'admin' ? 'Manage all courses and enrollments' : 
             currentRole === 'teacher' ? 'Your assigned courses' : 
             'Your enrolled courses'}
          </p>
        </div>
        
        {currentRole === 'admin' && (
          <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <CourseCreationForm 
                onSuccess={handleCourseCreated}
                onCancel={() => setCreateModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{course.course_code}</p>
                </div>
                <Badge variant="outline">{course.credits} Credits</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {course.profiles ? 
                      `${course.profiles.first_name} ${course.profiles.last_name}` : 
                      'No instructor assigned'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{course.semester} {course.academic_year}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{course.department}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View
                </Button>
                {currentRole === 'admin' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEnrollmentModal(course)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            {currentRole === 'admin' ? 'Create your first course to get started.' : 'No courses assigned to you yet.'}
          </p>
        </div>
      )}

      {/* Enrollment Modal */}
      <CourseEnrollmentModal
        isOpen={enrollmentModalOpen}
        onClose={() => setEnrollmentModalOpen(false)}
        course={selectedCourse}
        onSuccess={handleEnrollmentSuccess}
      />
    </div>
  );
};

export default CourseGridAdmin;