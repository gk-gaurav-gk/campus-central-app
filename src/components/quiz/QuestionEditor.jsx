
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, X } from 'lucide-react';

const QuestionEditor = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    points: 1,
    explanation: '',
    media_url: ''
  });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (question) {
      setFormData({
        question_text: question.question_text || '',
        question_type: question.question_type || 'multiple_choice',
        points: question.points || 1,
        explanation: question.explanation || '',
        media_url: question.media_url || ''
      });
      setOptions(question.question_options || []);
    }
  }, [question]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addOption = () => {
    const newOption = {
      id: `temp_${Date.now()}`,
      option_text: '',
      option_image_url: '',
      is_correct: false,
      order_index: options.length
    };
    setOptions(prev => [...prev, newOption]);
  };

  const updateOption = (optionId, field, value) => {
    setOptions(prev =>
      prev.map(option =>
        option.id === optionId ? { ...option, [field]: value } : option
      )
    );
  };

  const deleteOption = (optionId) => {
    setOptions(prev => prev.filter(option => option.id !== optionId));
  };

  const handleSave = () => {
    const updatedQuestion = {
      ...formData,
      question_options: options
    };
    onSave(updatedQuestion);
  };

  const needsOptions = ['multiple_choice', 'picture_choice', 'ranking'].includes(formData.question_type);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Question Type */}
        <div>
          <Label htmlFor="question_type">Question Type</Label>
          <Select value={formData.question_type} onValueChange={(value) => handleInputChange('question_type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem value="written_answer">Written Answer</SelectItem>
              <SelectItem value="audio_button">Audio Button</SelectItem>
              <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
              <SelectItem value="open_ended">Open Ended</SelectItem>
              <SelectItem value="multi_factor">Multi-Factor</SelectItem>
              <SelectItem value="ranking">Ranking</SelectItem>
              <SelectItem value="picture_choice">Picture Choice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question Text */}
        <div>
          <Label htmlFor="question_text">Question Text *</Label>
          <Textarea
            id="question_text"
            value={formData.question_text}
            onChange={(e) => handleInputChange('question_text', e.target.value)}
            placeholder="Enter your question here..."
            rows={3}
          />
        </div>

        {/* Points and Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              min="1"
              value={formData.points}
              onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="media_url">Media URL (optional)</Label>
            <Input
              id="media_url"
              value={formData.media_url}
              onChange={(e) => handleInputChange('media_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Explanation */}
        <div>
          <Label htmlFor="explanation">Explanation (optional)</Label>
          <Textarea
            id="explanation"
            value={formData.explanation}
            onChange={(e) => handleInputChange('explanation', e.target.value)}
            placeholder="Explain the correct answer..."
            rows={2}
          />
        </div>

        {/* Answer Options */}
        {needsOptions && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Answer Options</Label>
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
            
            {options.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No options added yet. Click "Add Option" to create answer choices.
              </p>
            ) : (
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <span className="text-sm font-medium min-w-[20px]">{index + 1}.</span>
                    
                    <div className="flex-1">
                      <Input
                        value={option.option_text}
                        onChange={(e) => updateOption(option.id, 'option_text', e.target.value)}
                        placeholder="Enter option text"
                      />
                    </div>

                    {formData.question_type === 'picture_choice' && (
                      <div className="flex-1">
                        <Input
                          value={option.option_image_url}
                          onChange={(e) => updateOption(option.id, 'option_image_url', e.target.value)}
                          placeholder="Image URL"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Label htmlFor={`correct_${option.id}`} className="text-sm">
                        Correct
                      </Label>
                      <Switch
                        id={`correct_${option.id}`}
                        checked={option.is_correct}
                        onCheckedChange={(checked) => updateOption(option.id, 'is_correct', checked)}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteOption(option.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Question
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionEditor;
