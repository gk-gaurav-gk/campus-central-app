
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, BarChart3, Play, Edit, Eye } from 'lucide-react';

const QuizCard = ({ quiz, userRole }) => {
  const navigate = useNavigate();
  
  const questionCount = quiz.quiz_questions?.length || 0;
  const attemptCount = quiz.quiz_attempts?.length || 0;
  const averageScore = attemptCount > 0 
    ? Math.round(quiz.quiz_attempts.reduce((acc, attempt) => acc + (attempt.percentage_score || 0), 0) / attemptCount)
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
};

export default QuizCard;
