
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, GraduationCap, Users, UserCheck, BookOpen, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import DemoCredentialsPanel from './DemoCredentialsPanel';
import loginBg from '@/assets/login-bg.jpg';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [suggestedRole, setSuggestedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    college: 'main-campus',
    department: '',
    studentId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValidation, setEmailValidation] = useState({ isValid: false, message: '' });
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  // Smart role detection based on email domain
  const detectRoleFromEmail = (email) => {
    if (!email || !email.includes('@')) return null;
    
    const domain = email.toLowerCase();
    
    // Admin patterns
    if (domain.includes('@admin.') || 
        domain.includes('@admin.college.edu') || 
        domain.includes('@staff.') ||
        domain.includes('@management.')) {
      return 'admin';
    }
    
    // Teacher patterns
    if (domain.includes('@faculty.') || 
        domain.includes('@teacher.') || 
        domain.includes('@faculty.college.edu') ||
        domain.includes('@prof.') ||
        domain.includes('@instructor.')) {
      return 'teacher';
    }
    
    // Student patterns
    if (domain.includes('@student.') || 
        domain.includes('@student.college.edu') ||
        domain.includes('@stu.') ||
        domain.includes('@alumni.')) {
      return 'student';
    }
    
    // Default to student for unknown domains
    return 'student';
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    const detectedRole = detectRoleFromEmail(email);
    if (detectedRole) {
      return { 
        isValid: true, 
        message: `Detected ${detectedRole} role from your email domain`,
        detectedRole 
      };
    }
    
    return { isValid: true, message: 'Email looks good!' };
  };

  // Real-time email validation
  useEffect(() => {
    if (formData.email) {
      const validation = validateEmail(formData.email);
      setEmailValidation(validation);
      
      if (validation.detectedRole && isSignUp) {
        setSuggestedRole(validation.detectedRole);
        setSelectedRole(validation.detectedRole);
      }
    } else {
      setEmailValidation({ isValid: false, message: '' });
      setSuggestedRole(null);
    }
  }, [formData.email, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: selectedRole,
        });
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle demo credentials filling
  const handleFillDemoCredentials = (email, password) => {
    setFormData({
      ...formData,
      email,
      password
    });
    setShowDemoCredentials(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Role descriptions for tooltips
  const getRoleDescription = (role) => {
    const descriptions = {
      student: {
        title: 'Student Access',
        description: 'View courses, submit assignments, take quizzes, track attendance, access learning materials, participate in discussions',
        capabilities: ['📚 Course Materials', '📝 Assignment Submission', '🎯 Quiz Taking', '📊 Grade Tracking', '💬 Discussion Forums']
      },
      teacher: {
        title: 'Teacher Access', 
        description: 'Create courses, manage students, grade assignments, conduct classes, generate reports, mentor students',
        capabilities: ['🎓 Course Creation', '📋 Student Management', '✅ Grading & Assessment', '📹 Video Classes', '📈 Analytics Dashboard']
      },
      admin: {
        title: 'Admin Access',
        description: 'Full system access, user management, system configuration, advanced analytics, institutional oversight',
        capabilities: ['👥 User Management', '⚙️ System Configuration', '📊 Advanced Analytics', '🏛️ Institution Management', '🔒 Security Controls']
      }
    };
    return descriptions[role] || descriptions.student;
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      return;
    }
    
    try {
      await resetPassword(formData.email);
    } catch (error) {
      console.error('Password reset error:', error);
    }
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

            {/* Demo Credentials Panel - Only shown during sign in */}
            {!isSignUp && (
              <DemoCredentialsPanel 
                isVisible={showDemoCredentials}
                onFillCredentials={handleFillDemoCredentials}
              />
            )}

            {/* College/Branch Selector */}
            <div className="mb-6">
              <Select value={formData.college} onValueChange={(value) => setFormData({...formData, college: value})}>
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

            {/* Role Selector - Enhanced with descriptions and auto-detection */}
            {isSignUp && (
              <div className="mb-8">
                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <h3 className="text-sm font-medium text-foreground">Select Your Role</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Role will be auto-detected from your email domain</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  {suggestedRole && (
                    <Alert className="mb-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Based on your email domain, we suggest the <strong>{suggestedRole}</strong> role.
                        {suggestedRole !== selectedRole && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="ml-2 p-0 h-auto"
                            onClick={() => setSelectedRole(suggestedRole)}
                            type="button"
                          >
                            Use suggested role
                          </Button>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="space-y-3">
                  <TooltipProvider>
                    <div className="grid grid-cols-1 gap-3">
                      {['student', 'teacher', 'admin'].map((role) => {
                        const roleInfo = getRoleDescription(role);
                        const isSelected = selectedRole === role;
                        const isSuggested = suggestedRole === role;
                        
                        return (
                          <Tooltip key={role}>
                            <TooltipTrigger asChild>
                              <div
                                className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'border-primary bg-primary/10' 
                                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                }`}
                                onClick={() => setSelectedRole(role)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-md ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                      {role === 'student' && <Users className="h-4 w-4" />}
                                      {role === 'teacher' && <UserCheck className="h-4 w-4" />}
                                      {role === 'admin' && <BookOpen className="h-4 w-4" />}
                                    </div>
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <h4 className="font-medium text-foreground capitalize">{role}</h4>
                                        {isSuggested && (
                                          <Badge variant="secondary" className="text-xs">
                                            Suggested
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground">{roleInfo.description}</p>
                                    </div>
                                  </div>
                                  <div className={`w-4 h-4 rounded-full border-2 ${
                                    isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                                  }`}>
                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                                  </div>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <div className="space-y-2">
                                <h4 className="font-medium">{roleInfo.title}</h4>
                                <div className="space-y-1">
                                  {roleInfo.capabilities.map((cap, idx) => (
                                    <div key={idx} className="text-xs">{cap}</div>
                                  ))}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            )}

            {/* Google Sign In Button */}
            <Button 
              variant="outline" 
              className="w-full h-12 mb-6 border-border hover:bg-muted"
              onClick={handleGoogleSignIn}
              type="button"
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
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-border bg-background placeholder:text-muted-foreground"
                    />
                    <Input
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-border bg-background placeholder:text-muted-foreground"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address (e.g., john@student.college.edu)"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`h-12 bg-background placeholder:text-muted-foreground pr-10 ${
                      formData.email 
                        ? emailValidation.isValid 
                          ? 'border-green-500' 
                          : 'border-red-500'
                        : 'border-border'
                    }`}
                  />
                  {formData.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailValidation.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {formData.email && emailValidation.message && (
                  <p className={`text-xs ${emailValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {emailValidation.message}
                  </p>
                )}
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
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-border bg-background placeholder:text-muted-foreground pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              )}

              {/* Additional fields based on role */}
              {isSignUp && (selectedRole === 'teacher' || selectedRole === 'admin') && (
                <div>
                  <Input
                    name="department"
                    type="text"
                    placeholder="Department (optional)"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="h-12 border-border bg-background placeholder:text-muted-foreground"
                  />
                </div>
              )}

              {isSignUp && selectedRole === 'student' && (
                <div>
                  <Input
                    name="studentId"
                    type="text"
                    placeholder="Student ID (optional)"
                    value={formData.studentId}
                    onChange={handleInputChange}
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
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-primary hover:underline"
                  >
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

            <div className="text-center mt-6 space-y-4">
              <p className="text-muted-foreground">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setShowDemoCredentials(!isSignUp);
                  }}
                  className="ml-2 text-primary hover:underline font-medium"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
              
              {!isSignUp && !showDemoCredentials && (
                <button
                  type="button"
                  onClick={() => setShowDemoCredentials(true)}
                  className="text-sm text-muted-foreground hover:text-primary underline"
                >
                  Show demo accounts
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
