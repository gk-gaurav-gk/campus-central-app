
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const QuizListHeader = ({ userRole, onCreateQuiz }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Quizzes</h1>
      {userRole === 'admin' && (
        <Button onClick={onCreateQuiz} className="bg-gradient-to-r from-blue-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      )}
    </div>
  );
};

export default QuizListHeader;
