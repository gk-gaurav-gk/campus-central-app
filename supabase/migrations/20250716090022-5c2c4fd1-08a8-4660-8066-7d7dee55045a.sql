-- Create course groups table for sections/groups
CREATE TABLE public.course_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  group_type TEXT NOT NULL DEFAULT 'section', -- 'section', 'lab', 'tutorial'
  max_members INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group memberships table
CREATE TABLE public.group_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.course_groups(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'student', -- 'student', 'teaching_assistant'
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, student_id)
);

-- Create course resources table
CREATE TABLE public.course_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.course_groups(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  category TEXT DEFAULT 'study_material', -- 'study_material', 'assignment', 'recording', 'other'
  is_downloadable BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.course_groups(id) ON DELETE SET NULL,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  marked_by UUID NOT NULL REFERENCES public.profiles(id),
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_present BOOLEAN NOT NULL DEFAULT false,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, student_id, attendance_date)
);

-- Create student profiles table for roll numbers and extended info
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  roll_number TEXT NOT NULL UNIQUE,
  admission_year INTEGER,
  department TEXT,
  batch TEXT,
  semester INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_groups
CREATE POLICY "Course members can view groups" ON public.course_groups
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.course_enrollments ce 
    WHERE ce.course_id = course_groups.course_id AND ce.student_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_groups.course_id AND c.instructor_id = auth.uid()
  ) OR
  user_has_role(auth.uid(), 'admin'::user_role)
);

CREATE POLICY "Instructors and admins can manage groups" ON public.course_groups
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_groups.course_id AND c.instructor_id = auth.uid()
  ) OR
  user_has_role(auth.uid(), 'admin'::user_role)
);

-- RLS Policies for group_memberships
CREATE POLICY "Group members can view memberships" ON public.group_memberships
FOR SELECT USING (
  student_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.course_groups cg 
    JOIN public.courses c ON cg.course_id = c.id
    WHERE cg.id = group_memberships.group_id AND c.instructor_id = auth.uid()
  ) OR
  user_has_role(auth.uid(), 'admin'::user_role)
);

CREATE POLICY "Instructors and admins can manage memberships" ON public.group_memberships
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.course_groups cg 
    JOIN public.courses c ON cg.course_id = c.id
    WHERE cg.id = group_memberships.group_id AND c.instructor_id = auth.uid()
  ) OR
  user_has_role(auth.uid(), 'admin'::user_role)
);

-- RLS Policies for course_resources
CREATE POLICY "Course members can view resources" ON public.course_resources
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.course_enrollments ce 
    WHERE ce.course_id = course_resources.course_id AND ce.student_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_resources.course_id AND c.instructor_id = auth.uid()
  ) OR
  user_has_role(auth.uid(), 'admin'::user_role)
);

CREATE POLICY "Instructors can manage resources" ON public.course_resources
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_resources.course_id AND c.instructor_id = auth.uid()
  ) OR
  user_has_role(auth.uid(), 'admin'::user_role)
);

-- RLS Policies for attendance_records
CREATE POLICY "Students can view their attendance" ON public.attendance_records
FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Instructors can manage attendance" ON public.attendance_records
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = attendance_records.course_id AND c.instructor_id = auth.uid()
  ) OR
  user_has_role(auth.uid(), 'admin'::user_role)
);

-- RLS Policies for student_profiles
CREATE POLICY "Users can view their student profile" ON public.student_profiles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their student profile" ON public.student_profiles
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins and teachers can view student profiles" ON public.student_profiles
FOR SELECT USING (
  user_has_role(auth.uid(), 'admin'::user_role) OR
  user_has_role(auth.uid(), 'teacher'::user_role)
);

CREATE POLICY "Admins can manage student profiles" ON public.student_profiles
FOR ALL USING (user_has_role(auth.uid(), 'admin'::user_role));

-- Add triggers for updated_at
CREATE TRIGGER update_course_groups_updated_at
  BEFORE UPDATE ON public.course_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_resources_updated_at
  BEFORE UPDATE ON public.course_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert mock student data
INSERT INTO public.profiles (id, email, first_name, last_name, role) VALUES
('11111111-1111-1111-1111-111111111111', 'john.doe@student.college.edu', 'John', 'Doe', 'student'),
('22222222-2222-2222-2222-222222222222', 'jane.smith@student.college.edu', 'Jane', 'Smith', 'student'),
('33333333-3333-3333-3333-333333333333', 'mike.johnson@student.college.edu', 'Mike', 'Johnson', 'student'),
('44444444-4444-4444-4444-444444444444', 'sarah.wilson@student.college.edu', 'Sarah', 'Wilson', 'student'),
('55555555-5555-5555-5555-555555555555', 'david.brown@student.college.edu', 'David', 'Brown', 'student'),
('66666666-6666-6666-6666-666666666666', 'lisa.davis@student.college.edu', 'Lisa', 'Davis', 'student'),
('77777777-7777-7777-7777-777777777777', 'alex.taylor@student.college.edu', 'Alex', 'Taylor', 'student'),
('88888888-8888-8888-8888-888888888888', 'emma.white@student.college.edu', 'Emma', 'White', 'student'),
('99999999-9999-9999-9999-999999999999', 'ryan.garcia@student.college.edu', 'Ryan', 'Garcia', 'student'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'maya.patel@student.college.edu', 'Maya', 'Patel', 'student')
ON CONFLICT (id) DO NOTHING;

-- Insert student profiles with roll numbers
INSERT INTO public.student_profiles (user_id, roll_number, admission_year, department, batch, semester) VALUES
('11111111-1111-1111-1111-111111111111', 'CS2023001', 2023, 'Computer Science', 'CS-A', 3),
('22222222-2222-2222-2222-222222222222', 'CS2023002', 2023, 'Computer Science', 'CS-A', 3),
('33333333-3333-3333-3333-333333333333', 'CS2023003', 2023, 'Computer Science', 'CS-B', 3),
('44444444-4444-4444-4444-444444444444', 'EE2023001', 2023, 'Electrical Engineering', 'EE-A', 3),
('55555555-5555-5555-5555-555555555555', 'EE2023002', 2023, 'Electrical Engineering', 'EE-A', 3),
('66666666-6666-6666-6666-666666666666', 'ME2023001', 2023, 'Mechanical Engineering', 'ME-A', 3),
('77777777-7777-7777-7777-777777777777', 'CS2022001', 2022, 'Computer Science', 'CS-A', 5),
('88888888-8888-8888-8888-888888888888', 'CS2022002', 2022, 'Computer Science', 'CS-B', 5),
('99999999-9999-9999-9999-999999999999', 'EE2022001', 2022, 'Electrical Engineering', 'EE-A', 5),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ME2022001', 2022, 'Mechanical Engineering', 'ME-A', 5)
ON CONFLICT (user_id) DO NOTHING;

-- Insert mock teacher
INSERT INTO public.profiles (id, email, first_name, last_name, role) VALUES
('teacher01-1111-1111-1111-111111111111', 'prof.kumar@faculty.college.edu', 'Dr. Rajesh', 'Kumar', 'teacher')
ON CONFLICT (id) DO NOTHING;

-- Insert mock courses
INSERT INTO public.courses (id, title, description, course_code, department, semester, academic_year, instructor_id, credits, max_students) VALUES
('course001-1111-1111-1111-111111111111', 'Data Structures and Algorithms', 'Comprehensive course on data structures and algorithmic problem solving', 'CS301', 'Computer Science', 'Fall 2024', '2024-25', 'teacher01-1111-1111-1111-111111111111', 4, 60),
('course002-2222-2222-2222-222222222222', 'Database Management Systems', 'Introduction to database design, SQL, and database administration', 'CS302', 'Computer Science', 'Fall 2024', '2024-25', 'teacher01-1111-1111-1111-111111111111', 3, 50),
('course003-3333-3333-3333-333333333333', 'Web Development', 'Full-stack web development using modern frameworks', 'CS401', 'Computer Science', 'Spring 2024', '2024-25', 'teacher01-1111-1111-1111-111111111111', 3, 40)
ON CONFLICT (id) DO NOTHING;

-- Insert course groups
INSERT INTO public.course_groups (id, course_id, name, description, group_type, max_members) VALUES
('group001-1111-1111-1111-111111111111', 'course001-1111-1111-1111-111111111111', 'CS301-A', 'Section A for Data Structures', 'section', 30),
('group002-2222-2222-2222-222222222222', 'course001-1111-1111-1111-111111111111', 'CS301-B', 'Section B for Data Structures', 'section', 30),
('group003-3333-3333-3333-333333333333', 'course002-2222-2222-2222-222222222222', 'CS302-A', 'Section A for DBMS', 'section', 25),
('group004-4444-4444-4444-444444444444', 'course003-3333-3333-3333-333333333333', 'CS401-A', 'Section A for Web Dev', 'section', 20)
ON CONFLICT (id) DO NOTHING;

-- Enroll students in courses
INSERT INTO public.course_enrollments (course_id, student_id) VALUES
('course001-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
('course001-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
('course001-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
('course001-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777'),
('course002-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
('course002-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222'),
('course003-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777'),
('course003-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888')
ON CONFLICT (course_id, student_id) DO NOTHING;

-- Add students to groups
INSERT INTO public.group_memberships (group_id, student_id, role) VALUES
('group001-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'student'),
('group001-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'student'),
('group002-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'student'),
('group002-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'student'),
('group003-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'student'),
('group003-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'student'),
('group004-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'student'),
('group004-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'student')
ON CONFLICT (group_id, student_id) DO NOTHING;

-- Insert sample course resources
INSERT INTO public.course_resources (course_id, group_id, uploaded_by, title, description, file_name, file_url, file_type, category) VALUES
('course001-1111-1111-1111-111111111111', NULL, 'teacher01-1111-1111-1111-111111111111', 'Introduction to Data Structures', 'Basic concepts and overview of data structures', 'DS_Intro.pdf', '/mock-files/ds-intro.pdf', 'application/pdf', 'study_material'),
('course001-1111-1111-1111-111111111111', NULL, 'teacher01-1111-1111-1111-111111111111', 'Arrays and Linked Lists', 'Detailed explanation of arrays and linked list implementations', 'Arrays_LinkedLists.pdf', '/mock-files/arrays-linkedlists.pdf', 'application/pdf', 'study_material'),
('course002-2222-2222-2222-222222222222', NULL, 'teacher01-1111-1111-1111-111111111111', 'SQL Basics', 'Introduction to SQL queries and database operations', 'SQL_Basics.pdf', '/mock-files/sql-basics.pdf', 'application/pdf', 'study_material'),
('course003-3333-3333-3333-333333333333', NULL, 'teacher01-1111-1111-1111-111111111111', 'React Fundamentals', 'Getting started with React framework', 'React_Fundamentals.pdf', '/mock-files/react-fundamentals.pdf', 'application/pdf', 'study_material')
ON CONFLICT DO NOTHING;