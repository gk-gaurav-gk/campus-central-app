import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Bell,
  Calendar,
  TrendingUp,
  BookOpen,
  Users,
  Award,
  Clock,
  CheckCircle,
  Target,
  ChevronRight,
  User,
  Settings,
  DollarSign,
  Activity,
  GraduationCap,
  Database
} from 'lucide-react';
import AttendanceKPI from './widgets/AttendanceKPI';
import AssignmentKPI from './widgets/AssignmentKPI';
import VirtualCurrencyKPI from './widgets/VirtualCurrencyKPI';
import UpcomingEventsKPI from './widgets/UpcomingEventsKPI';
import MiniCalendar from './widgets/MiniCalendar';
import NotificationBell from './widgets/NotificationBell';
import { useRoleAccess } from '@/hooks/useRoleAccess';

const HeroDashboard = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { userRole, isStudent, isTeacher, isAdmin, getRoleBadgeColor } = useRoleAccess();

  // Mock data for dashboard
  const attendanceData = {
    percentage: 87,
    daysPresent: 26,
    totalDays: 30,
    trend: '+5%'
  };

  const assignmentData = {
    submitted: 8,
    pending: 3,
    graded: 5,
    total: 16
  };

  const virtualCurrency = {
    balance: 2450,
    recentEarned: 150,
    canSpend: true
  };

  const upcomingEvents = [
    {
      id: 1,
      title: 'Database Systems Quiz',
      time: 'Today, 2:00 PM',
      type: 'quiz',
      urgent: true,
      canRSVP: false
    },
    {
      id: 2,
      title: 'React Workshop',
      time: 'Tomorrow, 3:00 PM',
      type: 'workshop',
      urgent: false,
      canRSVP: true
    },
    {
      id: 3,
      title: 'Group Project Presentation',
      time: 'Friday, 10:00 AM',
      type: 'presentation',
      urgent: false,
      canRSVP: true
    }
  ];

  const quickActions = [
    { icon: CheckCircle, label: 'Mark Attendance', color: 'text-secondary' },
    { icon: BookOpen, label: 'View Assignments', color: 'text-primary' },
    { icon: Users, label: 'Study Groups', color: 'text-coral' },
    { icon: Award, label: 'Redeem Coins', color: 'text-pink' }
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
            Ready to conquer your learning goals today? You have 3 pending tasks.
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

          {/* Notifications Bell */}
          <NotificationBell />

          {/* Profile Snapshot */}
          <div className="flex items-center gap-3 p-3 rounded-xl glass-card hover-lift">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {user?.name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.name || 'Student'}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {user?.role || 'Student'}
                </Badge>
                {user?.canSwitchRole && (
                  <Button variant="ghost" size="sm" className="text-xs p-0 h-auto">
                    Switch Role
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <AttendanceKPI data={attendanceData} />
        <AssignmentKPI data={assignmentData} />
        <VirtualCurrencyKPI data={virtualCurrency} />
        <UpcomingEventsKPI events={upcomingEvents.slice(0, 1)} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events - Full */}
        <Card className="lg:col-span-2 glass-card hover-float">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-comfortaa flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Your schedule at a glance</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-primary/10 hover-lift"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{event.title}</h4>
                    {event.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </p>
                </div>
                {event.canRSVP && (
                  <Button size="sm" variant="outline" className="ml-4">
                    RSVP
                  </Button>
                )}
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

      {/* Performance Insights */}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeroDashboard;