import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap, Users, UserCheck, BookOpen, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import loginBg from '@/assets/login-bg.jpg';

const LoginForm = ({ onLogin, onRoleSwitch, currentRole = 'student' }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin({
        name: currentRole === 'admin' ? 'Dr. Sarah Johnson' : 'Alex Thompson',
        email: formData.email,
        role: currentRole === 'admin' ? 'Administrator' : 'Computer Science Student',
        avatar: null
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex">
      <div className="flex w-full max-w-none">
        
        {/* Left Panel - Professional Background */}
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

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 bg-card flex flex-col justify-center">
          <div className="px-8 lg:px-16 py-12 max-w-md mx-auto w-full">
            
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">EduFlow</h1>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp ? 'Join thousands of learners today' : 'Welcome back! Please sign in to continue'}
              </p>
            </div>

            {/* College/Branch Selector */}
            <div className="mb-6">
              <Select defaultValue="main-campus">
                <SelectTrigger className="w-full h-12 border-border bg-background">
                  <SelectValue placeholder="Select College/Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main-campus">Main Campus</SelectItem>
                  <SelectItem value="north-branch">North Branch</SelectItem>
                  <SelectItem value="south-branch">South Branch</SelectItem>
                  <SelectItem value="online">Online Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Selector */}
            <div className="flex justify-center space-x-1 mb-8 p-1 bg-muted rounded-lg">
              <Button
                variant={currentRole === 'student' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onRoleSwitch('student')}
                className="flex-1 rounded-md"
              >
                <Users className="h-4 w-4 mr-2" />
                Student
              </Button>
              <Button
                variant={currentRole === 'teacher' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onRoleSwitch('teacher')}
                className="flex-1 rounded-md"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Teacher
              </Button>
              <Button
                variant={currentRole === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onRoleSwitch('admin')}
                className="flex-1 rounded-md"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>

            {/* Google Sign In Button */}
            <Button 
              variant="outline" 
              className="w-full h-12 mb-6 border-border hover:bg-muted"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-border bg-background placeholder:text-muted-foreground"
                  />
                </div>
              )}

              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 border-border bg-background placeholder:text-muted-foreground"
                />
              </div>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="h-12 border-border bg-background placeholder:text-muted-foreground pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {isSignUp && (
                <div>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-border bg-background placeholder:text-muted-foreground"
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-muted-foreground">
                    <input type="checkbox" className="rounded border-border" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            {/* Toggle between Sign In / Sign Up */}
            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 text-primary hover:underline font-medium"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            {!isSignUp && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center border border-border">
                <p className="text-sm text-muted-foreground mb-2 font-medium">Demo credentials:</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p><span className="font-semibold">Email:</span> demo@college.edu</p>
                  <p><span className="font-semibold">Password:</span> demo123</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;