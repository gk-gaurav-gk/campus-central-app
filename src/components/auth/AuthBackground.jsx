
import React from 'react';
import { GraduationCap } from 'lucide-react';
import loginBg from '@/assets/login-bg.jpg';

const AuthBackground = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70" />
      
      <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white max-w-lg">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">EduFlow</h1>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Welcome to Your
            <br />
            Digital Campus
          </h2>
          <p className="text-xl text-white/90 leading-relaxed">
            Connect, learn, and grow with our comprehensive educational platform designed for modern learning.
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-white/80">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span>10,000+ Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span>500+ Courses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBackground;
