import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Plus, 
  UserPlus, 
  Trash2,
  GraduationCap,
  User
} from 'lucide-react';

interface CourseGroup {
  id: string;
  name: string;
  description: string;
  group_type: string;
  max_members: number;
  member_count: number;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  batch: string;
  semester: number;
}

interface CourseGroupsProps {
  courseId: string;
}

const CourseGroups: React.FC<CourseGroupsProps> = ({ courseId }) => {
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [groups, setGroups] = useState<CourseGroup[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockGroups: CourseGroup[] = [
    {
      id: 'group1',
      name: 'CS301-A',
      description: 'Section A for Data Structures',
      group_type: 'section',
      max_members: 30,
      member_count: 15
    },
    {
      id: 'group2',
      name: 'CS301-B',
      description: 'Section B for Data Structures',
      group_type: 'section',
      max_members: 30,
      member_count: 12
    }
  ];

  const mockStudents: Student[] = [
    { id: '1', name: 'John Doe', rollNumber: 'CS2023001', email: 'john.doe@student.college.edu', department: 'Computer Science', batch: 'CS-A', semester: 3 },
    { id: '2', name: 'Jane Smith', rollNumber: 'CS2023002', email: 'jane.smith@student.college.edu', department: 'Computer Science', batch: 'CS-A', semester: 3 },
    { id: '3', name: 'Mike Johnson', rollNumber: 'CS2023003', email: 'mike.johnson@student.college.edu', department: 'Computer Science', batch: 'CS-B', semester: 3 },
    { id: '4', name: 'Sarah Wilson', rollNumber: 'EE2023001', email: 'sarah.wilson@student.college.edu', department: 'Electrical Engineering', batch: 'EE-A', semester: 3 },
    { id: '5', name: 'David Brown', rollNumber: 'EE2023002', email: 'david.brown@student.college.edu', department: 'Electrical Engineering', batch: 'EE-A', semester: 3 },
    { id: '6', name: 'Lisa Davis', rollNumber: 'ME2023001', email: 'lisa.davis@student.college.edu', department: 'Mechanical Engineering', batch: 'ME-A', semester: 3 },
    { id: '7', name: 'Alex Taylor', rollNumber: 'CS2022001', email: 'alex.taylor@student.college.edu', department: 'Computer Science', batch: 'CS-A', semester: 5 },
    { id: '8', name: 'Emma White', rollNumber: 'CS2022002', email: 'emma.white@student.college.edu', department: 'Computer Science', batch: 'CS-B', semester: 5 },
  ];

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load course groups from database
      const { data: groupsData, error: groupsError } = await supabase
        .from('course_groups')
        .select('*')
        .eq('course_id', courseId);

      if (groupsError) throw groupsError;

      // Transform database data to match our interface
      const transformedGroups = groupsData.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description || '',
        group_type: group.group_type,
        max_members: group.max_members || 30,
        member_count: 0 // Will be calculated from memberships
      }));

      setGroups(transformedGroups);
      
      // Using mock students for now - in a real app, you'd fetch enrolled students
      setStudents(mockStudents);
      setAvailableStudents(mockStudents.filter(student => !['1', '2', '3'].includes(student.id)));
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load groups and students',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (formData: FormData) => {
    try {
      const groupData = {
        course_id: courseId,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        group_type: formData.get('type') as string,
        max_members: parseInt(formData.get('maxMembers') as string)
      };

      const { data, error } = await supabase
        .from('course_groups')
        .insert(groupData)
        .select()
        .single();

      if (error) throw error;

      const newGroup = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        group_type: data.group_type,
        max_members: data.max_members || 30,
        member_count: 0
      };

      setGroups([...groups, newGroup]);
      setShowCreateGroup(false);
      
      toast({
        title: 'Success',
        description: 'Group created successfully',
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create group. Please check your permissions.',
        variant: 'destructive',
      });
    }
  };

  const handleAddStudentsToGroup = async (selectedStudentIds: string[]) => {
    try {
      // Mock implementation
      const updatedGroups = groups.map(group => 
        group.id === selectedGroup 
          ? { ...group, member_count: group.member_count + selectedStudentIds.length }
          : group
      );
      
      setGroups(updatedGroups);
      setShowAddStudents(false);
      setSelectedGroup('');
      
      toast({
        title: 'Success',
        description: `Added ${selectedStudentIds.length} students to group`,
      });
    } catch (error) {
      console.error('Error adding students:', error);
      toast({
        title: 'Error',
        description: 'Failed to add students to group',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded animate-pulse"></div>
        <div className="h-96 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Groups Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Groups</p>
                <p className="text-2xl font-bold">{groups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Group Size</p>
                <p className="text-2xl font-bold">
                  {groups.length > 0 ? Math.round(groups.reduce((sum, g) => sum + g.member_count, 0) / groups.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Groups Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Groups</CardTitle>
          {(currentRole === 'teacher' || currentRole === 'admin') && (
            <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleCreateGroup(formData);
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Group Name</Label>
                    <Input id="name" name="name" placeholder="e.g., CS301-A" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" placeholder="Group description" />
                  </div>
                  <div>
                    <Label htmlFor="type">Group Type</Label>
                    <Select name="type" defaultValue="section">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="section">Section</SelectItem>
                        <SelectItem value="lab">Lab Group</SelectItem>
                        <SelectItem value="tutorial">Tutorial Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxMembers">Max Members</Label>
                    <Input id="maxMembers" name="maxMembers" type="number" defaultValue="30" min="1" required />
                  </div>
                  <Button type="submit" className="w-full">Create Group</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No groups created</h3>
              <p className="text-muted-foreground">
                Create your first group to start organizing students
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <div 
                  key={group.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{group.name}</h4>
                      <Badge variant="outline">
                        {group.group_type}
                      </Badge>
                      <Badge variant="secondary">
                        {group.member_count}/{group.max_members} students
                      </Badge>
                    </div>
                    {group.description && (
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    )}
                  </div>
                  
                  {(currentRole === 'teacher' || currentRole === 'admin') && (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedGroup(group.id);
                          setShowAddStudents(true);
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Students
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Students Dialog */}
      <Dialog open={showAddStudents} onOpenChange={setShowAddStudents}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Students to Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              {availableStudents.map((student) => (
                <div 
                  key={student.id}
                  className="flex items-center justify-between p-3 border rounded-lg mb-2"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.rollNumber} • {student.department} • {student.batch}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddStudentsToGroup([student.id])}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseGroups;