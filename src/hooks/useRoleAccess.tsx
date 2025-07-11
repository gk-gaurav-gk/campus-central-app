import { useAuth } from './useAuth';

type UserRole = 'student' | 'teacher' | 'admin';
type Permission = {
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete';
};

// Role-based permissions matrix
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    { module: 'dashboard', action: 'view' },
    { module: 'attendance', action: 'view' },
    { module: 'courses', action: 'view' },
    { module: 'assignments', action: 'view' },
    { module: 'quizzes', action: 'view' },
    { module: 'profile', action: 'view' },
    { module: 'profile', action: 'edit' },
    { module: 'notifications', action: 'view' },
    { module: 'video_sessions', action: 'view' },
    { module: 'forums', action: 'view' },
    { module: 'forums', action: 'create' },
    { module: 'chat', action: 'view' },
    { module: 'chat', action: 'create' },
  ],
  teacher: [
    { module: 'dashboard', action: 'view' },
    { module: 'attendance', action: 'view' },
    { module: 'attendance', action: 'create' },
    { module: 'attendance', action: 'edit' },
    { module: 'courses', action: 'view' },
    { module: 'courses', action: 'create' },
    { module: 'courses', action: 'edit' },
    { module: 'assignments', action: 'view' },
    { module: 'assignments', action: 'create' },
    { module: 'assignments', action: 'edit' },
    { module: 'quizzes', action: 'view' },
    { module: 'quizzes', action: 'create' },
    { module: 'quizzes', action: 'edit' },
    { module: 'profile', action: 'view' },
    { module: 'profile', action: 'edit' },
    { module: 'notifications', action: 'view' },
    { module: 'notifications', action: 'create' },
    { module: 'video_sessions', action: 'view' },
    { module: 'video_sessions', action: 'create' },
    { module: 'video_sessions', action: 'edit' },
    { module: 'forums', action: 'view' },
    { module: 'forums', action: 'create' },
    { module: 'forums', action: 'edit' },
    { module: 'chat', action: 'view' },
    { module: 'chat', action: 'create' },
    { module: 'chat', action: 'edit' },
  ],
  admin: [
    { module: '*', action: 'view' },
    { module: '*', action: 'create' },
    { module: '*', action: 'edit' },
    { module: '*', action: 'delete' },
  ],
};

export const useRoleAccess = () => {
  const { profile } = useAuth();
  const userRole = profile?.role as UserRole;

  const hasPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
      return false;
    }

    const permissions = ROLE_PERMISSIONS[userRole];
    
    // Admin has all permissions
    if (userRole === 'admin') {
      return true;
    }

    // Check specific permissions
    return permissions.some(
      (permission) =>
        (permission.module === module || permission.module === '*') &&
        permission.action === action
    );
  };

  const canAccess = (module: string): boolean => {
    return hasPermission(module, 'view');
  };

  const canCreate = (module: string): boolean => {
    return hasPermission(module, 'create');
  };

  const canEdit = (module: string): boolean => {
    return hasPermission(module, 'edit');
  };

  const canDelete = (module: string): boolean => {
    return hasPermission(module, 'delete');
  };

  const isStudent = (): boolean => userRole === 'student';
  const isTeacher = (): boolean => userRole === 'teacher';
  const isAdmin = (): boolean => userRole === 'admin';

  const getRoleBadgeColor = (): string => {
    switch (userRole) {
      case 'admin':
        return 'bg-destructive text-destructive-foreground';
      case 'teacher':
        return 'bg-primary text-primary-foreground';
      case 'student':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDashboardKPIs = () => {
    switch (userRole) {
      case 'student':
        return ['attendance', 'assignments', 'grades', 'points'];
      case 'teacher':
        return ['classes', 'students', 'attendance_rate', 'pending_grades'];
      case 'admin':
        return ['total_users', 'system_health', 'revenue', 'active_courses'];
      default:
        return [];
    }
  };

  return {
    userRole,
    hasPermission,
    canAccess,
    canCreate,
    canEdit,
    canDelete,
    isStudent,
    isTeacher,
    isAdmin,
    getRoleBadgeColor,
    getDashboardKPIs,
  };
};