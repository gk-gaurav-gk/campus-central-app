
import React from 'react';

const AuthFormFooter = ({ isSignUp, onToggleMode }) => {
  return (
    <div className="text-center mt-6">
      <p className="text-muted-foreground">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          type="button"
          onClick={onToggleMode}
          className="ml-2 text-primary hover:underline font-medium"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default AuthFormFooter;
