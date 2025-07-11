import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserCog, Send, CheckCircle } from 'lucide-react';

interface RoleChangeRequestProps {
  currentRole: string;
  userEmail: string;
  onClose?: () => void;
}

const RoleChangeRequest: React.FC<RoleChangeRequestProps> = ({
  currentRole,
  userEmail,
  onClose
}) => {
  const [requestedRole, setRequestedRole] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const roleOptions = [
    { value: 'teacher', label: 'Teacher/Instructor', description: 'Create and manage courses, assignments, and quizzes' },
    { value: 'admin', label: 'Administrator', description: 'Full system access and user management' },
  ].filter(role => role.value !== currentRole);

  const handleSubmit = async () => {
    if (!requestedRole || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a role and provide a reason for the request.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - in real app, this would send to admin/backend
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Request Submitted",
        description: "Your role change request has been sent to administrators for review.",
      });

      // Auto-close after showing success
      setTimeout(() => {
        onClose?.();
      }, 2000);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Request Submitted!</h3>
              <p className="text-sm text-muted-foreground">
                Administrators will review your request and respond via email.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="w-5 h-5" />
          Request Role Change
        </CardTitle>
        <div className="flex items-center gap-2 text-sm">
          <span>Current Role:</span>
          <Badge variant="secondary" className="capitalize">
            {currentRole}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Requested Role
          </label>
          <Select value={requestedRole} onValueChange={setRequestedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select the role you need" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  <div>
                    <div className="font-medium">{role.label}</div>
                    <div className="text-xs text-muted-foreground">{role.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Reason for Request
          </label>
          <Textarea
            placeholder="Please explain why you need this role change..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !requestedRole || !reason.trim()}
            className="flex-1"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit Request
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleChangeRequest;