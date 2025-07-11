
import React from 'react';
import { GraduationCap } from 'lucide-react';

const MobileHeader = () => {
  return (
    <div className="lg:hidden text-center mb-8">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">EduFlow</h1>
      </div>
    </div>
  );
};

export default MobileHeader;
