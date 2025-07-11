import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  BarChart3,
  QrCode,
  MapPin,
  Users
} from 'lucide-react';

const AttendanceView = ({ userRole = 'student' }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);

  // Mock data
  const attendanceStats = {
    overall: 85,
    thisMonth: 92,
    classes: [
      { subject: 'Database Systems', percentage: 90, present: 18, total: 20 },
      { subject: 'Web Development', percentage: 88, present: 22, total: 25 },
      { subject: 'Machine Learning', percentage: 76, present: 19, total: 25 },
      { subject: 'Software Engineering', percentage: 82, present: 14, total: 17 }
    ]
  };

  const recentAttendance = [
    { date: '2024-01-15', subject: 'Database Systems', status: 'present', time: '09:00 AM' },
    { date: '2024-01-14', subject: 'Web Development', status: 'present', time: '11:00 AM' },
    { date: '2024-01-13', subject: 'Machine Learning', status: 'absent', time: '02:00 PM' },
    { date: '2024-01-12', subject: 'Software Engineering', status: 'present', time: '10:00 AM' },
    { date: '2024-01-11', subject: 'Database Systems', status: 'late', time: '09:15 AM' }
  ];

  const todayClasses = [
    { subject: 'Database Systems', time: '09:00 - 10:30 AM', room: 'CS-101', status: 'completed' },
    { subject: 'Web Development', time: '11:00 - 12:30 PM', room: 'CS-102', status: 'current' },
    { subject: 'Machine Learning', time: '02:00 - 03:30 PM', room: 'CS-201', status: 'upcoming' }
  ];

  const handleMarkAttendance = () => {
    setIsMarkingAttendance(true);
    setTimeout(() => {
      setIsMarkingAttendance(false);
      // Show success message
    }, 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'late':
        return <Clock className="h-4 w-4 text-accent-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      present: 'success',
      absent: 'destructive',
      late: 'gradient',
      completed: 'secondary',
      current: 'default',
      upcoming: 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Track and manage class attendance</p>
        </div>
        {userRole === 'student' && (
          <Button 
            variant="hero" 
            size="lg"
            onClick={handleMarkAttendance}
            disabled={isMarkingAttendance}
            className="flex items-center gap-2"
          >
            <QrCode className="h-5 w-5" />
            {isMarkingAttendance ? 'Marking...' : 'Mark Attendance'}
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-secondary text-secondary-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Overall Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{attendanceStats.overall}%</div>
                <Progress value={attendanceStats.overall} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{attendanceStats.thisMonth}%</div>
                <p className="text-sm text-muted-foreground mt-1">+7% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Classes Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent-foreground">{todayClasses.length}</div>
                <p className="text-sm text-muted-foreground mt-1">1 completed, 2 remaining</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Today's Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayClasses.map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{classItem.subject}</h4>
                        {getStatusBadge(classItem.status)}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {classItem.time}
                        <MapPin className="h-3 w-3 ml-2" />
                        {classItem.room}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Subject-wise Attendance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Subject-wise Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {attendanceStats.classes.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{subject.subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {subject.present}/{subject.total} ({subject.percentage}%)
                      </span>
                    </div>
                    <Progress value={subject.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>Your attendance history for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAttendance.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <p className="font-medium">{record.subject}</p>
                        <p className="text-sm text-muted-foreground">{record.date} • {record.time}</p>
                      </div>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
                <CardDescription>View attendance by date</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Selected Date Details</CardTitle>
                <CardDescription>
                  {selectedDate?.toLocaleDateString() || 'Select a date'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a date to view attendance details</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Monthly attendance patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-background/50 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chart component would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance Goals</CardTitle>
                <CardDescription>Track your attendance targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Semester Goal (85%)</span>
                    <span className="text-sm text-muted-foreground">{attendanceStats.overall}%</span>
                  </div>
                  <Progress value={attendanceStats.overall} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Monthly Goal (90%)</span>
                    <span className="text-sm text-muted-foreground">{attendanceStats.thisMonth}%</span>
                  </div>
                  <Progress value={attendanceStats.thisMonth} />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-secondary">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">On track to meet semester goal!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceView;