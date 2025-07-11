
import React from 'react';
import Header from './Header';
import AppSidebar from './AppSidebar';
import { useAuth } from '@/hooks/useAuth';

const Layout = ({ children, user }) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 p-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
