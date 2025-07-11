
import React from 'react';

const DemoCredentials = ({ isSignUp }) => {
  if (isSignUp) return null;

  return (
    <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center border border-border">
      <p className="text-sm text-muted-foreground mb-2 font-medium">Demo credentials:</p>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p><span className="font-semibold">Email:</span> demo@college.edu</p>
        <p><span className="font-semibold">Password:</span> demo123</p>
      </div>
    </div>
  );
};

export default DemoCredentials;
