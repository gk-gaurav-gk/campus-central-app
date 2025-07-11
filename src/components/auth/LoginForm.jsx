import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, GraduationCap, Users, UserCheck, BookOpen, ArrowRight, Chrome, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="flex min-h-[600px]">
            
            {/* Left Panel - Welcome Back */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 text-center space-y-8 max-w-md">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <GraduationCap className="h-10 w-10" />
                  </div>
                  <h1 className="text-5xl font-bold">Welcome Back!</h1>
                  <p className="text-xl text-white/90 leading-relaxed">
                    To keep connected with us please login with your personal info
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setIsSignUp(false)}
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 px-8 py-3 rounded-full font-semibold"
                >
                  SIGN IN
                </Button>
              </div>
            </div>

            {/* Right Panel - Create Account */}
            <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-8">
                
                {/* Mobile Header */}
                <div className="lg:hidden text-center space-y-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">EduFlow</h1>
                </div>

                {/* Role Selector */}
                <div className="flex justify-center space-x-2 mb-6">
                  <Button
                    variant={currentRole === 'student' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onRoleSwitch('student')}
                    className="flex items-center space-x-2 rounded-full"
                  >
                    <Users className="h-4 w-4" />
                    <span>Student</span>
                  </Button>
                  <Button
                    variant={currentRole === 'teacher' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onRoleSwitch('teacher')}
                    className="flex items-center space-x-2 rounded-full"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Teacher</span>
                  </Button>
                  <Button
                    variant={currentRole === 'admin' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onRoleSwitch('admin')}
                    className="flex items-center space-x-2 rounded-full"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                </div>

                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-bold text-gray-800">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </h2>
                  
                  {/* Social Login Buttons */}
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="sm" className="w-12 h-12 rounded-full border-2 hover:scale-110 transition-transform">
                      <Facebook className="h-5 w-5 text-blue-600" />
                    </Button>
                    <Button variant="outline" size="sm" className="w-12 h-12 rounded-full border-2 hover:scale-110 transition-transform">
                      <Chrome className="h-5 w-5 text-red-500" />
                    </Button>
                    <Button variant="outline" size="sm" className="w-12 h-12 rounded-full border-2 hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </Button>
                  </div>
                  
                  <p className="text-gray-500 text-sm">
                    {isSignUp ? 'or use email for registration' : 'or use your email account'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Input
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-12 border-0 bg-gray-100 rounded-xl px-4 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-0 bg-gray-100 rounded-xl px-4 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="relative space-y-2">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-0 bg-gray-100 rounded-xl px-4 pr-12 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {isSignUp && (
                    <div className="space-y-2">
                      <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="h-12 border-0 bg-gray-100 rounded-xl px-4 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : (isSignUp ? 'SIGN UP' : 'SIGN IN')}
                  </Button>
                </form>

                {/* Toggle between Sign In / Sign Up */}
                <div className="text-center">
                  <p className="text-gray-600">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>

                {!isSignUp && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl text-center border border-blue-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Demo credentials:</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p><span className="font-semibold">Email:</span> demo@college.edu</p>
                      <p><span className="font-semibold">Password:</span> demo123</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;