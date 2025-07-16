import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useRole } from '@/contexts/RoleContext';
import { 
  QrCode, 
  UserCheck, 
  Users, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  sessionTitle: string;
  presentCount: number;
  totalStudents: number;
  status: 'completed' | 'ongoing' | 'scheduled';
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late';
  checkinTime?: string;
}

interface CourseAttendanceProps {
  courseId: string;
}

const CourseAttendance: React.FC<CourseAttendanceProps> = ({ courseId }) => {
  const { currentRole } = useRole();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showQRCode, setShowQRCode] = useState(false);
  
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      sessionTitle: 'React Components Introduction',
      presentCount: 23,
      totalStudents: 25,
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-12',
      sessionTitle: 'State Management Basics',
      presentCount: 21,
      totalStudents: 25,
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-18',
      sessionTitle: 'Props and Event Handling',
      presentCount: 0,
      totalStudents: 25,
      status: 'scheduled'
    }
  ]);

  const [todayStudents] = useState<Student[]>([
    { id: '1', name: 'Alex Johnson', rollNumber: 'CS2021001', status: 'present', checkinTime: '09:05' },
    { id: '2', name: 'Maria Garcia', rollNumber: 'CS2021002', status: 'present', checkinTime: '09:03' },
    { id: '3', name: 'David Chen', rollNumber: 'CS2021003', status: 'late', checkinTime: '09:15' },
    { id: '4', name: 'Sarah Kim', rollNumber: 'CS2021004', status: 'absent' },
    { id: '5', name: 'James Wilson', rollNumber: 'CS2021005', status: 'present', checkinTime: '09:01' }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'late':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendancePercentage = (record: AttendanceRecord) => {
    return Math.round((record.presentCount / record.totalStudents) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">25</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Average Attendance</p>
                <p className="text-2xl font-bold">88%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Scanner */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mark Attendance</CardTitle>
            {(currentRole === 'teacher' || currentRole === 'admin') && (
              <Button 
                onClick={() => setShowQRCode(!showQRCode)}
                variant={showQRCode ? "destructive" : "default"}
              >
                <QrCode className="w-4 h-4 mr-2" />
                {showQRCode ? 'Stop Session' : 'Generate QR Code'}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {showQRCode ? (
              <div className="text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Students can scan this QR code to mark their attendance
                </p>
                <Badge variant="outline" className="text-green-600">
                  Session Active
                </Badge>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {currentRole === 'teacher' 
                    ? 'Generate a QR code to start taking attendance' 
                    : 'Waiting for teacher to start attendance session'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
            />
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayStudents.map((student) => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(student.status)}
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {student.checkinTime && (
                    <span className="text-sm text-muted-foreground">
                      {student.checkinTime}
                    </span>
                  )}
                  <Badge className={getStatusColor(student.status)}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceRecords.map((record) => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{record.sessionTitle}</h4>
                  <p className="text-sm text-muted-foreground">{record.date}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Attendance</p>
                    <p className="font-medium">
                      {record.presentCount}/{record.totalStudents} ({getAttendancePercentage(record)}%)
                    </p>
                  </div>
                  <Badge 
                    variant={record.status === 'completed' ? 'default' : 'outline'}
                    className={
                      record.status === 'completed' ? 'bg-green-100 text-green-800' :
                      record.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseAttendance;