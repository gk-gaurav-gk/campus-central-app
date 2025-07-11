import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Users,
  QrCode,
  Undo2,
  Redo2,
  Save,
  AlertCircle
} from 'lucide-react';

const TeacherAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Mock data
  const classes = [
    { id: 'cs101', name: 'Database Systems - CS101', students: 25 },
    { id: 'cs102', name: 'Web Development - CS102', students: 30 },
    { id: 'cs201', name: 'Machine Learning - CS201', students: 28 },
    { id: 'cs202', name: 'Software Engineering - CS202', students: 22 }
  ];

  const [studentRoster, setStudentRoster] = useState([
    { id: '1', name: 'Alice Johnson', rollNo: 'CS001', status: 'present', timestamp: '09:05 AM' },
    { id: '2', name: 'Bob Smith', rollNo: 'CS002', status: 'present', timestamp: '09:02 AM' },
    { id: '3', name: 'Charlie Brown', rollNo: 'CS003', status: 'absent', timestamp: null },
    { id: '4', name: 'Diana Prince', rollNo: 'CS004', status: 'late', timestamp: '09:15 AM' },
    { id: '5', name: 'Eva Davis', rollNo: 'CS005', status: 'present', timestamp: '09:01 AM' },
    { id: '6', name: 'Frank Miller', rollNo: 'CS006', status: 'present', timestamp: '09:03 AM' },
    { id: '7', name: 'Grace Lee', rollNo: 'CS007', status: 'absent', timestamp: null },
    { id: '8', name: 'Henry Wilson', rollNo: 'CS008', status: 'present', timestamp: '09:07 AM' }
  ]);

  const filteredStudents = studentRoster.filter(student =>
    student.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const attendanceStats = {
    present: studentRoster.filter(s => s.status === 'present').length,
    absent: studentRoster.filter(s => s.status === 'absent').length,
    late: studentRoster.filter(s => s.status === 'late').length,
    total: studentRoster.length
  };

  const handleStatusChange = (studentId, newStatus) => {
    setStudentRoster(prev => prev.map(student => 
      student.id === studentId 
        ? { 
            ...student, 
            status: newStatus,
            timestamp: newStatus === 'absent' ? null : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        : student
    ));
    setHasChanges(true);
  };

  const handleBulkAction = (action) => {
    const newStatus = action === 'present' ? 'present' : 'absent';
    const timestamp = action === 'present' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
    
    setStudentRoster(prev => prev.map(student => ({
      ...student,
      status: newStatus,
      timestamp
    })));
    setHasChanges(true);
    setBulkAction(action);
  };

  const handlePublish = () => {
    // Simulate API call
    console.log('Publishing attendance...', { selectedClass, selectedDate, studentRoster });
    setHasChanges(false);
    setEditMode(false);
    // Show success message
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-secondary/20 border-secondary text-secondary-foreground';
      case 'absent': return 'bg-destructive/20 border-destructive text-destructive-foreground';
      case 'late': return 'bg-accent/20 border-accent text-accent-foreground';
      default: return 'bg-background border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-secondary" />;
      case 'absent': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'late': return <Clock className="h-4 w-4 text-accent-foreground" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-comfortaa">Teacher Attendance</h1>
          <p className="text-muted-foreground">Mark and manage student attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={!hasChanges}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={!hasChanges}>
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="hero" 
            onClick={handlePublish}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Publish Attendance
          </Button>
        </div>
      </div>

      {/* Class and Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Class Selection</CardTitle>
          <CardDescription>Select class and date to mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.students} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">QR Check-in</label>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Generate QR Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <>
          {/* Attendance Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-secondary/10 border-secondary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-secondary">{attendanceStats.present}</p>
                    <p className="text-sm text-muted-foreground">Present</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-destructive/10 border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-destructive">{attendanceStats.absent}</p>
                    <p className="text-sm text-muted-foreground">Absent</p>
                  </div>
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/10 border-accent">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-accent-foreground">{attendanceStats.late}</p>
                    <p className="text-sm text-muted-foreground">Late</p>
                  </div>
                  <Clock className="h-8 w-8 text-accent-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{attendanceStats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => handleBulkAction('present')}
                    className="bg-secondary/10 border-secondary text-secondary-foreground hover:bg-secondary/20"
                  >
                    Mark All Present
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleBulkAction('absent')}
                    className="bg-destructive/10 border-destructive text-destructive-foreground hover:bg-destructive/20"
                  >
                    Mark All Absent
                  </Button>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={editMode}
                      onCheckedChange={setEditMode}
                    />
                    <label className="text-sm font-medium">Edit Mode</label>
                  </div>
                </div>

                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-10 w-full md:w-64"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Roster */}
          <Card>
            <CardHeader>
              <CardTitle>Student Roster</CardTitle>
              <CardDescription>Click on status to change attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredStudents.map(student => (
                  <div 
                    key={student.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${getStatusColor(student.status)}`}
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(student.status)}
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {student.timestamp && (
                        <span className="text-sm text-muted-foreground">
                          {student.timestamp}
                        </span>
                      )}
                      
                      {editMode ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={student.status === 'present' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className="h-8 w-8 p-0"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === 'late' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className="h-8 w-8 p-0"
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === 'absent' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className="h-8 w-8 p-0"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge 
                          variant={student.status === 'present' ? 'success' : student.status === 'absent' ? 'destructive' : 'gradient'}
                          className="cursor-pointer"
                          onClick={() => editMode && handleStatusChange(student.id, student.status === 'present' ? 'absent' : 'present')}
                        >
                          {student.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TeacherAttendance;