import React from 'react';
import AttendanceView from '../components/modules/attendance/AttendanceView';

const AttendancePage = ({ userRole }) => {
  return (
    <div className="container mx-auto">
      <AttendanceView userRole={userRole} />
    </div>
  );
};

export default AttendancePage;