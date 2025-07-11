import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, GraduationCap, Users, UserCheck, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Welcome Back */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-variant/30"></div>
        <div className="relative z-10 text-center space-y-8 max-w-lg">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-float">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold">EduFlow</h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold leading-tight">
              {isSignUp ? 'Join Our Academic Community' : 'Welcome Back to Your Future'}
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              {isSignUp 
                ? 'Create your account to access our comprehensive education management system and unlock your academic potential'
                : 'Continue your educational journey with our integrated platform designed for modern learning'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <Users className="h-10 w-10 mx-auto mb-3" />
              <p className="font-semibold text-lg">Students</p>
              <p className="text-sm text-white/80">Track Progress & Learn</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <UserCheck className="h-10 w-10 mx-auto mb-3" />
              <p className="font-semibold text-lg">Educators</p>
              <p className="text-sm text-white/80">Teach & Inspire</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <p className="text-white/90 italic">
              "Empowering education through technology, connecting minds across the digital classroom."
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden text-center space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">EduFlow</h1>
            </div>
          </div>

          {/* Role Selector */}
          <div className="flex justify-center space-x-2 mb-6">
            <Button
              variant={currentRole === 'student' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleSwitch('student')}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Student</span>
            </Button>
            <Button
              variant={currentRole === 'teacher' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleSwitch('teacher')}
              className="flex items-center space-x-2"
            >
              <UserCheck className="h-4 w-4" />
              <span>Teacher</span>
            </Button>
            <Button
              variant={currentRole === 'admin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRoleSwitch('admin')}
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Admin</span>
            </Button>
          </div>

          <Card className="border-border shadow-elegant backdrop-blur-sm">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription className="text-base">
                {isSignUp 
                  ? `Join as a ${currentRole} and start your journey`
                  : `Sign in to your ${currentRole} dashboard`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pl-10 pr-10 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-primary hover:opacity-90 transition-all duration-300 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in here'
                    : "Don't have an account? Create one here"
                  }
                </Button>
              </div>

              {!isSignUp && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Demo credentials:</p>
                  <div className="space-y-1 text-xs">
                    <p><strong>Email:</strong> demo@college.edu</p>
                    <p><strong>Password:</strong> demo123</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;