import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import CourseGrid from '@/components/courses/CourseGrid';
import CourseGridAdmin from '@/components/courses/CourseGridAdmin';

const CoursesPage = () => {
  const { currentRole } = useRole();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Courses
          </h1>
          <p className="text-muted-foreground">
            {currentRole === 'student' ? 'View your enrolled courses and access materials' :
             currentRole === 'teacher' ? 'Manage your courses and students' :
             'Administer courses, sections, and student assignments'}
          </p>
        </div>

        {currentRole === 'admin' ? <CourseGridAdmin /> : <CourseGrid />}
      </div>
    </div>
  );
};

export default CoursesPage;