
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Clock, Users, BarChart3, Play, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Quizzes</h1>
          {userRole === 'admin' && (
            <Button onClick={createNewQuiz} className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quiz Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {searchTerm ? 'No quizzes found matching your search.' : 'No quizzes available.'}
            </p>
            {userRole === 'admin' && !searchTerm && (
              <Button onClick={createNewQuiz}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Quiz
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => {
              const questionCount = quiz.quiz_questions?.length || 0;
              const attemptCount = quiz.quiz_attempts?.length || 0;
              const averageScore = attemptCount > 0 
                ? Math.round(quiz.quiz_attempts.reduce((acc, attempt) => acc + (attempt.percentage_score || 0), 0) / attemptCount)
                : 0;

              return (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{quiz.title}</CardTitle>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {quiz.description || 'No description available'}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant={quiz.is_published ? "default" : "secondary"}>
                          {quiz.is_published ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline">{quiz.quiz_type}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Quiz Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        {questionCount} questions
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {attemptCount} attempts
                      </div>
                      {quiz.time_limit && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {quiz.time_limit}m
                        </div>
                      )}
                    </div>

                    {/* Average Score */}
                    {attemptCount > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Average Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${averageScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{averageScore}%</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {quiz.is_published ? (
                        <Button
                          onClick={() => navigate(`/quiz/${quiz.id}`)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Take Quiz
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/quiz/${quiz.id}`)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      )}
                      
                      {userRole === 'admin' && (
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/quiz/${quiz.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListPage;
