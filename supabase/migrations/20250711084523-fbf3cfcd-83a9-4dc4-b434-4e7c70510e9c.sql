-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  course_code TEXT UNIQUE,
  instructor_id UUID REFERENCES public.profiles(id),
  department TEXT,
  credits INTEGER DEFAULT 3,
  semester TEXT,
  academic_year TEXT,
  max_students INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_enrollments table
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed')),
  grade TEXT,
  UNIQUE(course_id, student_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'push', 'system')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  priority INTEGER DEFAULT 2 CHECK (priority >= 1 AND priority <= 5),
  course_id UUID REFERENCES public.courses(id),
  metadata JSONB,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id),
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT[] DEFAULT ARRAY['all'], -- 'all', 'students', 'teachers', 'specific_course'
  is_pinned BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  publish_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expire_at TIMESTAMP WITH TIME ZONE,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('class', 'exam', 'assignment_due', 'meeting', 'other')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  meeting_url TEXT,
  max_attendees INTEGER,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forums table
CREATE TABLE public.forums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum_posts table
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  forum_id UUID NOT NULL REFERENCES public.forums(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.forum_posts(id), -- For replies
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT,
  content TEXT NOT NULL,
  attachments JSONB,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_groups table
CREATE TABLE public.chat_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id),
  name TEXT NOT NULL,
  description TEXT,
  group_type TEXT NOT NULL CHECK (group_type IN ('course', 'study_group', 'project', 'private')),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  is_private BOOLEAN DEFAULT false,
  max_members INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.chat_groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'location')),
  attachments JSONB,
  reply_to UUID REFERENCES public.chat_messages(id),
  mentions UUID[],
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video_sessions table
CREATE TABLE public.video_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  meeting_url TEXT,
  meeting_id TEXT,
  passcode TEXT,
  is_recorded BOOLEAN DEFAULT false,
  recording_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  max_participants INTEGER DEFAULT 100,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video_attendance table
CREATE TABLE public.video_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.video_sessions(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.profiles(id),
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  is_present BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, participant_id)
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_attendance ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for courses
CREATE POLICY "Anyone can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Instructors can manage their courses" ON public.courses
  FOR ALL USING (instructor_id = auth.uid());

CREATE POLICY "Admins can manage all courses" ON public.courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS Policies for course_enrollments
CREATE POLICY "Students can view their enrollments" ON public.course_enrollments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Instructors can view enrollments for their courses" ON public.course_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = course_enrollments.course_id AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can enroll in courses" ON public.course_enrollments
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Create RLS Policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS Policies for announcements
CREATE POLICY "Users can view published announcements" ON public.announcements
  FOR SELECT USING (is_published = true AND publish_at <= now());

CREATE POLICY "Authors can manage their announcements" ON public.announcements
  FOR ALL USING (author_id = auth.uid());

-- Create RLS Policies for events
CREATE POLICY "Users can view events" ON public.events
  FOR SELECT USING (
    course_id IS NULL OR 
    EXISTS (
      SELECT 1 FROM public.course_enrollments 
      WHERE course_id = events.course_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = events.course_id AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can manage their events" ON public.events
  FOR ALL USING (organizer_id = auth.uid());

-- Create RLS Policies for forums
CREATE POLICY "Course members can view forums" ON public.forums
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments 
      WHERE course_id = forums.course_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = forums.course_id AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can manage course forums" ON public.forums
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = forums.course_id AND instructor_id = auth.uid()
    )
  );

-- Create RLS Policies for forum_posts
CREATE POLICY "Course members can view posts" ON public.forum_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.forums f
      JOIN public.course_enrollments ce ON f.course_id = ce.course_id
      WHERE f.id = forum_posts.forum_id AND ce.student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.forums f
      JOIN public.courses c ON f.course_id = c.id
      WHERE f.id = forum_posts.forum_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Course members can create posts" ON public.forum_posts
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their posts" ON public.forum_posts
  FOR UPDATE USING (author_id = auth.uid());

-- Create RLS Policies for chat_groups
CREATE POLICY "Course members can view course chat groups" ON public.chat_groups
  FOR SELECT USING (
    course_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.course_enrollments 
      WHERE course_id = chat_groups.course_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = chat_groups.course_id AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat groups" ON public.chat_groups
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Create RLS Policies for chat_messages
CREATE POLICY "Group members can view messages" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_groups 
      WHERE id = chat_messages.group_id
    )
  );

CREATE POLICY "Users can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Create RLS Policies for video_sessions
CREATE POLICY "Course members can view video sessions" ON public.video_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments 
      WHERE course_id = video_sessions.course_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE id = video_sessions.course_id AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can manage their video sessions" ON public.video_sessions
  FOR ALL USING (instructor_id = auth.uid());

-- Create RLS Policies for video_attendance
CREATE POLICY "Participants can view their attendance" ON public.video_attendance
  FOR SELECT USING (participant_id = auth.uid());

CREATE POLICY "System can track attendance" ON public.video_attendance
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_course_enrollments_student ON public.course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON public.course_enrollments(course_id);
CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX idx_announcements_course ON public.announcements(course_id);
CREATE INDEX idx_events_course ON public.events(course_id);
CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_forums_course ON public.forums(course_id);
CREATE INDEX idx_forum_posts_forum ON public.forum_posts(forum_id);
CREATE INDEX idx_forum_posts_parent ON public.forum_posts(parent_id);
CREATE INDEX idx_chat_messages_group ON public.chat_messages(group_id);
CREATE INDEX idx_video_sessions_course ON public.video_sessions(course_id);
CREATE INDEX idx_video_attendance_session ON public.video_attendance(session_id);

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forums_updated_at
  BEFORE UPDATE ON public.forums
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_groups_updated_at
  BEFORE UPDATE ON public.chat_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_sessions_updated_at
  BEFORE UPDATE ON public.video_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();