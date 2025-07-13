import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Calendar,
  TrendingUp,
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  CheckCircle,
  PlusCircle,
  ChevronRight,
  FileText,
  VideoIcon,
  BarChart3,
  UserCheck,
  ClipboardCheck,
  AlertTriangle
} from 'lucide-react';
import MiniCalendar from './widgets/MiniCalendar';
import NotificationBell from './widgets/NotificationBell';

const TeacherDashboard = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Teacher-specific mock data
  const teacherData = {
    classes: [
      { name: 'Database Systems', students: 45, attendance: 92, nextClass: 'Today 2:00 PM' },
      { name: 'React Development', students: 38, attendance: 89, nextClass: 'Tomorrow 10:00 AM' },
      { name: 'Data Structures', students: 52, attendance: 95, nextClass: 'Wed 3:00 PM' }
    ],
    pendingGrading: [
      { assignment: 'Database Design Project', submissions: 45, pending: 12, course: 'DB Systems' },
      { assignment: 'React Component Quiz', submissions: 38, pending: 8, course: 'React Dev' },
      { assignment: 'Algorithm Analysis', submissions: 52, pending: 15, course: 'Data Structures' }
    ],
    studentEngagement: {
      totalStudents: 135,
      activeToday: 128,
      averageAttendance: 92,
      completionRate: 87
    },
    upcomingEvents: [
      {
        id: 1,
        title: 'Faculty Meeting',
        time: 'Today, 4:00 PM',
        type: 'meeting',
        location: 'Conference Room A'
      },
      {
        id: 2,
        title: 'Student Presentations',
        time: 'Tomorrow, 2:00 PM',
        type: 'class',
        location: 'Room 301'
      },
      {
        id: 3,
        title: 'Curriculum Review',
        time: 'Friday, 1:00 PM',
        type: 'admin',
        location: 'Virtual'
      }
    ]
  };

  const quickActions = [
    { icon: PlusCircle, label: 'Create Quiz', color: 'text-primary', action: '/quizzes/create' },
    { icon: ClipboardCheck, label: 'Grade Assignments', color: 'text-secondary', action: '/grading' },
    { icon: VideoIcon, label: 'Start Video Session', color: 'text-coral', action: '/video-sessions' },
    { icon: BarChart3, label: 'View Analytics', color: 'text-pink', action: '/analytics' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-comfortaa font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome back, Professor {user?.name?.split(' ')[0] || 'Smith'}! 👨‍🏫
          </h1>
          <p className="text-muted-foreground mt-2 font-inter">
            You have {teacherData.pendingGrading.reduce((acc, item) => acc + item.pending, 0)} assignments to grade and 3 classes today.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students, courses, assignments..."
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
        <Card className="glass-card hover-float">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">{teacherData.studentEngagement.totalStudents}</p>
                <p className="text-xs text-secondary">
                  +5 this semester
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-float">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <p className="text-3xl font-bold">{teacherData.studentEngagement.averageAttendance}%</p>
                <p className="text-xs text-secondary">
                  +3% this week
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-float">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Grades</p>
                <p className="text-3xl font-bold">{teacherData.pendingGrading.reduce((acc, item) => acc + item.pending, 0)}</p>
                <p className="text-xs text-coral">
                  Needs attention
                </p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-coral" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-float">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold">{teacherData.studentEngagement.completionRate}%</p>
                <p className="text-xs text-primary">
                  Excellent
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Performance */}
        <Card className="lg:col-span-2 glass-card hover-float">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-comfortaa flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Class Performance
                </CardTitle>
                <CardDescription>Monitor your classes at a glance</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All Classes
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {teacherData.classes.map((classItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-primary/10 hover-lift"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{classItem.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {classItem.students} students
                      </Badge>
                      <Badge variant={classItem.attendance >= 90 ? "default" : "secondary"} className="text-xs">
                        {classItem.attendance}% attendance
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Next class: {classItem.nextClass}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mini Calendar */}
        <MiniCalendar />
      </div>

      {/* Pending Grading */}
      <Card className="glass-card hover-float">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-comfortaa flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-coral" />
                Pending Grading
              </CardTitle>
              <CardDescription>Assignments awaiting your review</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Grade All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teacherData.pendingGrading.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gradient-glass border border-primary/10 hover-lift"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{item.assignment}</h4>
                  {item.pending > 10 && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{item.course}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs">
                    {item.pending} of {item.submissions} pending
                  </span>
                  <Button size="sm" variant="outline" className="text-xs h-6">
                    Grade
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-card hover-float">
        <CardHeader>
          <CardTitle className="font-comfortaa">Quick Actions</CardTitle>
          <CardDescription>Streamline your teaching workflow</CardDescription>
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
    </div>
  );
};

export default TeacherDashboard;