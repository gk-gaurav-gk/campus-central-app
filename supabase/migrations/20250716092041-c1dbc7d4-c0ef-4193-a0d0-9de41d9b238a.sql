-- Fix RLS policies for courses table and add sample data
-- The issue is that admins cannot create courses because the instructor_id requirement conflicts with admin role

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
DROP POLICY IF EXISTS "Teachers can manage their courses" ON courses;
DROP POLICY IF EXISTS "Teachers can view all courses" ON courses;
DROP POLICY IF EXISTS "Students can view active courses" ON courses;

-- Create new policies that work properly
CREATE POLICY "Admins can manage all courses" ON courses
FOR ALL USING (
  user_has_role(auth.uid(), 'admin'::user_role)
);

CREATE POLICY "Teachers can view all courses" ON courses
FOR SELECT USING (
  user_has_role(auth.uid(), 'teacher'::user_role)
);

CREATE POLICY "Teachers can manage their assigned courses" ON courses
FOR ALL USING (
  instructor_id = auth.uid() AND user_has_role(auth.uid(), 'teacher'::user_role)
);

CREATE POLICY "Students can view active courses" ON courses
FOR SELECT USING (
  is_active = true AND user_has_role(auth.uid(), 'student'::user_role)
);

-- Add mock data for testing
-- Insert some sample courses with proper instructor assignments
INSERT INTO courses (id, title, description, course_code, department, credits, semester, academic_year, instructor_id, max_students, is_active) VALUES
(gen_random_uuid(), 'Introduction to Computer Science', 'Basic concepts of programming and computer science', 'CS101', 'Computer Science', 3, 'Fall', '2024-25', (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1), 50, true),
(gen_random_uuid(), 'Data Structures and Algorithms', 'Comprehensive study of data structures and algorithms', 'CS201', 'Computer Science', 4, 'Spring', '2024-25', (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1), 40, true),
(gen_random_uuid(), 'Database Management Systems', 'Relational databases and SQL programming', 'CS301', 'Computer Science', 3, 'Fall', '2024-25', (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1), 35, true);