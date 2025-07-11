
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle, FileText, Target, Calendar } from 'lucide-react';

const AssignmentStats = ({ assignments }) => {
  const stats = assignments.reduce((acc, assignment) => {
    acc.total += 1;
    acc.totalPoints += assignment.points;
    
    switch (assignment.status) {
      case 'submitted':
        acc.completed += 1;
        if (assignment.grade) acc.earnedPoints += (assignment.grade / 100) * assignment.points;
        break;
      case 'pending':
        acc.pending += 1;
        break;
      case 'overdue':
        acc.overdue += 1;
        break;
      case 'draft':
        acc.draft += 1;
        break;
    }
    
    return acc;
  }, {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    draft: 0,
    totalPoints: 0,
    earnedPoints: 0
  });

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const averageGrade = stats.completed > 0 ? Math.round(stats.earnedPoints / stats.completed) : 0;

  const statCards = [
    {
      title: 'Total Assignments',
      value: stats.total,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Average Grade',
      value: `${averageGrade}%`,
      icon: Calendar,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="glass-card hover-lift group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold font-comfortaa mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AssignmentStats;
