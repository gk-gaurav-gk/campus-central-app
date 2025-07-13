import React, { createContext, useContext, ReactNode } from 'react';

type UserRole = 'student' | 'teacher' | 'admin';

interface RoleContextType {
  currentRole: UserRole;
  user: {
    name: string;
    email: string;
    role: UserRole;
    avatar: string | null;
    id: string;
  };
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
  currentRole: UserRole;
  user: RoleContextType['user'];
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children, currentRole, user }) => {
  return (
    <RoleContext.Provider value={{ currentRole, user }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};