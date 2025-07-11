
-- Create enum types for quiz and question types
CREATE TYPE quiz_type AS ENUM ('trivia', 'personality', 'graded', 'survey', 'poll');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'written_answer', 'audio_button', 'fill_blank', 'open_ended', 'multi_factor', 'ranking', 'picture_choice');
CREATE TYPE grading_status AS ENUM ('pending', 'auto_graded', 'manually_graded', 'needs_review');

-- Quiz table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  quiz_type quiz_type NOT NULL DEFAULT 'graded',
  creator_id UUID REFERENCES auth.users(id),
  course_id TEXT,
  time_limit INTEGER, -- in minutes
  max_attempts INTEGER DEFAULT 1,
  randomize_questions BOOLEAN DEFAULT false,
  randomize_answers BOOLEAN DEFAULT false,
  show_results_immediately BOOLEAN DEFAULT true,
  passing_score INTEGER DEFAULT 70,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Questions table
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_type question_type NOT NULL,
  question_text TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  media_url TEXT,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Answer options for multiple choice, picture choice, etc.
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT,
  option_image_url TEXT,
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quiz attempts/submissions
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id),
  student_id UUID NOT NULL REFERENCES auth.users(id),
  attempt_number INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER, -- in seconds
  total_score NUMERIC(5,2),
  max_possible_score INTEGER,
  percentage_score NUMERIC(5,2),
  grading_status grading_status DEFAULT 'pending',
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMP WITH TIME ZONE,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(quiz_id, student_id, attempt_number)
);

-- Student answers for each question
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id),
  selected_options UUID[], -- for multiple choice
  text_answer TEXT, -- for written/open-ended
  audio_url TEXT, -- for audio responses
  ranking_order INTEGER[], -- for ranking questions
  points_earned NUMERIC(5,2) DEFAULT 0,
  is_correct BOOLEAN,
  manual_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quiz analytics and performance tracking
CREATE TABLE quiz_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id),
  question_id UUID REFERENCES quiz_questions(id),
  total_attempts INTEGER DEFAULT 0,
  average_score NUMERIC(5,2),
  difficulty_rating NUMERIC(3,2), -- calculated based on success rate
  common_wrong_answers JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
CREATE POLICY "Teachers can manage their quizzes" ON quizzes
  FOR ALL USING (creator_id = auth.uid());

CREATE POLICY "Students can view published quizzes" ON quizzes
  FOR SELECT USING (is_published = true);

-- RLS Policies for quiz_questions
CREATE POLICY "Teachers can manage questions for their quizzes" ON quiz_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE id = quiz_questions.quiz_id 
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Students can view questions for published quizzes" ON quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE id = quiz_questions.quiz_id 
      AND is_published = true
    )
  );

-- RLS Policies for question_options
CREATE POLICY "Teachers can manage options for their questions" ON question_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quiz_questions q
      JOIN quizzes qz ON q.quiz_id = qz.id
      WHERE q.id = question_options.question_id 
      AND qz.creator_id = auth.uid()
    )
  );

CREATE POLICY "Students can view options for published quiz questions" ON question_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quiz_questions q
      JOIN quizzes qz ON q.quiz_id = qz.id
      WHERE q.id = question_options.question_id 
      AND qz.is_published = true
    )
  );

-- RLS Policies for quiz_attempts
CREATE POLICY "Students can manage their own attempts" ON quiz_attempts
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Teachers can view attempts for their quizzes" ON quiz_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE id = quiz_attempts.quiz_id 
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update grading for their quizzes" ON quiz_attempts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE id = quiz_attempts.quiz_id 
      AND creator_id = auth.uid()
    )
  );

-- RLS Policies for quiz_answers
CREATE POLICY "Students can manage their own answers" ON quiz_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts 
      WHERE id = quiz_answers.attempt_id 
      AND student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view answers for their quizzes" ON quiz_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.id = quiz_answers.attempt_id 
      AND q.creator_id = auth.uid()
    )
  );

-- RLS Policies for quiz_analytics
CREATE POLICY "Teachers can view analytics for their quizzes" ON quiz_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE id = quiz_analytics.quiz_id 
      AND creator_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_quizzes_creator_id ON quizzes(creator_id);
CREATE INDEX idx_quizzes_course_id ON quizzes(course_id);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_question_options_question_id ON question_options(question_id);
CREATE INDEX idx_quiz_attempts_quiz_student ON quiz_attempts(quiz_id, student_id);
CREATE INDEX idx_quiz_answers_attempt_id ON quiz_answers(attempt_id);
CREATE INDEX idx_quiz_analytics_quiz_id ON quiz_analytics(quiz_id);

-- Function to auto-grade multiple choice questions
CREATE OR REPLACE FUNCTION auto_grade_quiz_attempt(attempt_id_param UUID)
RETURNS VOID AS $$
DECLARE
    answer_record RECORD;
    total_score NUMERIC(5,2) := 0;
    max_score INTEGER := 0;
BEGIN
    -- Process each answer in the attempt
    FOR answer_record IN 
        SELECT qa.id, qa.question_id, qa.selected_options, 
               q.points, q.question_type
        FROM quiz_answers qa
        JOIN quiz_questions q ON qa.question_id = q.id
        WHERE qa.attempt_id = attempt_id_param
    LOOP
        max_score := max_score + answer_record.points;
        
        -- Auto-grade multiple choice questions
        IF answer_record.question_type = 'multiple_choice' THEN
            -- Check if selected options match correct options
            IF EXISTS (
                SELECT 1 FROM question_options
                WHERE question_id = answer_record.question_id
                AND id = ANY(answer_record.selected_options)
                AND is_correct = true
            ) AND NOT EXISTS (
                SELECT 1 FROM question_options
                WHERE question_id = answer_record.question_id
                AND id = ANY(answer_record.selected_options)
                AND is_correct = false
            ) THEN
                -- All selected options are correct
                UPDATE quiz_answers 
                SET points_earned = answer_record.points, is_correct = true
                WHERE id = answer_record.id;
                total_score := total_score + answer_record.points;
            ELSE
                UPDATE quiz_answers 
                SET points_earned = 0, is_correct = false
                WHERE id = answer_record.id;
            END IF;
        END IF;
    END LOOP;
    
    -- Update the quiz attempt with the total score
    UPDATE quiz_attempts 
    SET total_score = total_score,
        max_possible_score = max_score,
        percentage_score = (total_score / max_score) * 100,
        grading_status = 'auto_graded',
        submitted_at = COALESCE(submitted_at, now())
    WHERE id = attempt_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update quiz analytics
CREATE OR REPLACE FUNCTION update_quiz_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update quiz-level analytics
    INSERT INTO quiz_analytics (quiz_id, total_attempts, average_score)
    SELECT 
        NEW.quiz_id,
        COUNT(*),
        AVG(percentage_score)
    FROM quiz_attempts 
    WHERE quiz_id = NEW.quiz_id 
    AND grading_status IN ('auto_graded', 'manually_graded')
    ON CONFLICT (quiz_id) WHERE question_id IS NULL
    DO UPDATE SET
        total_attempts = EXCLUDED.total_attempts,
        average_score = EXCLUDED.average_score,
        updated_at = now();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_quiz_analytics
    AFTER UPDATE ON quiz_attempts
    FOR EACH ROW
    WHEN (NEW.grading_status IN ('auto_graded', 'manually_graded'))
    EXECUTE FUNCTION update_quiz_analytics();
