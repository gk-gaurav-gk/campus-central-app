-- Create demo user profiles with proper roles
-- These profiles will be created when the demo users sign up

-- Insert demo profiles with correct roles
INSERT INTO public.profiles (id, email, first_name, last_name, role) VALUES
  -- Generate consistent UUIDs for demo accounts
  ('11111111-1111-1111-1111-111111111111', 'student.demo@gmail.com', 'John', 'Student', 'student'),
  ('22222222-2222-2222-2222-222222222222', 'teacher.demo@gmail.com', 'Sarah', 'Professor', 'teacher'),
  ('33333333-3333-3333-3333-333333333333', 'admin.demo@gmail.com', 'Admin', 'User', 'admin')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role;

-- Create user settings for demo accounts
INSERT INTO public.user_settings (user_id) VALUES
  ('11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-333333333333')
ON CONFLICT (user_id) DO NOTHING;