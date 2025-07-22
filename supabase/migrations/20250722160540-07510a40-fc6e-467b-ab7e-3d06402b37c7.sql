-- Insert mock instructor profiles with proper UUIDs
-- First check if any teachers exist, if not insert mock data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'teacher') THEN
    INSERT INTO profiles (id, email, first_name, last_name, role) VALUES
    (gen_random_uuid(), 'john.smith@faculty.college.edu', 'John', 'Smith', 'teacher'),
    (gen_random_uuid(), 'sarah.johnson@faculty.college.edu', 'Sarah', 'Johnson', 'teacher'),
    (gen_random_uuid(), 'michael.brown@faculty.college.edu', 'Michael', 'Brown', 'teacher'),
    (gen_random_uuid(), 'emily.davis@faculty.college.edu', 'Emily', 'Davis', 'teacher'),
    (gen_random_uuid(), 'david.wilson@faculty.college.edu', 'David', 'Wilson', 'teacher'),
    (gen_random_uuid(), 'lisa.anderson@faculty.college.edu', 'Lisa', 'Anderson', 'teacher'),
    (gen_random_uuid(), 'robert.taylor@faculty.college.edu', 'Robert', 'Taylor', 'teacher'),
    (gen_random_uuid(), 'jennifer.martinez@faculty.college.edu', 'Jennifer', 'Martinez', 'teacher');
  END IF;
END $$;