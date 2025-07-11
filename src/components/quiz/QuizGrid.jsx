
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import QuizCard from './QuizCard';

const QuizGrid = ({ quizzes, userRole, searchTerm, onCreateQuiz }) => {
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">
          {searchTerm ? 'No quizzes found matching your search.' : 'No quizzes available.'}
        </p>
        {userRole === 'admin' && !searchTerm && (
          <Button onClick={onCreateQuiz}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Quiz
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} userRole={userRole} />
      ))}
    </div>
  );
};

export default QuizGrid;
