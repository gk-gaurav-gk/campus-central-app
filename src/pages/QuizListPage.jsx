
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QuizListHeader from '@/components/quiz/QuizListHeader';
import QuizFilters from '@/components/quiz/QuizFilters';
import QuizGrid from '@/components/quiz/QuizGrid';

const QuizListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    fetchQuizzes();
    getUserRole();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [searchTerm, quizzes]);

  const fetchQuizzes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions (id),
          quiz_attempts (
            id,
            student_id,
            percentage_score,
            grading_status
          )
        `)
        .order('created_at', { ascending: false });

      // If user is not admin, only show published quizzes
      if (!user) {
        query = query.eq('is_published', true);
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin') {
          query = query.eq('is_published', true);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: "Error",
        description: "Failed to load quizzes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      setUserRole(profile?.role || 'student');
    }
  };

  const filterQuizzes = () => {
    if (!searchTerm) {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    }
  };

  const createNewQuiz = () => {
    navigate('/quiz/new');
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <QuizListHeader userRole={userRole} onCreateQuiz={createNewQuiz} />
        <QuizFilters searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        <QuizGrid 
          quizzes={filteredQuizzes} 
          userRole={userRole} 
          searchTerm={searchTerm}
          onCreateQuiz={createNewQuiz}
        />
      </div>
    </div>
  );
};

export default QuizListPage;
