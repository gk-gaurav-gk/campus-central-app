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