import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, BookOpen, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DemoCredentialsPanel = ({ onFillCredentials, isVisible = false }) => {
  const { toast } = useToast();

  const demoAccounts = [
    {
      role: 'student',
      icon: Users,
      email: 'student.demo@gmail.com',
      password: 'demo123',
      name: 'John Student',
      description: 'Access student dashboard with course materials, assignments, and grades',
      color: 'bg-blue-500'
    },
    {
      role: 'teacher',
      icon: UserCheck,
      email: 'teacher.demo@gmail.com',
      password: 'demo123',
      name: 'Sarah Professor',
      description: 'Manage courses, create assignments, grade students, and view analytics',
      color: 'bg-green-500'
    },
    {
      role: 'admin',
      icon: BookOpen,
      email: 'admin.demo@gmail.com',
      password: 'demo123',
      name: 'Admin User',
      description: 'Full system access, user management, and institutional oversight',
      color: 'bg-purple-500'
    }
  ];

  const handleFillCredentials = (email, password) => {
    onFillCredentials(email, password);
    toast({
      title: "Demo credentials filled",
      description: `Ready to sign in as ${email}`,
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: text,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="mb-6">
      <Card className="border-dashed">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Demo Accounts</span>
          </CardTitle>
          <CardDescription>
            Test the platform with pre-configured accounts for each role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {demoAccounts.map((account) => {
            const IconComponent = account.icon;
            return (
              <div
                key={account.role}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-md ${account.color} text-white`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{account.name}</h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {account.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {account.description}
                    </p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-mono bg-muted px-2 py-1 rounded">
                        {account.email}
                      </span>
                      <button
                        onClick={() => copyToClipboard(account.email)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFillCredentials(account.email, account.password)}
                  className="shrink-0"
                >
                  Use Account
                </Button>
              </div>
            );
          })}
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              All demo accounts use password: <code className="bg-muted px-1 rounded">demo123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoCredentialsPanel;