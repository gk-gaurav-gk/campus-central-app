
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, BarChart3, Play, Edit, Trash2 } from 'lucide-react';
import QuizBuilder from '@/components/quiz/QuizBuilder';
import QuizTaker from '@/components/quiz/QuizTaker';
import QuizAnalytics from '@/components/quiz/QuizAnalytics';
import { useToast } from '@/hooks/use-toast';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('view'); // view, edit, take, analytics
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    fetchQuiz();
    getUserRole();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions (
            *,
            question_options (*)
          ),
          quiz_attempts (
            id,
            student_id,
            percentage_score,
            grading_status,
            created_at
          )
        `)
        .eq('id', quizId)
        .single();

      if (error) throw error;
      setQuiz(data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz",
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

  const deleteQuiz = async () => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        const { error } = await supabase
          .from('quizzes')
          .delete()
          .eq('id', quizId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Quiz deleted successfully"
        });
        navigate('/quizzes');
      } catch (error) {
        console.error('Error deleting quiz:', error);
        toast({
          title: "Error",
          description: "Failed to delete quiz",
          variant: "destructive"
        });
      }
    }
  };

  const togglePublish = async () => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ is_published: !quiz.is_published })
        .eq('id', quizId);

      if (error) throw error;
      
      setQuiz(prev => ({ ...prev, is_published: !prev.is_published }));
      toast({
        title: "Success",
        description: `Quiz ${quiz.is_published ? 'unpublished' : 'published'} successfully`
      });
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to update quiz",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Quiz not found</div>
      </div>
    );
  }

  if (mode === 'edit') {
    return <QuizBuilder quiz={quiz} onSave={() => setMode('view')} />;
  }

  if (mode === 'take') {
    return <QuizTaker quiz={quiz} onComplete={() => setMode('view')} />;
  }

  if (mode === 'analytics') {
    return <QuizAnalytics quiz={quiz} onBack={() => setMode('view')} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant={quiz.is_published ? "default" : "secondary"}>
                {quiz.is_published ? "Published" : "Draft"}
              </Badge>
              <Badge variant="outline">{quiz.quiz_type}</Badge>
              {quiz.time_limit && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {quiz.time_limit} minutes
                </div>
              )}
            </div>
          </div>
          
          {userRole === 'admin' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMode('edit')}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={togglePublish}
              >
                {quiz.is_published ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                variant="destructive"
                onClick={deleteQuiz}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Quiz Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="text-2xl font-bold">{quiz.quiz_questions?.length || 0}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attempts</p>
                  <p className="text-2xl font-bold">{quiz.quiz_attempts?.length || 0}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold">
                    {quiz.quiz_attempts?.length > 0 
                      ? Math.round(quiz.quiz_attempts.reduce((acc, attempt) => acc + (attempt.percentage_score || 0), 0) / quiz.quiz_attempts.length)
                      : 0}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          {quiz.is_published && (
            <Button
              onClick={() => setMode('take')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Take Quiz
            </Button>
          )}
          
          {userRole === 'admin' && quiz.quiz_attempts?.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setMode('analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          )}
        </div>

        {/* Quiz Questions Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Questions Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {quiz.quiz_questions?.length > 0 ? (
              <div className="space-y-4">
                {quiz.quiz_questions.map((question, index) => (
                  <div key={question.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {index + 1}. {question.question_text}
                      </h4>
                      <Badge variant="outline">{question.question_type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {question.points} point{question.points !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No questions added yet. Edit the quiz to add questions.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Attempts */}
        {quiz.quiz_attempts?.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quiz.quiz_attempts.slice(0, 5).map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Student ID: {attempt.student_id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(attempt.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {attempt.percentage_score ? `${Math.round(attempt.percentage_score)}%` : 'N/A'}
                      </p>
                      <Badge variant={
                        attempt.grading_status === 'auto_graded' ? 'default' :
                        attempt.grading_status === 'manually_graded' ? 'secondary' :
                        'outline'
                      }>
                        {attempt.grading_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
