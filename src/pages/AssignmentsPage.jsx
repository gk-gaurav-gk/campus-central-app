
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AssignmentHeader from '@/components/assignments/AssignmentHeader';
import AssignmentFilters from '@/components/assignments/AssignmentFilters';
import AssignmentGrid from '@/components/assignments/AssignmentGrid';
import AssignmentCalendar from '@/components/assignments/AssignmentCalendar';
import AssignmentStats from '@/components/assignments/AssignmentStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AssignmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [sortBy, setSortBy] = useState('due_date');
  const [viewMode, setViewMode] = useState('grid');

  // Mock data for assignments - in real app, this would come from Supabase
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      // Mock data for demonstration
      return [
        {
          id: '1',
          title: 'React Components Deep Dive',
          description: 'Build a comprehensive dashboard using React components with proper state management and responsive design.',
          subject: 'Web Development',
          due_date: '2025-01-15T23:59:00Z',
          status: 'pending',
          priority: 'high',
          points: 100,
          submitted_at: null,
          grade: null,
          feedback: null,
          attachments: ['starter-code.zip'],
          estimated_time: 180,
          difficulty: 'intermediate',
          tags: ['react', 'components', 'state-management']
        },
        {
          id: '2',
          title: 'Database Design Project',
          description: 'Design and implement a normalized database schema for a library management system.',
          subject: 'Database Systems',
          due_date: '2025-01-20T23:59:00Z',
          status: 'submitted',
          priority: 'medium',
          points: 150,
          submitted_at: '2025-01-10T14:30:00Z',
          grade: 85,
          feedback: 'Great work on normalization! Consider adding indexes for better performance.',
          attachments: ['db-schema.sql', 'documentation.pdf'],
          estimated_time: 240,
          difficulty: 'advanced',
          tags: ['database', 'sql', 'normalization']
        },
        {
          id: '3',
          title: 'Algorithm Analysis Report',
          description: 'Analyze time and space complexity of various sorting algorithms with practical implementations.',
          subject: 'Algorithms',
          due_date: '2025-01-12T23:59:00Z',
          status: 'overdue',
          priority: 'high',
          points: 75,
          submitted_at: null,
          grade: null,
          feedback: null,
          attachments: ['algorithm-template.docx'],
          estimated_time: 120,
          difficulty: 'intermediate',
          tags: ['algorithms', 'complexity', 'analysis']
        },
        {
          id: '4',
          title: 'UI/UX Case Study',
          description: 'Conduct a comprehensive UX audit of a mobile application and propose improvements.',
          subject: 'Design',
          due_date: '2025-01-25T23:59:00Z',
          status: 'draft',
          priority: 'medium',
          points: 120,
          submitted_at: null,
          grade: null,
          feedback: null,
          attachments: ['case-study-template.figma'],
          estimated_time: 300,
          difficulty: 'intermediate',
          tags: ['ux', 'design', 'mobile']
        }
      ];
    }
  });

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    switch (sortBy) {
      case 'due_date':
        return new Date(a.due_date) - new Date(b.due_date);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'subject':
        return a.subject.localeCompare(b.subject);
      case 'points':
        return b.points - a.points;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <AssignmentHeader />
        
        <AssignmentStats assignments={assignments} />
        
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <TabsList className="grid w-full sm:w-auto grid-cols-2 lg:grid-cols-3">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Grid View
                  </TabsTrigger>
                  <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    List View
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Calendar
                  </TabsTrigger>
                </TabsList>
                
                <AssignmentFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  filterSubject={filterSubject}
                  setFilterSubject={setFilterSubject}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </div>

              <TabsContent value="grid" className="mt-0">
                <AssignmentGrid assignments={sortedAssignments} />
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <AssignmentGrid assignments={sortedAssignments} viewMode="list" />
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0">
                <AssignmentCalendar assignments={assignments} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AssignmentsPage;
