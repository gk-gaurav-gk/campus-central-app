
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AuthFormFields = ({ 
  isSignUp, 
  formData, 
  showPassword, 
  onInputChange, 
  onTogglePassword 
}) => {
  return (
    <>
      {isSignUp && (
        <div>
          <Input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
          required
          className="h-12 border-border bg-background placeholder:text-muted-foreground pr-12"
        />
        <button
          type="button"
          onClick={onTogglePassword}
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
            onChange={onInputChange}
            required
            className="h-12 border-border bg-background placeholder:text-muted-foreground"
          />
        </div>
      )}
    </>
  );
};

export default AuthFormFields;
