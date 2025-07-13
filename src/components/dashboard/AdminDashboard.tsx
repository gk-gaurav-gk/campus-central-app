import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Calendar,
  TrendingUp,
  Users,
  Database,
  Shield,
  Clock,
  Settings,
  ChevronRight,
  UserPlus,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Server,
  Activity,
  FileText,
  Bell,
  Globe
} from 'lucide-react';
import MiniCalendar from './widgets/MiniCalendar';
import NotificationBell from './widgets/NotificationBell';

const AdminDashboard = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Admin-specific mock data
  const adminData = {
    systemHealth: {
      uptime: 99.9,
      activeUsers: 1247,
      storageUsed: 78,
      serverLoad: 42
    },
    userStats: {
      totalUsers: 1247,
      newThisWeek: 23,
      activeToday: 892,
      totalStudents: 1089,
      totalTeachers: 147,
      totalAdmins: 11
    },
    financialOverview: {
      monthlyRevenue: 125000,
      pendingPayments: 15600,
      collectedFees: 89.5,
      outstandingAmount: 23400
    },
    securityAlerts: [
      { type: 'info', message: 'System backup completed successfully', time: '2 hours ago' },
      { type: 'warning', message: '3 failed login attempts detected', time: '4 hours ago' },
      { type: 'success', message: 'Security patch applied', time: '1 day ago' }
    ],
    recentActivities: [
      { user: 'John Smith', action: 'Created new course', time: '10 mins ago', type: 'course' },
      { user: 'Sarah Johnson', action: 'Updated user permissions', time: '1 hour ago', type: 'user' },
      { user: 'Mike Davis', action: 'Generated system report', time: '2 hours ago', type: 'report' },
      { user: 'System', action: 'Automated backup completed', time: '3 hours ago', type: 'system' }
    ]
  };

  const quickActions = [
    { icon: UserPlus, label: 'Manage Users', color: 'text-primary', action: '/admin/users' },
    { icon: BarChart3, label: 'System Reports', color: 'text-secondary', action: '/admin/reports' },
    { icon: DollarSign, label: 'Fee Management', color: 'text-coral', action: '/admin/fees' },
    { icon: Shield, label: 'Security Audit', color: 'text-pink', action: '/admin/security' }
  ];

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'text-orange-500';
      case 'success': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-comfortaa font-bold bg-gradient-primary bg-clip-text text-transparent">
            System Overview, {user?.name?.split(' ')[0] || 'Admin'}! ⚙️
          </h1>
          <p className="text-muted-foreground mt-2 font-inter">
            Monitoring {adminData.userStats.totalUsers} users across the platform. System running at {adminData.systemHealth.uptime}% uptime.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users, courses, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 glass-card"
            />
          </div>
          <NotificationBell />
        </div>
      </div>

      {/* System Health KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="glass-card hover-float">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold">{adminData.userStats.activeToday}</p>
                <p className="text-xs text-secondary">
                  +{adminData.userStats.newThisWeek} this week
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-float">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-3xl font-bold">{adminData.systemHealth.uptime}%</p>
                <p className="text-xs text-secondary">
                  Excellent performance
                </p>
              </div>
              <Server className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-float">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue (Month)</p>
                <p className="text-3xl font-bold">${(adminData.financialOverview.monthlyRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-coral">
                  {adminData.financialOverview.collectedFees}% collected
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-coral" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-float">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                <p className="text-3xl font-bold">{adminData.systemHealth.storageUsed}%</p>
                <p className="text-xs text-pink">
                  {100 - adminData.systemHealth.storageUsed}% available
                </p>
              </div>
              <Database className="h-8 w-8 text-pink" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Analytics */}
        <Card className="lg:col-span-2 glass-card hover-float">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-comfortaa flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  User Analytics
                </CardTitle>
                <CardDescription>Platform usage and demographics</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-glass border border-primary/10">
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-bold text-primary">{adminData.userStats.totalStudents}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-glass border border-primary/10">
                <p className="text-sm text-muted-foreground">Teachers</p>
                <p className="text-2xl font-bold text-secondary">{adminData.userStats.totalTeachers}</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-glass border border-primary/10">
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-coral">{adminData.userStats.totalAdmins}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Server Load</span>
                <span>{adminData.systemHealth.serverLoad}%</span>
              </div>
              <Progress value={adminData.systemHealth.serverLoad} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Mini Calendar */}
        <MiniCalendar />
      </div>

      {/* Security & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Alerts */}
        <Card className="glass-card hover-float">
          <CardHeader>
            <CardTitle className="font-comfortaa flex items-center gap-2">
              <Shield className="h-5 w-5 text-pink" />
              Security Alerts
            </CardTitle>
            <CardDescription>Recent security events and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminData.securityAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-gradient-glass border border-primary/10"
              >
                <div className={`mt-1 ${getAlertColor(alert.type)}`}>
                  {alert.type === 'success' && <CheckCircle className="h-4 w-4" />}
                  {alert.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                  {alert.type === 'info' && <Bell className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="glass-card hover-float">
          <CardHeader>
            <CardTitle className="font-comfortaa flex items-center gap-2">
              <Globe className="h-5 w-5 text-secondary" />
              Recent Activities
            </CardTitle>
            <CardDescription>System-wide user activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminData.recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-gradient-glass border border-primary/10"
              >
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card hover-float">
        <CardHeader>
          <CardTitle className="font-comfortaa">Administrative Actions</CardTitle>
          <CardDescription>Manage system operations and configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col gap-2 hover-lift group border-primary/20 hover:border-primary/40"
              >
                <action.icon className={`h-6 w-6 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;