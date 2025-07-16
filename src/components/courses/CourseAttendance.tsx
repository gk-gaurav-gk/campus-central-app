import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/hooks/use-toast';
import { 
  QrCode, 
  UserCheck, 
  Users, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  Save
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
  email: string;
  groupId: string;
  groupName: string;
  status: 'present' | 'absent' | 'late';
  checkinTime?: string;
}

interface CourseGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

interface CourseAttendanceProps {
  courseId: string;
}

const CourseAttendance: React.FC<CourseAttendanceProps> = ({ courseId }) => {
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [attendanceData, setAttendanceData] = useState<{[key: string]: boolean}>({});
  
  // Mock groups data
  const [groups] = useState<CourseGroup[]>([
    { id: 'group1', name: 'CS301-A', description: 'Section A', memberCount: 15 },
    { id: 'group2', name: 'CS301-B', description: 'Section B', memberCount: 12 },
    { id: 'group3', name: 'CS301-C', description: 'Section C', memberCount: 13 }
  ]);

  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      sessionTitle: 'Data Structures Introduction',
      presentCount: 28,
      totalStudents: 40,
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-12',
      sessionTitle: 'Arrays and Linked Lists',
      presentCount: 35,
      totalStudents: 40,
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-18',
      sessionTitle: 'Stacks and Queues',
      presentCount: 0,
      totalStudents: 40,
      status: 'scheduled'
    }
  ]);

  const [allStudents] = useState<Student[]>([
    // Group 1 students
    { id: '1', name: 'John Doe', rollNumber: 'CS2023001', email: 'john.doe@student.college.edu', groupId: 'group1', groupName: 'CS301-A', status: 'present', checkinTime: '09:05' },
    { id: '2', name: 'Jane Smith', rollNumber: 'CS2023002', email: 'jane.smith@student.college.edu', groupId: 'group1', groupName: 'CS301-A', status: 'present', checkinTime: '09:03' },
    { id: '3', name: 'Mike Johnson', rollNumber: 'CS2023003', email: 'mike.johnson@student.college.edu', groupId: 'group1', groupName: 'CS301-A', status: 'absent' },
    { id: '4', name: 'Sarah Wilson', rollNumber: 'CS2023004', email: 'sarah.wilson@student.college.edu', groupId: 'group1', groupName: 'CS301-A', status: 'late', checkinTime: '09:15' },
    { id: '5', name: 'David Brown', rollNumber: 'CS2023005', email: 'david.brown@student.college.edu', groupId: 'group1', groupName: 'CS301-A', status: 'present', checkinTime: '09:01' },
    
    // Group 2 students
    { id: '6', name: 'Lisa Davis', rollNumber: 'CS2023006', email: 'lisa.davis@student.college.edu', groupId: 'group2', groupName: 'CS301-B', status: 'present', checkinTime: '09:02' },
    { id: '7', name: 'Alex Taylor', rollNumber: 'CS2023007', email: 'alex.taylor@student.college.edu', groupId: 'group2', groupName: 'CS301-B', status: 'present', checkinTime: '09:04' },
    { id: '8', name: 'Emma White', rollNumber: 'CS2023008', email: 'emma.white@student.college.edu', groupId: 'group2', groupName: 'CS301-B', status: 'absent' },
    { id: '9', name: 'Ryan Garcia', rollNumber: 'CS2023009', email: 'ryan.garcia@student.college.edu', groupId: 'group2', groupName: 'CS301-B', status: 'present', checkinTime: '09:06' },
    
    // Group 3 students
    { id: '10', name: 'Maya Patel', rollNumber: 'CS2023010', email: 'maya.patel@student.college.edu', groupId: 'group3', groupName: 'CS301-C', status: 'present', checkinTime: '09:03' },
    { id: '11', name: 'Chris Lee', rollNumber: 'CS2023011', email: 'chris.lee@student.college.edu', groupId: 'group3', groupName: 'CS301-C', status: 'present', checkinTime: '09:07' },
    { id: '12', name: 'Sofia Rodriguez', rollNumber: 'CS2023012', email: 'sofia.rodriguez@student.college.edu', groupId: 'group3', groupName: 'CS301-C', status: 'absent' }
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

  const getFilteredStudents = () => {
    if (selectedGroup === 'all') return allStudents;
    return allStudents.filter(student => student.groupId === selectedGroup);
  };

  const handleMarkAllPresent = (groupId: string) => {
    const groupStudents = allStudents.filter(s => s.groupId === groupId);
    groupStudents.forEach(student => {
      setAttendanceData(prev => ({
        ...prev,
        [student.id]: true
      }));
    });
    
    toast({
      title: 'Success',
      description: `Marked all students in ${groups.find(g => g.id === groupId)?.name} as present`,
    });
  };

  const handleToggleAttendance = (studentId: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      // Mock save implementation
      const presentCount = Object.values(attendanceData).filter(Boolean).length;
      const totalCount = getFilteredStudents().length;
      
      toast({
        title: 'Attendance Saved',
        description: `Saved attendance for ${presentCount}/${totalCount} students`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save attendance',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{allStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Groups</p>
                <p className="text-2xl font-bold">{groups.length}</p>
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
                <p className="text-2xl font-bold">87%</p>
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
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group-based Attendance Controls */}
      {(currentRole === 'teacher' || currentRole === 'admin') && (
        <Card>
          <CardHeader>
            <CardTitle>Group-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.memberCount} students)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  {selectedGroup !== 'all' && (
                    <Button 
                      variant="outline"
                      onClick={() => handleMarkAllPresent(selectedGroup)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Mark All Present
                    </Button>
                  )}
                  <Button onClick={handleSaveAttendance}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Attendance
                  </Button>
                </div>
              </div>

              {/* Quick Group Actions */}
              {selectedGroup === 'all' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {groups.map((group) => (
                    <Card key={group.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{group.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {group.memberCount} students
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkAllPresent(group.id)}
                          >
                            Mark All Present
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
          <CardTitle className="flex items-center justify-between">
            <span>
              {selectedGroup === 'all' 
                ? 'Today\'s Attendance - All Groups' 
                : `Today's Attendance - ${groups.find(g => g.id === selectedGroup)?.name || 'Selected Group'}`}
            </span>
            <Badge variant="outline">
              {getFilteredStudents().length} students
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getFilteredStudents().map((student) => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {currentRole === 'teacher' || currentRole === 'admin' ? (
                    <Checkbox 
                      checked={attendanceData[student.id] || false}
                      onCheckedChange={() => handleToggleAttendance(student.id)}
                    />
                  ) : (
                    getStatusIcon(student.status)
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{student.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {student.rollNumber}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {student.groupName} • {student.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {student.checkinTime && (
                    <span className="text-sm text-muted-foreground">
                      {student.checkinTime}
                    </span>
                  )}
                  {currentRole === 'student' && (
                    <Badge className={getStatusColor(student.status)}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </Badge>
                  )}
                  {(currentRole === 'teacher' || currentRole === 'admin') && (
                    <Badge variant={attendanceData[student.id] ? 'default' : 'secondary'}>
                      {attendanceData[student.id] ? 'Present' : 'Absent'}
                    </Badge>
                  )}
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