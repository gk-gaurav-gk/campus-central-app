import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/contexts/RoleContext';
import { 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Upload,
  Eye
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  submittedCount: number;
  totalStudents: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: number;
}

interface CourseAssignmentsProps {
  courseId: string;
}

const CourseAssignments: React.FC<CourseAssignmentsProps> = ({ courseId }) => {
  const { currentRole } = useRole();
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'React Component Architecture',
      description: 'Design and implement a reusable component library with proper documentation',
      dueDate: '2024-01-25',
      totalMarks: 100,
      submittedCount: 15,
      totalStudents: 25,
      status: 'pending'
    },
    {
      id: '2',
      title: 'State Management Project',
      description: 'Build a todo app using React with Redux for state management',
      dueDate: '2024-01-20',
      totalMarks: 75,
      submittedCount: 23,
      totalStudents: 25,
      status: 'submitted',
      grade: 85
    },
    {
      id: '3',
      title: 'API Integration Assignment',
      description: 'Create a weather app that fetches data from external APIs',
      dueDate: '2024-01-15',
      totalMarks: 50,
      submittedCount: 25,
      totalStudents: 25,
      status: 'graded',
      grade: 92
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'submitted':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'graded':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Assignments</CardTitle>
          {(currentRole === 'teacher' || currentRole === 'admin') && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No assignments available</h3>
              <p className="text-muted-foreground">
                {currentRole === 'teacher' 
                  ? 'Create your first assignment to get started.' 
                  : 'No assignments have been created yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{assignment.title}</h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(assignment.status)}
                            <Badge className={getStatusColor(assignment.status)}>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">{assignment.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {assignment.dueDate}</span>
                            <span className="text-primary font-medium">
                              ({getDaysUntilDue(assignment.dueDate)})
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>Total Marks: {assignment.totalMarks}</span>
                          </div>
                          
                          {currentRole !== 'student' && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>
                                {assignment.submittedCount}/{assignment.totalStudents} submitted
                              </span>
                            </div>
                          )}
                          
                          {currentRole === 'student' && assignment.grade && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 font-medium">
                                Grade: {assignment.grade}/{assignment.totalMarks}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {currentRole === 'student' ? (
                          assignment.status === 'pending' ? (
                            <Button>
                              <Upload className="w-4 h-4 mr-2" />
                              Submit
                            </Button>
                          ) : (
                            <Button variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Submission
                            </Button>
                          )
                        ) : (
                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button>
                              <Users className="w-4 h-4 mr-2" />
                              Grade Submissions
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseAssignments;