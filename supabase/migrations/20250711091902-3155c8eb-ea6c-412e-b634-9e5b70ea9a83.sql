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
  
  RETURN NEW;
END;
$$;

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
  public.user_has_role(auth.uid(), 'admin')
);