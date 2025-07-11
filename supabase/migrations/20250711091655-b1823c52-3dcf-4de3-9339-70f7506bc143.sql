-- Update user_role enum to match the matrix
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'student';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'teacher';

-- Drop existing RLS policies that use old role values
DROP POLICY IF EXISTS "Admin and CRM users can insert companies" ON companies;
DROP POLICY IF EXISTS "Admin and CRM users can update companies" ON companies;
DROP POLICY IF EXISTS "Admin and CRM users can view all companies" ON companies;
DROP POLICY IF EXISTS "Only admins can delete companies" ON companies;
DROP POLICY IF EXISTS "Admin and CRM users can view audit log" ON company_audit_log;
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;

-- Create comprehensive RLS policies for courses based on role matrix
CREATE POLICY "Students can view active courses" ON courses
FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers can manage their courses" ON courses
FOR ALL USING (instructor_id = auth.uid());

CREATE POLICY "Teachers can create courses" ON courses
FOR INSERT WITH CHECK (
  instructor_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

CREATE POLICY "Admins can manage all courses" ON courses
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Update profiles policies for role-based access
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create role-based policies for quizzes
DROP POLICY IF EXISTS "Students can view published quizzes" ON quizzes;
DROP POLICY IF EXISTS "Teachers can manage their quizzes" ON quizzes;

CREATE POLICY "Students can view published quizzes" ON quizzes
FOR SELECT USING (
  is_published = true AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'student')
);

CREATE POLICY "Teachers can manage their quizzes" ON quizzes
FOR ALL USING (
  creator_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

CREATE POLICY "Admins can manage all quizzes" ON quizzes
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create role-based policies for events
DROP POLICY IF EXISTS "Organizers can manage their events" ON events;
DROP POLICY IF EXISTS "Users can view events" ON events;

CREATE POLICY "Students can view course events" ON events
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    JOIN profiles p ON p.id = auth.uid()
    WHERE ce.course_id = events.course_id 
    AND ce.student_id = auth.uid()
    AND p.role = 'student'
  ) OR course_id IS NULL
);

CREATE POLICY "Teachers can manage their events" ON events
FOR ALL USING (
  organizer_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

CREATE POLICY "Teachers can view course events" ON events
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM courses c
    JOIN profiles p ON p.id = auth.uid()
    WHERE c.id = events.course_id 
    AND c.instructor_id = auth.uid()
    AND p.role = 'teacher'
  ) OR course_id IS NULL
);

CREATE POLICY "Admins can manage all events" ON events
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create function to check user role (avoiding RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.user_has_role(user_id uuid, required_role user_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = required_role
  );
$$;

-- Update notifications policies for role-based access
DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

CREATE POLICY "Users can view their notifications" ON notifications
FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Teachers can create course notifications" ON notifications
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses c
    JOIN profiles p ON p.id = auth.uid()
    WHERE c.id = notifications.course_id 
    AND c.instructor_id = auth.uid()
    AND p.role = 'teacher'
  )
);

CREATE POLICY "Admins can create all notifications" ON notifications
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Update video sessions policies for role-based access
DROP POLICY IF EXISTS "Instructors can manage their video sessions" ON video_sessions;
DROP POLICY IF EXISTS "Course members can view video sessions" ON video_sessions;

CREATE POLICY "Students can view course video sessions" ON video_sessions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    JOIN profiles p ON p.id = auth.uid()
    WHERE ce.course_id = video_sessions.course_id 
    AND ce.student_id = auth.uid()
    AND p.role = 'student'
  )
);

CREATE POLICY "Teachers can manage their video sessions" ON video_sessions
FOR ALL USING (
  instructor_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

CREATE POLICY "Admins can manage all video sessions" ON video_sessions
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create table for tracking user permissions and role assignments
CREATE TABLE IF NOT EXISTS user_role_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES profiles(id),
  previous_role user_role,
  new_role user_role NOT NULL,
  reason text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_role_assignments
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage role assignments" ON user_role_assignments
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Update handle_new_user function to implement email domain-based role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_email text;
  assigned_role user_role;
BEGIN
  user_email := NEW.email;
  
  -- Determine role based on email domain
  IF user_email LIKE '%@admin.%' OR user_email LIKE '%@admin.college.edu' THEN
    assigned_role := 'admin';
  ELSIF user_email LIKE '%@faculty.%' OR user_email LIKE '%@teacher.%' OR user_email LIKE '%@faculty.college.edu' THEN
    assigned_role := 'teacher';
  ELSIF user_email LIKE '%@student.%' OR user_email LIKE '%@student.college.edu' THEN
    assigned_role := 'student';
  ELSE
    -- Default to student for unrecognized domains
    assigned_role := 'student';
  END IF;

  -- Insert profile with auto-assigned role
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    assigned_role
  );
  
  -- Create user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  -- Log role assignment
  INSERT INTO public.user_role_assignments (user_id, new_role, reason)
  VALUES (NEW.id, assigned_role, 'Auto-assigned based on email domain');
  
  RETURN NEW;
END;
$$;