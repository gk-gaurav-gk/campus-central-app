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

-- Test if the current user has admin role
SELECT 
  auth.uid() as user_id,
  p.role,
  p.email,
  CASE 
    WHEN p.role = 'admin' THEN 'User has admin role'
    ELSE 'User does NOT have admin role'
  END as admin_status
FROM profiles p 
WHERE p.id = auth.uid();