-- Fix RLS policies for courses table
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
('11111111-1111-1111-1111-111111111111', 'Introduction to Computer Science', 'Basic concepts of programming and computer science', 'CS101', 'Computer Science', 3, 'Fall', '2024-25', (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1), 50, true),
('22222222-2222-2222-2222-222222222222', 'Data Structures and Algorithms', 'Comprehensive study of data structures and algorithms', 'CS201', 'Computer Science', 4, 'Spring', '2024-25', (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1), 40, true),
('33333333-3333-3333-3333-333333333333', 'Database Management Systems', 'Relational databases and SQL programming', 'CS301', 'Computer Science', 3, 'Fall', '2024-25', (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1), 35, true)
ON CONFLICT (id) DO NOTHING;

-- Create some course groups for the existing courses
INSERT INTO course_groups (id, course_id, name, description, group_type, max_members) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'CS101-A', 'Section A for Introduction to CS', 'section', 25),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'CS101-B', 'Section B for Introduction to CS', 'section', 25),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'CS201-Lab1', 'Lab Group 1 for Data Structures', 'lab', 20),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'CS301-Tutorial', 'Tutorial group for DBMS', 'tutorial', 15)
ON CONFLICT (id) DO NOTHING;

-- Add some student profiles with proper roll numbers
INSERT INTO student_profiles (id, user_id, roll_number, department, batch, semester, admission_year) VALUES
('sp111111-1111-1111-1111-111111111111', (SELECT id FROM profiles WHERE role = 'student' LIMIT 1 OFFSET 0), 'CS2023001', 'Computer Science', 'CS-A', 3, 2023),
('sp222222-2222-2222-2222-222222222222', (SELECT id FROM profiles WHERE role = 'student' LIMIT 1 OFFSET 1), 'CS2023002', 'Computer Science', 'CS-A', 3, 2023),
('sp333333-3333-3333-3333-333333333333', (SELECT id FROM profiles WHERE role = 'student' LIMIT 1 OFFSET 2), 'EE2023001', 'Electrical Engineering', 'EE-A', 3, 2023)
ON CONFLICT (user_id) DO NOTHING;

-- Create some course enrollments
INSERT INTO course_enrollments (course_id, student_id, enrollment_date, status) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM profiles WHERE role = 'student' LIMIT 1 OFFSET 0), now(), 'active'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM profiles WHERE role = 'student' LIMIT 1 OFFSET 1), now(), 'active'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM profiles WHERE role = 'student' LIMIT 1 OFFSET 0), now(), 'active'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM profiles WHERE role = 'student' LIMIT 1 OFFSET 2), now(), 'active')
ON CONFLICT DO NOTHING;