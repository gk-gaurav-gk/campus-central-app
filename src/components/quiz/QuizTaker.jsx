
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuizTaker = ({ quiz, onComplete }) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [startTime] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let shuffledQuestions = [...(quiz.quiz_questions || [])];
    
    if (quiz.randomize_questions) {
      shuffledQuestions = shuffledQuestions.sort(() => Math.random() - 0.5);
    }

    if (quiz.randomize_answers) {
      shuffledQuestions = shuffledQuestions.map(question => ({
        ...question,
        question_options: question.question_options?.sort(() => Math.random() - 0.5) || []
      }));
    }

    setQuestions(shuffledQuestions);

    if (quiz.time_limit) {
      setTimeRemaining(quiz.time_limit * 60); // Convert minutes to seconds
    }
  }, [quiz]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const endTime = new Date();
      const timeSpent = Math.floor((endTime - startTime) / 1000);

      // Create quiz attempt
      const { data: attempt, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert([{
          quiz_id: quiz.id,
          student_id: user.id,
          started_at: startTime.toISOString(),
          submitted_at: endTime.toISOString(),
          time_spent: timeSpent,
          grading_status: 'pending'
        }])
        .select()
        .single();

      if (attemptError) throw attemptError;

      // Save answers
      const answerData = Object.entries(answers).map(([questionId, answer]) => {
        const question = questions.find(q => q.id === questionId);
        
        let answerObject = {
          attempt_id: attempt.id,
          question_id: questionId
        };

        if (question?.question_type === 'multiple_choice') {
          answerObject.selected_options = Array.isArray(answer) ? answer : [answer];
        } else if (question?.question_type === 'ranking') {
          answerObject.ranking_order = answer;
        } else {
          answerObject.text_answer = answer;
        }

        return answerObject;
      });

      const { error: answersError } = await supabase
        .from('quiz_answers')
        .insert(answerData);

      if (answersError) throw answersError;

      // Auto-grade if possible
      const { error: gradeError } = await supabase.rpc('auto_grade_quiz_attempt', {
        attempt_id_param: attempt.id
      });

      if (gradeError) console.error('Auto-grading error:', gradeError);

      toast({
        title: "Quiz Submitted!",
        description: "Your quiz has been submitted successfully."
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading quiz...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onComplete}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
          </div>
          
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              <span className={timeRemaining < 300 ? 'text-red-500' : 'text-gray-700'}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion.question_text}
            </CardTitle>
            {currentQuestion.media_url && (
              <div className="mt-4">
                <img 
                  src={currentQuestion.media_url} 
                  alt="Question media"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <QuestionRenderer
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={submitQuiz}
                disabled={submitting}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionRenderer = ({ question, answer, onAnswerChange }) => {
  switch (question.question_type) {
    case 'multiple_choice':
      return (
        <RadioGroup value={answer} onValueChange={onAnswerChange}>
          {question.question_options?.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                {option.option_text}
                {option.option_image_url && (
                  <img 
                    src={option.option_image_url} 
                    alt="Option"
                    className="mt-2 max-w-xs h-auto rounded"
                  />
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case 'written_answer':
    case 'fill_blank':
      return (
        <Input
          value={answer || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Enter your answer..."
        />
      );

    case 'open_ended':
      return (
        <Textarea
          value={answer || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Enter your answer..."
          rows={4}
        />
      );

    case 'ranking':
      return (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-3">
            Drag and drop or use the inputs to rank these options:
          </p>
          {question.question_options?.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3 p-2 border rounded">
              <Input
                type="number"
                min="1"
                max={question.question_options.length}
                value={answer?.[index] || ''}
                onChange={(e) => {
                  const newRanking = [...(answer || [])];
                  newRanking[index] = parseInt(e.target.value);
                  onAnswerChange(newRanking);
                }}
                className="w-20"
              />
              <span>{option.option_text}</span>
            </div>
          ))}
        </div>
      );

    default:
      return <div>Question type not supported yet</div>;
  }
};

export default QuizTaker;
