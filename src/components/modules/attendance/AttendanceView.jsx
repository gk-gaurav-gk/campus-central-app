import React from 'react';
import TeacherAttendance from './TeacherAttendance';
import StudentAttendance from './StudentAttendance';

const AttendanceView = ({ userRole = 'student' }) => {
  // Route to appropriate view based on user role
  if (userRole === 'teacher' || userRole === 'admin') {
    return <TeacherAttendance />;
  }
  
  return <StudentAttendance />;
};

export default AttendanceView;