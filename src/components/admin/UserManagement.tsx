import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Users, GraduationCap, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

interface UserManagementProps {
  onSelectionChange?: (selectedUsers: User[], role: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onSelectionChange }) => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [teachingAssistants, setTeachingAssistants] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  
  const [searchTerms, setSearchTerms] = useState({
    teachers: '',
    teaching_assistants: '',
    students: ''
  });
  
  const [selectedUsers, setSelectedUsers] = useState({
    teachers: new Set<string>(),
    teaching_assistants: new Set<string>(),
    students: new Set<string>()
  });
  
  const [currentPage, setCurrentPage] = useState({
    teachers: 1,
    teaching_assistants: 1,
    students: 1
  });

  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Load teachers
      const { data: teachersData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role, created_at')
        .eq('role', 'teacher')
        .order('first_name');

      // Load teaching assistants
      const { data: tasData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role, created_at')
        .eq('role', 'teaching_assistant' as any)
        .order('first_name');

      // Load students
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role, created_at')
        .eq('role', 'student')
        .order('first_name');

      setTeachers(teachersData || []);
      setTeachingAssistants(tasData || []);
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = (users: User[], searchTerm: string) => {
    if (!searchTerm) return users;
    
    return users.filter(user => 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const paginateUsers = (users: User[], page: number) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return users.slice(start, end);
  };

  const handleUserSelection = (userId: string, role: string, checked: boolean) => {
    setSelectedUsers(prev => {
      const newSelected = { ...prev };
      if (checked) {
        newSelected[role as keyof typeof newSelected].add(userId);
      } else {
        newSelected[role as keyof typeof newSelected].delete(userId);
      }
      
      // Notify parent component
      const roleMap = {
        teachers: teachers,
        teaching_assistants: teachingAssistants,
        students: students
      };
      
      const selectedUsersForRole = Array.from(newSelected[role as keyof typeof newSelected])
        .map(id => roleMap[role as keyof typeof roleMap].find(u => u.id === id))
        .filter(Boolean) as User[];
      
      onSelectionChange?.(selectedUsersForRole, role);
      
      return newSelected;
    });
  };

  const handleSelectAll = (role: string, users: User[]) => {
    setSelectedUsers(prev => {
      const newSelected = { ...prev };
      const currentSelected = newSelected[role as keyof typeof newSelected];
      
      if (currentSelected.size === users.length) {
        // Deselect all
        newSelected[role as keyof typeof newSelected] = new Set();
      } else {
        // Select all
        newSelected[role as keyof typeof newSelected] = new Set(users.map(u => u.id));
      }
      
      return newSelected;
    });
  };

  const renderUserTable = (users: User[], role: string, icon: React.ReactNode) => {
    const filteredUsers = filterUsers(users, searchTerms[role as keyof typeof searchTerms]);
    const currentPageUsers = paginateUsers(filteredUsers, currentPage[role as keyof typeof currentPage]);
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const selectedCount = selectedUsers[role as keyof typeof selectedUsers].size;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-semibold">
              {role === 'teachers' ? 'Teachers' : 
               role === 'teaching_assistants' ? 'Teaching Assistants' : 'Students'}
            </h3>
            <Badge variant="outline">{filteredUsers.length}</Badge>
            {selectedCount > 0 && (
              <Badge variant="default">{selectedCount} selected</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll(role, currentPageUsers)}
            >
              {selectedCount === currentPageUsers.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${role}...`}
            value={searchTerms[role as keyof typeof searchTerms]}
            onChange={(e) => setSearchTerms(prev => ({ ...prev, [role]: e.target.value }))}
            className="pl-10"
          />
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-3 bg-muted font-medium text-sm">
            <div className="col-span-1">Select</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Registered</div>
          </div>
          
          {currentPageUsers.map((user) => (
            <div key={user.id} className="grid grid-cols-12 gap-4 p-3 border-t hover:bg-muted/50">
              <div className="col-span-1">
                <Checkbox
                  checked={selectedUsers[role as keyof typeof selectedUsers].has(user.id)}
                  onCheckedChange={(checked) => handleUserSelection(user.id, role, checked as boolean)}
                />
              </div>
              <div className="col-span-3 font-medium">
                {user.first_name} {user.last_name}
              </div>
              <div className="col-span-4 text-muted-foreground">
                {user.email}
              </div>
              <div className="col-span-2">
                <Badge variant="outline">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage[role as keyof typeof currentPage] === 1}
              onClick={() => setCurrentPage(prev => ({ ...prev, [role]: prev[role as keyof typeof prev] - 1 }))}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage[role as keyof typeof currentPage]} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage[role as keyof typeof currentPage] === totalPages}
              onClick={() => setCurrentPage(prev => ({ ...prev, [role]: prev[role as keyof typeof prev] + 1 }))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="teachers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Teachers ({teachers.length})
            </TabsTrigger>
            <TabsTrigger value="teaching_assistants" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              TAs ({teachingAssistants.length})
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students ({students.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="teachers" className="mt-6">
            {renderUserTable(teachers, 'teachers', <GraduationCap className="h-5 w-5" />)}
          </TabsContent>
          
          <TabsContent value="teaching_assistants" className="mt-6">
            {renderUserTable(teachingAssistants, 'teaching_assistants', <UserCheck className="h-5 w-5" />)}
          </TabsContent>
          
          <TabsContent value="students" className="mt-6">
            {renderUserTable(students, 'students', <Users className="h-5 w-5" />)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};