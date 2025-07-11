
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AuthBackground from './AuthBackground';
import MobileHeader from './MobileHeader';
import CollegeBranchSelector from './CollegeBranchSelector';
import RoleSelector from './RoleSelector';
import GoogleSignInButton from './GoogleSignInButton';
import AuthFormFields from './AuthFormFields';
import AuthFormFooter from './AuthFormFooter';
import DemoCredentials from './DemoCredentials';

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

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex">
      <div className="flex w-full max-w-none">
        <AuthBackground />

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 bg-card flex flex-col justify-center">
          <div className="px-8 lg:px-16 py-12 max-w-md mx-auto w-full">
            <MobileHeader />

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp ? 'Join thousands of learners today' : 'Welcome back! Please sign in to continue'}
              </p>
            </div>

            <CollegeBranchSelector />
            <RoleSelector currentRole={currentRole} onRoleSwitch={onRoleSwitch} />
            <GoogleSignInButton />

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AuthFormFields
                isSignUp={isSignUp}
                formData={formData}
                showPassword={showPassword}
                onInputChange={handleInputChange}
                onTogglePassword={handleTogglePassword}
              />

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

            <AuthFormFooter isSignUp={isSignUp} onToggleMode={handleToggleMode} />
            <DemoCredentials isSignUp={isSignUp} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
