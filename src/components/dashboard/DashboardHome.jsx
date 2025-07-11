import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Clock,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Users,
  Bell,
  ArrowRight,
  Target
} from 'lucide-react';

const DashboardHome = ({ user }) => {
  const attendancePercentage = 85;
  const completedAssignments = 12;
  const totalAssignments = 15;
  const virtualCurrency = 1250;

  const stats = [
    {
      title: 'Attendance',
      value: `${attendancePercentage}%`,
      description: 'This semester',
      icon: CheckCircle,
      progress: attendancePercentage,
      color: attendancePercentage >= 75 ? 'text-secondary' : 'text-destructive'
    },
    {
      title: 'Assignments',
      value: `${completedAssignments}/${totalAssignments}`,
      description: 'Completed',
      icon: BookOpen,
      progress: (completedAssignments / totalAssignments) * 100,
      color: 'text-primary'
    },
    {
      title: 'EduCoins',
      value: virtualCurrency,
      description: 'Available balance',
      icon: Award,
      color: 'text-accent-foreground'
    },
    {
      title: 'Study Streak',
      value: '7 days',
      description: 'Current streak',
      icon: Target,
      color: 'text-secondary'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Database Systems Quiz',
      time: 'Today, 2:00 PM',
      type: 'assessment',
      urgent: true
    },
    {
      title: 'Web Development Assignment Due',
      time: 'Tomorrow, 11:59 PM',
      type: 'assignment',
      urgent: false
    },
    {
      title: 'Group Project Presentation',
      time: 'Friday, 10:00 AM',
      type: 'presentation',
      urgent: false
    }
  ];

  const recentActivities = [
    {
      title: 'Submitted Machine Learning Assignment',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-secondary'
    },
    {
      title: 'Joined Data Structures study group',
      time: '5 hours ago',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Earned 50 EduCoins for perfect attendance',
      time: '1 day ago',
      icon: Award,
      color: 'text-accent-foreground'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white shadow-elegant">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="opacity-90">
              Ready to continue your learning journey? You have 3 pending tasks.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-pulse-glow">
              <TrendingUp className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-elegant transition-all duration-300 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              {stat.progress && (
                <Progress 
                  value={stat.progress} 
                  className="mt-3 h-2"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Don't miss these important deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex-1">
                  <h4 className="font-medium flex items-center gap-2">
                    {event.title}
                    {event.urgent && (
                      <Badge variant="destructive" className="text-xs">Urgent</Badge>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your latest achievements and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <div className={`p-1 rounded-full bg-background`}>
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features for faster access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CheckCircle className="h-6 w-6" />
              Mark Attendance
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BookOpen className="h-6 w-6" />
              View Assignments
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Join Study Group
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Award className="h-6 w-6" />
              Redeem EduCoins
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;