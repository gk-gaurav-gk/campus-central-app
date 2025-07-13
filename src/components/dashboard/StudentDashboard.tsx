import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Calendar,
  TrendingUp,
  BookOpen,
  Users,
  Award,
  Clock,
  CheckCircle,
  Target,
  ChevronRight,
  Upload,
  VideoIcon,
  Star,
  Coins,
  Play,
  FileText
} from 'lucide-react';
import AttendanceKPI from './widgets/AttendanceKPI';
import AssignmentKPI from './widgets/AssignmentKPI';
import VirtualCurrencyKPI from './widgets/VirtualCurrencyKPI';
import UpcomingEventsKPI from './widgets/UpcomingEventsKPI';
import MiniCalendar from './widgets/MiniCalendar';
import NotificationBell from './widgets/NotificationBell';

const StudentDashboard = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Student-specific mock data
  const studentData = {
    attendance: {
      percentage: 87,
      daysPresent: 26,
      totalDays: 30,
      trend: '+5%'
    },
    assignments: {
      submitted: 8,
      pending: 3,
      graded: 5,
      total: 16
    },
    virtualCurrency: {
      balance: 2450,
      recentEarned: 150,
      canSpend: true
    },
    courseProgress: [
      { course: 'Database Systems', progress: 75, grade: 'A-' },
      { course: 'React Development', progress: 92, grade: 'A+' },
      { course: 'Data Structures', progress: 68, grade: 'B+' },
      { course: 'Computer Networks', progress: 83, grade: 'A' }
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Database Systems Quiz',
        time: 'Today, 2:00 PM',
        type: 'quiz',
        urgent: true,
        course: 'DB Systems'
      },
      {
        id: 2,
        title: 'React Workshop',
        time: 'Tomorrow, 3:00 PM',
        type: 'workshop',
        course: 'React Dev'
      },
      {
        id: 3,
        title: 'Group Project Presentation',
        time: 'Friday, 10:00 AM',
        type: 'presentation',
        course: 'Networks'
      }
    ]
  };

  const quickActions = [
    { icon: Upload, label: 'Submit Assignment', color: 'text-primary', action: '/assignments' },
    { icon: VideoIcon, label: 'Join Video Class', color: 'text-secondary', action: '/courses' },
    { icon: FileText, label: 'Check Grades', color: 'text-coral', action: '/grades' },
    { icon: Coins, label: 'Redeem Coins', color: 'text-pink', action: '/rewards' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-comfortaa font-bold bg-gradient-primary bg-clip-text text-transparent">
            Good morning, {user?.name?.split(' ')[0] || 'Student'}! ✨
          </h1>
          <p className="text-muted-foreground mt-2 font-inter">
            Ready to conquer your learning goals today? You have {studentData.assignments.pending} pending assignments.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses, assignments, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 glass-card"
            />
          </div>
          <NotificationBell />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <AttendanceKPI data={studentData.attendance} />
        <AssignmentKPI data={studentData.assignments} />
        <VirtualCurrencyKPI data={studentData.virtualCurrency} />
        <UpcomingEventsKPI events={studentData.upcomingEvents.slice(0, 1)} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Progress */}
        <Card className="lg:col-span-2 glass-card hover-float">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-comfortaa flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Course Progress
                </CardTitle>
                <CardDescription>Your academic journey at a glance</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All Courses
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentData.courseProgress.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-primary/10 hover-lift"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{course.course}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {course.grade}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={course.progress} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mini Calendar */}
        <MiniCalendar />
      </div>

      {/* Quick Actions */}
      <Card className="glass-card hover-float">
        <CardHeader>
          <CardTitle className="font-comfortaa">Quick Actions</CardTitle>
          <CardDescription>Jump to frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col gap-2 hover-lift group border-primary/20 hover:border-primary/40"
              >
                <action.icon className={`h-6 w-6 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card hover-float">
          <CardHeader>
            <CardTitle className="font-comfortaa flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Performance Insights
            </CardTitle>
            <CardDescription>Your progress this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-glass">
                <span className="text-sm">Study Time</span>
                <span className="font-semibold text-secondary">+15% ↗</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-glass">
                <span className="text-sm">Assignment Scores</span>
                <span className="font-semibold text-primary">92% avg</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-glass">
                <span className="text-sm">Participation</span>
                <span className="font-semibold text-coral">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-float">
          <CardHeader>
            <CardTitle className="font-comfortaa flex items-center gap-2">
              <Target className="h-5 w-5 text-pink" />
              Daily Goals
            </CardTitle>
            <CardDescription>Keep up the momentum</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span className="text-sm">Complete 2 assignments</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                <span className="text-sm">Attend 3 lectures</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                <span className="text-sm">Study for 4 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">Earn 100 learning coins</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;