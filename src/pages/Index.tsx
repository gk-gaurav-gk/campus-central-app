import React from 'react';
import DashboardHome from '../components/dashboard/DashboardHome';

const Index = ({ user }) => {
  return (
    <div className="container mx-auto">
      <DashboardHome user={user} />
    </div>
  );
};

export default Index;
