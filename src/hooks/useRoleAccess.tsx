import { useRole } from '../contexts/RoleContext';

type UserRole = 'student' | 'teacher' | 'admin';
type Permission = {
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete';
};

// Comprehensive role-based permissions matrix matching educational platform requirements
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    // Academic & Curriculum Management
    { module: 'dashboard', action: 'view' },
    { module: 'timetable', action: 'view' },
    { module: 'syllabus', action: 'view' },
    { module: 'lesson_plans', action: 'view' },
    { module: 'learning_outcomes', action: 'view' },
    
    // Attendance & Assessment
    { module: 'attendance', action: 'view' },
    { module: 'attendance', action: 'create' }, // QR code scanning
    { module: 'quizzes', action: 'view' },
    { module: 'quizzes', action: 'create' }, // Taking quizzes
    { module: 'assignments', action: 'view' },
    { module: 'assignments', action: 'create' }, // Submitting assignments
    { module: 'plagiarism_checker', action: 'view' },
    { module: 'grades', action: 'view' },
    
    // Course Content & Groups
    { module: 'courses', action: 'view' },
    { module: 'course_groups', action: 'view' },
    { module: 'media_content', action: 'view' },
    { module: 'notifications', action: 'view' },
    
    // Student Services
    { module: 'profile', action: 'view' },
    { module: 'profile', action: 'edit' },
    { module: 'fees', action: 'view' },
    { module: 'chatbot', action: 'view' },
    { module: 'mentorship', action: 'view' },
    { module: 'transport', action: 'view' },
    { module: 'hostel', action: 'view' },
    
    // Communication & Collaboration
    { module: 'forums', action: 'view' },
    { module: 'forums', action: 'create' },
    { module: 'chat', action: 'view' },
    { module: 'chat', action: 'create' },
    { module: 'video_sessions', action: 'view' },
    { module: 'digital_noticeboard', action: 'view' },
    
    // Gamification & Innovation
    { module: 'gamification', action: 'view' },
    { module: 'virtual_currency', action: 'view' },
    { module: 'ar_campus_tour', action: 'view' },
  ],
  teacher: [
    // Academic & Curriculum Management
    { module: 'dashboard', action: 'view' },
    { module: 'timetable', action: 'view' },
    { module: 'syllabus', action: 'view' },
    { module: 'syllabus', action: 'create' },
    { module: 'syllabus', action: 'edit' },
    { module: 'lesson_plans', action: 'view' },
    { module: 'lesson_plans', action: 'create' },
    { module: 'lesson_plans', action: 'edit' },
    { module: 'learning_outcomes', action: 'view' },
    { module: 'learning_outcomes', action: 'edit' },
    
    // Attendance & Assessment
    { module: 'attendance', action: 'view' },
    { module: 'attendance', action: 'create' },
    { module: 'attendance', action: 'edit' },
    { module: 'qr_attendance', action: 'create' }, // Generate QR codes
    { module: 'quizzes', action: 'view' },
    { module: 'quizzes', action: 'create' },
    { module: 'quizzes', action: 'edit' },
    { module: 'assignments', action: 'view' },
    { module: 'assignments', action: 'create' },
    { module: 'assignments', action: 'edit' },
    { module: 'grading', action: 'view' },
    { module: 'grading', action: 'create' },
    { module: 'grading', action: 'edit' },
    { module: 'plagiarism_checker', action: 'view' },
    
    // Course Content & Groups
    { module: 'courses', action: 'view' },
    { module: 'courses', action: 'create' },
    { module: 'courses', action: 'edit' },
    { module: 'course_groups', action: 'view' },
    { module: 'course_groups', action: 'create' },
    { module: 'course_groups', action: 'edit' },
    { module: 'media_content', action: 'view' },
    { module: 'media_content', action: 'create' },
    { module: 'media_content', action: 'edit' },
    { module: 'notifications', action: 'view' },
    { module: 'notifications', action: 'create' },
    
    // Teacher Services
    { module: 'profile', action: 'view' },
    { module: 'profile', action: 'edit' },
    { module: 'chatbot', action: 'view' },
    { module: 'mentorship', action: 'view' },
    { module: 'mentorship', action: 'create' },
    
    // Communication & Collaboration
    { module: 'forums', action: 'view' },
    { module: 'forums', action: 'create' },
    { module: 'forums', action: 'edit' },
    { module: 'chat', action: 'view' },
    { module: 'chat', action: 'create' },
    { module: 'chat', action: 'edit' },
    { module: 'video_sessions', action: 'view' },
    { module: 'video_sessions', action: 'create' },
    { module: 'video_sessions', action: 'edit' },
    { module: 'digital_noticeboard', action: 'create' },
    
    // Analytics & Reporting
    { module: 'analytics', action: 'view' },
    { module: 'reports', action: 'view' },
    { module: 'reports', action: 'create' },
    
    // Gamification & Innovation
    { module: 'gamification', action: 'view' },
    { module: 'gamification', action: 'create' },
    { module: 'virtual_currency', action: 'view' },
    { module: 'virtual_currency', action: 'create' },
  ],
  admin: [
    // Full system access
    { module: '*', action: 'view' },
    { module: '*', action: 'create' },
    { module: '*', action: 'edit' },
    { module: '*', action: 'delete' },
    
    // Specific admin-only modules
    { module: 'user_management', action: 'view' },
    { module: 'user_management', action: 'create' },
    { module: 'user_management', action: 'edit' },
    { module: 'user_management', action: 'delete' },
    { module: 'system_config', action: 'view' },
    { module: 'system_config', action: 'edit' },
    { module: 'audit_logs', action: 'view' },
    { module: 'security_management', action: 'view' },
    { module: 'security_management', action: 'edit' },
    { module: 'api_management', action: 'view' },
    { module: 'api_management', action: 'edit' },
    { module: 'fee_management', action: 'view' },
    { module: 'fee_management', action: 'create' },
    { module: 'fee_management', action: 'edit' },
    { module: 'transport_management', action: 'view' },
    { module: 'transport_management', action: 'create' },
    { module: 'transport_management', action: 'edit' },
    { module: 'hostel_management', action: 'view' },
    { module: 'hostel_management', action: 'create' },
    { module: 'hostel_management', action: 'edit' },
    { module: 'inventory_management', action: 'view' },
    { module: 'inventory_management', action: 'create' },
    { module: 'inventory_management', action: 'edit' },
    { module: 'placement_management', action: 'view' },
    { module: 'placement_management', action: 'create' },
    { module: 'placement_management', action: 'edit' },
    { module: 'alumni_portal', action: 'view' },
    { module: 'alumni_portal', action: 'create' },
    { module: 'alumni_portal', action: 'edit' },
  ],
};

export const useRoleAccess = () => {
  const { currentRole, user } = useRole();
  
  // Get user role from context
  const userRole: UserRole = currentRole;

  const hasPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {

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

  // Context-aware permission methods
  const canManageOwnContent = (contentCreatorId: string, module: string, action: 'edit' | 'delete'): boolean => {
    if (userRole === 'admin') return true;
    if (userRole === 'teacher' && contentCreatorId === user?.id) {
      return hasPermission(module, action);
    }
    return false;
  };

  const canAccessCourse = (courseId: string, instructorId?: string): boolean => {
    if (userRole === 'admin') return true;
    if (userRole === 'teacher' && instructorId === user?.id) return true;
    if (userRole === 'student') return canAccess('courses'); // Students can view courses they're enrolled in
    return false;
  };

  const canGradeStudent = (courseInstructorId?: string): boolean => {
    if (userRole === 'admin') return true;
    if (userRole === 'teacher' && courseInstructorId === user?.id) {
      return hasPermission('grading', 'create');
    }
    return false;
  };

  const canCreateQRCode = (): boolean => {
    return hasPermission('qr_attendance', 'create');
  };

  const canSubmitAssignment = (): boolean => {
    return userRole === 'student' && hasPermission('assignments', 'create');
  };

  const canViewAnalytics = (scope: 'own' | 'all' = 'own'): boolean => {
    if (userRole === 'admin') return true;
    if (userRole === 'teacher' && scope === 'own') return hasPermission('analytics', 'view');
    return false;
  };

  const getAccessibleModules = (): string[] => {
    const permissions = ROLE_PERMISSIONS[userRole];
    const modules = new Set<string>();
    
    permissions.forEach(permission => {
      if (permission.action === 'view') {
        modules.add(permission.module);
      }
    });
    
    return Array.from(modules);
  };

  const getDashboardKPIs = () => {
    switch (userRole) {
      case 'student':
        return ['attendance', 'assignments', 'grades', 'virtual_currency'];
      case 'teacher':
        return ['classes', 'students', 'attendance_rate', 'pending_grades', 'quiz_analytics'];
      case 'admin':
        return ['total_users', 'system_health', 'active_courses', 'financial_overview'];
      default:
        return [];
    }
  };

  const getNavigationItems = () => {
    const items = [];
    
    if (canAccess('dashboard')) items.push({ name: 'Dashboard', path: '/', module: 'dashboard' });
    if (canAccess('courses')) items.push({ name: 'Courses', path: '/courses', module: 'courses' });
    if (canAccess('assignments')) items.push({ name: 'Assignments', path: '/assignments', module: 'assignments' });
    if (canAccess('quizzes')) items.push({ name: 'Quizzes', path: '/quizzes', module: 'quizzes' });
    if (canAccess('attendance')) items.push({ name: 'Attendance', path: '/attendance', module: 'attendance' });
    if (canAccess('grades')) items.push({ name: 'Grades', path: '/grades', module: 'grades' });
    if (canAccess('analytics') && userRole !== 'student') items.push({ name: 'Analytics', path: '/analytics', module: 'analytics' });
    if (canAccess('user_management') && userRole === 'admin') items.push({ name: 'User Management', path: '/admin/users', module: 'user_management' });
    
    return items;
  };

  const getPermissionSummary = () => {
    return {
      role: userRole,
      canCreateContent: canCreate('courses') || canCreate('assignments') || canCreate('quizzes'),
      canGrade: hasPermission('grading', 'create'),
      canManageUsers: hasPermission('user_management', 'edit'),
      canViewAnalytics: hasPermission('analytics', 'view'),
      canAccessFinances: hasPermission('fees', 'view') || hasPermission('fee_management', 'view'),
      isContentCreator: userRole === 'teacher' || userRole === 'admin',
      isSystemAdmin: userRole === 'admin',
    };
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
    // Context-aware methods
    canManageOwnContent,
    canAccessCourse,
    canGradeStudent,
    canCreateQRCode,
    canSubmitAssignment,
    canViewAnalytics,
    // Utility methods
    getAccessibleModules,
    getNavigationItems,
    getPermissionSummary,
  };
};