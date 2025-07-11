import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  BarChart3,
  QrCode,
  Fingerprint,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const StudentAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateDetails, setShowDateDetails] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock data
  const attendanceStats = {
    overall: 85,
    thisMonth: 92,
    subjects: [
      { 
        name: 'Database Systems', 
        percentage: 90, 
        present: 18, 
        total: 20, 
        lastUpdated: '5 minutes ago',
        target: 85
      },
      { 
        name: 'Web Development', 
        percentage: 88, 
        present: 22, 
        total: 25, 
        lastUpdated: '2 hours ago',
        target: 85
      },
      { 
        name: 'Machine Learning', 
        percentage: 76, 
        present: 19, 
        total: 25, 
        lastUpdated: '1 day ago',
        target: 85
      },
      { 
        name: 'Software Engineering', 
        percentage: 82, 
        present: 14, 
        total: 17, 
        lastUpdated: '3 hours ago',
        target: 85
      }
    ]
  };

  const attendanceHistory = [
    { date: '2024-01-15', subject: 'Database Systems', status: 'present', time: '09:05 AM', remarks: 'On time' },
    { date: '2024-01-15', subject: 'Web Development', status: 'present', time: '11:02 AM', remarks: 'On time' },
    { date: '2024-01-14', subject: 'Machine Learning', status: 'late', time: '02:15 PM', remarks: 'Late by 15 minutes' },
    { date: '2024-01-14', subject: 'Software Engineering', status: 'present', time: '10:00 AM', remarks: 'On time' },
    { date: '2024-01-13', subject: 'Database Systems', status: 'absent', time: null, remarks: 'Medical leave' },
    { date: '2024-01-13', subject: 'Web Development', status: 'present', time: '11:00 AM', remarks: 'On time' },
    { date: '2024-01-12', subject: 'Machine Learning', status: 'present', time: '02:00 PM', remarks: 'On time' },
    { date: '2024-01-12', subject: 'Software Engineering', status: 'late', time: '10:20 AM', remarks: 'Late by 20 minutes' }
  ];

  const calendarData = {
    '2024-01-15': { status: 'present', classes: 2 },
    '2024-01-14': { status: 'mixed', classes: 2 },
    '2024-01-13': { status: 'mixed', classes: 2 },
    '2024-01-12': { status: 'mixed', classes: 2 },
    '2024-01-11': { status: 'present', classes: 1 },
    '2024-01-10': { status: 'absent', classes: 2 }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateString = date?.toISOString().split('T')[0];
    if (calendarData[dateString]) {
      setShowDateDetails(true);
    }
  };

  const getSelectedDateData = () => {
    if (!selectedDate) return null;
    const dateString = selectedDate.toISOString().split('T')[0];
    return attendanceHistory.filter(record => record.date === dateString);
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
      late: 'gradient'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const sortedHistory = [...attendanceHistory].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'subject') {
      return sortOrder === 'desc' ? b.subject.localeCompare(a.subject) : a.subject.localeCompare(b.subject);
    }
    return 0;
  });

  const getDayTileContent = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const dayData = calendarData[dateString];
    
    if (!dayData) return null;

    const statusColor = {
      present: 'bg-secondary',
      absent: 'bg-destructive',
      mixed: 'bg-accent-foreground'
    };

    return (
      <div className="flex justify-center mt-1">
        <div className={`w-2 h-2 rounded-full ${statusColor[dayData.status] || 'bg-muted'}`} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-comfortaa">My Attendance</h1>
          <p className="text-muted-foreground">Track your attendance record and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Check-in
          </Button>
          <Button variant="outline" className="flex items-center gap-2" disabled>
            <Fingerprint className="h-4 w-4" />
            Biometric
          </Button>
        </div>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceStats.overall}%</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm opacity-90">+5% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{attendanceStats.thisMonth}%</div>
            <Progress value={attendanceStats.thisMonth} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Target Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-foreground">4/4</div>
            <p className="text-sm text-muted-foreground mt-1">Subjects above 85%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Subject-wise Attendance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {attendanceStats.subjects.map((subject, index) => (
              <Card key={index} className="hover-float">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    {subject.percentage < subject.target && (
                      <AlertTriangle className="h-5 w-5 text-accent-foreground" />
                    )}
                  </div>
                  <CardDescription>Last updated {subject.lastUpdated}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-primary">{subject.percentage}%</span>
                    <Button variant="ghost" size="sm">View details</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to target ({subject.target}%)</span>
                      <span>{subject.present}/{subject.total} classes</span>
                    </div>
                    <Progress 
                      value={subject.percentage} 
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Target: {subject.target}%</span>
                    {subject.percentage >= subject.target ? (
                      <Badge variant="success">On track</Badge>
                    ) : (
                      <Badge variant="gradient">Need improvement</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Attendance Calendar
                </CardTitle>
                <CardDescription>Click on any date to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border w-full"
                  components={{
                    DayContent: ({ date }) => (
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <span>{date.getDate()}</span>
                        {getDayTileContent(date)}
                      </div>
                    )
                  }}
                />
                
                {/* Legend */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Legend</p>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span>All Present</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-destructive"></div>
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-accent-foreground"></div>
                      <span>Mixed/Late</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>Your attendance patterns this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-secondary">12</p>
                      <p className="text-sm text-muted-foreground">Present</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent-foreground">2</p>
                      <p className="text-sm text-muted-foreground">Late</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-destructive">1</p>
                      <p className="text-sm text-muted-foreground">Absent</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Weekly Attendance</span>
                      <span className="text-sm font-medium">80%</span>
                    </div>
                    <Progress value={80} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendance History</CardTitle>
                  <CardDescription>Complete record of your attendance</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSortBy(sortBy === 'date' ? 'subject' : 'date')}
                  >
                    Sort by {sortBy === 'date' ? 'Subject' : 'Date'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  >
                    {sortOrder === 'desc' ? '↓' : '↑'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.date}</TableCell>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          {getStatusBadge(record.status)}
                        </div>
                      </TableCell>
                      <TableCell>{record.time || 'N/A'}</TableCell>
                      <TableCell className="text-muted-foreground">{record.remarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Date Details Dialog */}
      <Dialog open={showDateDetails} onOpenChange={setShowDateDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Attendance Details - {selectedDate?.toLocaleDateString()}
            </DialogTitle>
            <DialogDescription>
              Your attendance record for this date
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {getSelectedDateData()?.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(record.status)}
                  <div>
                    <p className="font-medium">{record.subject}</p>
                    <p className="text-sm text-muted-foreground">{record.time || 'No time recorded'}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(record.status)}
                  <p className="text-sm text-muted-foreground mt-1">{record.remarks}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentAttendance;