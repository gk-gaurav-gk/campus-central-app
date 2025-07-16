-- Fix the RLS policies - the issue is likely that the admin policy isn't working
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
DROP POLICY IF EXISTS "Admins can insert courses" ON courses;

-- Create a simpler admin policy that works for all operations
CREATE POLICY "Admins can manage all courses" ON courses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Also add WITH CHECK for INSERT operations specifically
CREATE POLICY "Admins can insert courses" ON courses
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Update user roles for testing
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'gaurav.gk0045@gmail.com';

UPDATE profiles 
SET role = 'teacher' 
WHERE email = 'teacher.demo@gmail.com';

-- Verify the updates
SELECT email, role FROM profiles WHERE email IN ('gaurav.gk0045@gmail.com', 'teacher.demo@gmail.com');