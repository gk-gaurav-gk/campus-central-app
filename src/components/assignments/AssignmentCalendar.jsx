
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

const AssignmentCalendar = ({ assignments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  const getAssignmentsForDay = (day) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.due_date), day)
    );
  };

  const statusColors = {
    pending: 'bg-accent',
    submitted: 'bg-secondary',
    overdue: 'bg-destructive',
    draft: 'bg-muted'
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Assignment Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold min-w-32 text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((day) => {
            const dayAssignments = getAssignmentsForDay(day);
            const hasAssignments = dayAssignments.length > 0;
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-24 p-1 border rounded-lg transition-colors
                  ${isSameMonth(day, currentDate) ? 'bg-background' : 'bg-muted/50'}
                  ${isToday(day) ? 'ring-2 ring-primary' : ''}
                  ${hasAssignments ? 'border-primary' : 'border-border'}
                  hover:bg-muted/50
                `}
              >
                <div className="text-sm font-medium mb-1">
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayAssignments.slice(0, 2).map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`
                        text-xs p-1 rounded text-white truncate
                        ${statusColors[assignment.status] || 'bg-muted'}
                      `}
                      title={assignment.title}
                    >
                      {assignment.title}
                    </div>
                  ))}
                  
                  {dayAssignments.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayAssignments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-accent"></div>
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-secondary"></div>
            <span className="text-sm">Submitted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive"></div>
            <span className="text-sm">Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted"></div>
            <span className="text-sm">Draft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentCalendar;
