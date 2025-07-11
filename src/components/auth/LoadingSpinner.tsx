
import React from 'react';
import { GraduationCap } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center animate-pulse">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">EduFlow</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
