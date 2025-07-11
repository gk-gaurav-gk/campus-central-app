
import React from 'react';
import Header from './Header';
import AppSidebar from './AppSidebar';

const Layout = ({ children, user, currentRole, onRoleChange }) => {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header 
          user={user} 
          currentRole={currentRole}
          onRoleChange={onRoleChange}
        />
        <main className="flex-1 p-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
