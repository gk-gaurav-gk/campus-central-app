-- Update RLS policies for courses using role-based access
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view active courses" ON courses;
DROP POLICY IF EXISTS "Instructors can manage their courses" ON courses;

CREATE POLICY "Students can view active courses" ON courses
FOR SELECT USING (
  is_active = true AND public.user_has_role(auth.uid(), 'student')
);

CREATE POLICY "Teachers can view all courses" ON courses
FOR SELECT USING (
  public.user_has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Teachers can manage their courses" ON courses
FOR ALL USING (
  instructor_id = auth.uid() AND public.user_has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admins can manage all courses" ON courses
FOR ALL USING (
  public.user_has_role(auth.uid(), 'admin')
);

-- Update RLS policies for profiles
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
  public.user_has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE USING (
  public.user_has_role(auth.uid(), 'admin')
);

-- Update RLS policies for quizzes
DROP POLICY IF EXISTS "Students can view published quizzes" ON quizzes;
DROP POLICY IF EXISTS "Teachers can manage their quizzes" ON quizzes;

CREATE POLICY "Students can view published quizzes" ON quizzes
FOR SELECT USING (
  is_published = true AND public.user_has_role(auth.uid(), 'student')
);

CREATE POLICY "Teachers can manage their quizzes" ON quizzes
FOR ALL USING (
  creator_id = auth.uid() AND public.user_has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admins can manage all quizzes" ON quizzes
FOR ALL USING (
  public.user_has_role(auth.uid(), 'admin')
);