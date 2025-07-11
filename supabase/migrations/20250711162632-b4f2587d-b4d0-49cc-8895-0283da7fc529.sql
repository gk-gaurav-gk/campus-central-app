-- Update existing viewer role to student role
UPDATE profiles 
SET role = 'student'::user_role 
WHERE role = 'viewer'::user_role;