
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, ArrowLeft, Trash2, GripVertical } from 'lucide-react';
import QuestionEditor from './QuestionEditor';
import { useToast } from '@/hooks/use-toast';

const QuizBuilder = ({ quiz, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quiz_type: 'graded',
    time_limit: '',
    max_attempts: 1,
    randomize_questions: false,
    randomize_answers: false,
    show_results_immediately: true,
    passing_score: 70,
    is_published: false,
    course_id: ''
  });
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title || '',
        description: quiz.description || '',
        quiz_type: quiz.quiz_type || 'graded',
        time_limit: quiz.time_limit || '',
        max_attempts: quiz.max_attempts || 1,
        randomize_questions: quiz.randomize_questions || false,
        randomize_answers: quiz.randomize_answers || false,
        show_results_immediately: quiz.show_results_immediately || true,
        passing_score: quiz.passing_score || 70,
        is_published: quiz.is_published || false,
        course_id: quiz.course_id || ''
      });
      setQuestions(quiz.quiz_questions || []);
    }
  }, [quiz]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `temp_${Date.now()}`,
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      order_index: questions.length,
      explanation: '',
      question_options: []
    };
    setQuestions(prev => [...prev, newQuestion]);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId, updatedQuestion) => {
    setQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, ...updatedQuestion } : q)
    );
  };

  const deleteQuestion = (questionId) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const saveQuiz = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const quizData = {
        ...formData,
        creator_id: user.id,
        time_limit: formData.time_limit ? parseInt(formData.time_limit) : null,
        updated_at: new Date().toISOString()
      };

      let quizId = quiz?.id;

      if (quiz?.id) {
        // Update existing quiz
        const { error: quizError } = await supabase
          .from('quizzes')
          .update(quizData)
          .eq('id', quiz.id);

        if (quizError) throw quizError;
      } else {
        // Create new quiz
        const { data: newQuiz, error: quizError } = await supabase
          .from('quizzes')
          .insert([quizData])
          .select()
          .single();

        if (quizError) throw quizError;
        quizId = newQuiz.id;
      }

      // Save questions
      for (const question of questions) {
        const questionData = {
          quiz_id: quizId,
          question_type: question.question_type,
          question_text: question.question_text,
          points: question.points,
          order_index: question.order_index,
          explanation: question.explanation,
          media_url: question.media_url
        };

        let questionId = question.id;

        if (question.id.startsWith('temp_')) {
          // Create new question
          const { data: newQuestion, error: questionError } = await supabase
            .from('quiz_questions')
            .insert([questionData])
            .select()
            .single();

          if (questionError) throw questionError;
          questionId = newQuestion.id;
        } else {
          // Update existing question
          const { error: questionError } = await supabase
            .from('quiz_questions')
            .update(questionData)
            .eq('id', question.id);

          if (questionError) throw questionError;
        }

        // Save question options
        if (question.question_options && question.question_options.length > 0) {
          // Delete existing options
          await supabase
            .from('question_options')
            .delete()
            .eq('question_id', questionId);

          // Insert new options
          const optionsData = question.question_options.map((option, index) => ({
            question_id: questionId,
            option_text: option.option_text,
            option_image_url: option.option_image_url,
            is_correct: option.is_correct,
            order_index: index
          }));

          const { error: optionsError } = await supabase
            .from('question_options')
            .insert(optionsData);

          if (optionsError) throw optionsError;
        }
      }

      toast({
        title: "Success",
        description: "Quiz saved successfully"
      });

      onSave();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onSave}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">
              {quiz?.id ? 'Edit Quiz' : 'Create Quiz'}
            </h1>
          </div>
          <Button onClick={saveQuiz} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Quiz'}
          </Button>
        </div>

        {/* Quiz Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <Label htmlFor="quiz_type">Quiz Type</Label>
                <Select value={formData.quiz_type} onValueChange={(value) => handleInputChange('quiz_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="graded">Graded</SelectItem>
                    <SelectItem value="trivia">Trivia</SelectItem>
                    <SelectItem value="personality">Personality</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                    <SelectItem value="poll">Poll</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter quiz description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                <Input
                  id="time_limit"
                  type="number"
                  value={formData.time_limit}
                  onChange={(e) => handleInputChange('time_limit', e.target.value)}
                  placeholder="No limit"
                />
              </div>
              <div>
                <Label htmlFor="max_attempts">Max Attempts</Label>
                <Input
                  id="max_attempts"
                  type="number"
                  min="1"
                  value={formData.max_attempts}
                  onChange={(e) => handleInputChange('max_attempts', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="passing_score">Passing Score (%)</Label>
                <Input
                  id="passing_score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passing_score}
                  onChange={(e) => handleInputChange('passing_score', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="randomize_questions">Randomize Questions</Label>
                <Switch
                  id="randomize_questions"
                  checked={formData.randomize_questions}
                  onCheckedChange={(checked) => handleInputChange('randomize_questions', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="randomize_answers">Randomize Answers</Label>
                <Switch
                  id="randomize_answers"
                  checked={formData.randomize_answers}
                  onCheckedChange={(checked) => handleInputChange('randomize_answers', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show_results_immediately">Show Results Immediately</Label>
                <Switch
                  id="show_results_immediately"
                  checked={formData.show_results_immediately}
                  onCheckedChange={(checked) => handleInputChange('show_results_immediately', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">Published</Label>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Questions ({questions.length})</CardTitle>
              <Button onClick={addQuestion}>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No questions added yet. Click "Add Question" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    {editingQuestion === question.id ? (
                      <QuestionEditor
                        question={question}
                        onSave={(updatedQuestion) => {
                          updateQuestion(question.id, updatedQuestion);
                          setEditingQuestion(null);
                        }}
                        onCancel={() => setEditingQuestion(null)}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Question {index + 1}</span>
                            <Badge variant="outline">{question.question_type}</Badge>
                            <span className="text-sm text-gray-500">
                              {question.points} point{question.points !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-gray-700">{question.question_text || 'Untitled question'}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingQuestion(question.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizBuilder;
