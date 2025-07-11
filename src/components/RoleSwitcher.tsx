import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, BookOpen } from 'lucide-react';

const RoleSwitcher = ({ currentRole, onRoleChange }) => {
  const roles = [
    { value: 'student', label: 'Student', icon: Users, color: 'bg-blue-500' },
    { value: 'teacher', label: 'Teacher', icon: UserCheck, color: 'bg-green-500' },
    { value: 'admin', label: 'Admin', icon: BookOpen, color: 'bg-purple-500' }
  ];

  const currentRoleData = roles.find(role => role.value === currentRole);
  const IconComponent = currentRoleData?.icon || Users;

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-muted-foreground">Testing as:</span>
      <Select value={currentRole} onValueChange={onRoleChange}>
        <SelectTrigger className="w-36">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded ${currentRoleData?.color} text-white`}>
                <IconComponent className="h-3 w-3" />
              </div>
              <span className="text-sm">{currentRoleData?.label}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => {
            const RoleIcon = role.icon;
            return (
              <SelectItem key={role.value} value={role.value}>
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${role.color} text-white`}>
                    <RoleIcon className="h-3 w-3" />
                  </div>
                  <span>{role.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Badge variant="outline" className="text-xs">
        Demo Mode
      </Badge>
    </div>
  );
};

export default RoleSwitcher;