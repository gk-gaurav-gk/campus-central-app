
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Star, 
  CheckCircle, 
  AlertTriangle,
  Edit,
  Eye,
  Download
} from 'lucide-react';
import { format, isAfter, differenceInDays } from 'date-fns';

const AssignmentCard = ({ assignment }) => {
  const dueDate = new Date(assignment.due_date);
  const isOverdue = isAfter(new Date(), dueDate) && assignment.status !== 'submitted';
  const daysUntilDue = differenceInDays(dueDate, new Date());
  
  const statusConfig = {
    pending: { color: 'bg-accent', text: 'Pending', icon: Clock },
    submitted: { color: 'bg-secondary', text: 'Submitted', icon: CheckCircle },
    overdue: { color: 'bg-destructive', text: 'Overdue', icon: AlertTriangle },
    draft: { color: 'bg-muted', text: 'Draft', icon: Edit }
  };

  const priorityConfig = {
    high: { color: 'border-destructive bg-destructive/10 text-destructive', text: 'High Priority' },
    medium: { color: 'border-accent bg-accent/10 text-accent-foreground', text: 'Medium Priority' },
    low: { color: 'border-muted bg-muted/10 text-muted-foreground', text: 'Low Priority' }
  };

  const StatusIcon = statusConfig[assignment.status]?.icon || Clock;

  return (
    <Card className="glass-card hover-lift group transition-all duration-300 hover:shadow-glow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {assignment.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{assignment.subject}</p>
          </div>
          <Badge className={`${statusConfig[assignment.status]?.color} text-white border-0 shrink-0`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig[assignment.status]?.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {assignment.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {assignment.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due: {format(dueDate, 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="font-medium">{assignment.points} pts</span>
            </div>
          </div>

          {daysUntilDue >= 0 && assignment.status !== 'submitted' && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`${daysUntilDue <= 1 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                {daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>~{Math.round(assignment.estimated_time / 60)} hours</span>
            <Badge variant="outline" className="text-xs ml-auto">
              {assignment.difficulty}
            </Badge>
          </div>
        </div>

        {assignment.priority === 'high' && (
          <div className={`p-3 rounded-lg border ${priorityConfig[assignment.priority].color}`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{priorityConfig[assignment.priority].text}</span>
            </div>
          </div>
        )}

        {assignment.status === 'submitted' && assignment.grade && (
          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Grade: {assignment.grade}%</span>
              <Badge className="bg-secondary text-secondary-foreground">
                {assignment.grade >= 90 ? 'A' : assignment.grade >= 80 ? 'B' : assignment.grade >= 70 ? 'C' : 'D'}
              </Badge>
            </div>
            {assignment.feedback && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {assignment.feedback}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {assignment.status !== 'submitted' && (
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              {assignment.status === 'draft' ? 'Continue' : 'Submit'}
            </Button>
          )}
          {assignment.attachments?.length > 0 && (
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
