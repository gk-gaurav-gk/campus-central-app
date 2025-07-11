
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Users, Clock, Target } from 'lucide-react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const QuizAnalytics = ({ quiz, onBack }) => {
  const [analytics, setAnalytics] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [quiz.id]);

  const fetchAnalytics = async () => {
    try {
      // Fetch quiz attempts with detailed information
      const { data: attemptsData, error: attemptsError } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quiz_answers (
            *,
            quiz_questions (
              question_text,
              points
            )
          )
        `)
        .eq('quiz_id', quiz.id)
        .order('created_at', { ascending: false });

      if (attemptsError) throw attemptsError;

      // Fetch quiz analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('quiz_analytics')
        .select('*')
        .eq('quiz_id', quiz.id);

      if (analyticsError) throw analyticsError;

      setAttempts(attemptsData || []);
      setAnalytics(analyticsData?.[0] || null);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading analytics...</div>
      </div>
    );
  }

  const completedAttempts = attempts.filter(a => a.grading_status !== 'pending');
  const averageScore = completedAttempts.length > 0 
    ? completedAttempts.reduce((acc, attempt) => acc + (attempt.percentage_score || 0), 0) / completedAttempts.length
    : 0;

  const passedAttempts = completedAttempts.filter(a => (a.percentage_score || 0) >= (quiz.passing_score || 70));
  const passRate = completedAttempts.length > 0 ? (passedAttempts.length / completedAttempts.length) * 100 : 0;

  const averageTimeSpent = completedAttempts.length > 0
    ? completedAttempts.reduce((acc, attempt) => acc + (attempt.time_spent || 0), 0) / completedAttempts.length
    : 0;

  // Score distribution data
  const scoreDistribution = {
    labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
    datasets: [{
      data: [
        completedAttempts.filter(a => (a.percentage_score || 0) <= 20).length,
        completedAttempts.filter(a => (a.percentage_score || 0) > 20 && (a.percentage_score || 0) <= 40).length,
        completedAttempts.filter(a => (a.percentage_score || 0) > 40 && (a.percentage_score || 0) <= 60).length,
        completedAttempts.filter(a => (a.percentage_score || 0) > 60 && (a.percentage_score || 0) <= 80).length,
        completedAttempts.filter(a => (a.percentage_score || 0) > 80).length,
      ],
      backgroundColor: [
        '#ef4444',
        '#f97316',
        '#eab308',
        '#22c55e',
        '#10b981'
      ],
      borderWidth: 0
    }]
  };

  // Attempts over time
  const attemptsOverTime = {
    labels: attempts.slice(0, 10).reverse().map((_, index) => `Attempt ${index + 1}`),
    datasets: [{
      label: 'Score (%)',
      data: attempts.slice(0, 10).reverse().map(a => a.percentage_score || 0),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quiz
            </Button>
            <h1 className="text-3xl font-bold">Quiz Analytics</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold">{attempts.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold">{Math.round(averageScore)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold">{Math.round(passRate)}%</p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Time</p>
                  <p className="text-2xl font-bold">
                    {Math.round(averageTimeSpent / 60)}m
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Doughnut 
                  data={scoreDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Attempt Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line 
                  data={attemptsOverTime}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attempts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No attempts yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Student</th>
                      <th className="text-left py-2">Score</th>
                      <th className="text-left py-2">Time Spent</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.slice(0, 10).map((attempt) => (
                      <tr key={attempt.id} className="border-b">
                        <td className="py-3">
                          Student {attempt.student_id.slice(-6)}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {attempt.percentage_score ? `${Math.round(attempt.percentage_score)}%` : 'N/A'}
                            </span>
                            {attempt.percentage_score >= (quiz.passing_score || 70) && (
                              <Badge variant="default" className="text-xs">Passed</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          {attempt.time_spent ? `${Math.round(attempt.time_spent / 60)}m` : 'N/A'}
                        </td>
                        <td className="py-3">
                          <Badge variant={
                            attempt.grading_status === 'auto_graded' ? 'default' :
                            attempt.grading_status === 'manually_graded' ? 'secondary' :
                            'outline'
                          }>
                            {attempt.grading_status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 text-gray-600">
                          {new Date(attempt.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizAnalytics;
