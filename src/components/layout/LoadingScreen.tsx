import React from 'react';
import { Loader2, GraduationCap } from 'lucide-react';

interface LoadingScreenProps {
  stage?: 'authentication' | 'profile' | 'general';
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  stage = 'general', 
  message 
}) => {
  const getStageMessage = () => {
    if (message) return message;
    
    switch (stage) {
      case 'authentication':
        return 'Verifying your credentials...';
      case 'profile':
        return 'Loading your profile...';
      default:
        return 'Loading EduFlow...';
    }
  };

  const getStageIcon = () => {
    switch (stage) {
      case 'authentication':
        return <Loader2 className="w-8 h-8 animate-spin text-primary" />;
      case 'profile':
        return <GraduationCap className="w-8 h-8 text-primary animate-pulse" />;
      default:
        return <Loader2 className="w-8 h-8 animate-spin text-primary" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          {getStageIcon()}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            EduFlow
          </h1>
          <p className="text-muted-foreground">
            {getStageMessage()}
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;