
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle, 
  AlertTriangle,
  Edit,
  Eye,
  FileText
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const AssignmentListItem = ({ assignment }) => {
  const dueDate = new Date(assignment.due_date);
  const daysUntilDue = differenceInDays(dueDate, new Date());
  
  const statusConfig = {
    pending: { color: 'bg-accent', text: 'Pending', icon: Clock },
    submitted: { color: 'bg-secondary', text: 'Submitted', icon: CheckCircle },
    overdue: { color: 'bg-destructive', text: 'Overdue', icon: AlertTriangle },
    draft: { color: 'bg-muted', text: 'Draft', icon: Edit }
  };

  const StatusIcon = statusConfig[assignment.status]?.icon || Clock;

  return (
    <Card className="glass-card hover-lift group">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {assignment.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {assignment.description}
                </p>
              </div>
              
              <Badge className={`${statusConfig[assignment.status]?.color} text-white border-0 shrink-0`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[assignment.status]?.text}
              </Badge>
            </div>
            
            <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{assignment.subject}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Due: {format(dueDate, 'MMM dd')}</span>
              </div>
              
              {daysUntilDue >= 0 && assignment.status !== 'submitted' && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className={daysUntilDue <= 1 ? 'text-destructive font-medium' : ''}>
                    {daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-accent" />
                <span>{assignment.points} pts</span>
              </div>

              {assignment.status === 'submitted' && assignment.grade && (
                <div className="flex items-center gap-1">
                  <span className="text-secondary font-medium">Grade: {assignment.grade}%</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <Button size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            {assignment.status !== 'submitted' && (
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                {assignment.status === 'draft' ? 'Continue' : 'Submit'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentListItem;
