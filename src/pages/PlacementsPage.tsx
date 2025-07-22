
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRole } from '@/contexts/RoleContext';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Building2, 
  MapPin, 
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Filter
} from 'lucide-react';

interface PlacementDrive {
  id: string;
  companyName: string;
  companyLogo?: string;
  jobTitle: string;
  location: string;
  salary: {
    min: number;
    max: number;
  };
  type: 'full_time' | 'internship' | 'part_time';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  applicationDeadline: string;
  interviewDate: string;
  requirements: string[];
  description: string;
  totalPositions: number;
  appliedCount: number;
  selectedCount: number;
}

interface PlacementRecord {
  id: string;
  studentName: string;
  rollNumber: string;
  companyName: string;
  jobTitle: string;
  package: number;
  placementDate: string;
  department: string;
  type: 'campus' | 'off_campus';
}

const PlacementsPage = () => {
  const { currentRole } = useRole();
  const [activeTab, setActiveTab] = useState<'drives' | 'records' | 'stats'>('drives');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Mock placement drives data
  const [drives] = useState<PlacementDrive[]>([
    {
      id: '1',
      companyName: 'Google',
      jobTitle: 'Software Engineer',
      location: 'Bangalore, India',
      salary: { min: 1800000, max: 2500000 },
      type: 'full_time',
      status: 'ongoing',
      applicationDeadline: '2024-02-15',
      interviewDate: '2024-02-20',
      requirements: ['B.Tech/M.Tech in CS/IT', '3.5+ CGPA', 'Strong coding skills'],
      description: 'Join Google as a Software Engineer and work on cutting-edge technologies.',
      totalPositions: 15,
      appliedCount: 120,
      selectedCount: 8
    },
    {
      id: '2',
      companyName: 'Microsoft',
      jobTitle: 'Product Manager',
      location: 'Hyderabad, India',
      salary: { min: 2000000, max: 2800000 },
      type: 'full_time',
      status: 'upcoming',
      applicationDeadline: '2024-02-20',
      interviewDate: '2024-02-25',
      requirements: ['MBA/B.Tech', '3.0+ CGPA', 'Leadership experience'],
      description: 'Drive product strategy and execution for Microsoft products.',
      totalPositions: 10,
      appliedCount: 85,
      selectedCount: 0
    },
    {
      id: '3',
      companyName: 'Amazon',
      jobTitle: 'Data Scientist',
      location: 'Mumbai, India',
      salary: { min: 1600000, max: 2200000 },
      type: 'full_time',
      status: 'completed',
      applicationDeadline: '2024-01-30',
      interviewDate: '2024-02-05',
      requirements: ['M.Tech/PhD in relevant field', '3.7+ CGPA', 'ML/AI expertise'],
      description: 'Analyze large datasets to drive business decisions at Amazon.',
      totalPositions: 8,
      appliedCount: 95,
      selectedCount: 6
    },
    {
      id: '4',
      companyName: 'Goldman Sachs',
      jobTitle: 'Summer Intern',
      location: 'Bangalore, India',
      salary: { min: 80000, max: 100000 },
      type: 'internship',
      status: 'upcoming',
      applicationDeadline: '2024-02-25',
      interviewDate: '2024-03-01',
      requirements: ['3rd year students', '3.5+ CGPA', 'Finance/CS background'],
      description: '10-week summer internship program in technology division.',
      totalPositions: 20,
      appliedCount: 45,
      selectedCount: 0
    }
  ]);

  // Mock placement records data
  const [records] = useState<PlacementRecord[]>([
    {
      id: '1',
      studentName: 'John Doe',
      rollNumber: 'CS2021001',
      companyName: 'Google',
      jobTitle: 'Software Engineer',
      package: 2200000,
      placementDate: '2024-01-15',
      department: 'Computer Science',
      type: 'campus'
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      rollNumber: 'IT2021005',
      companyName: 'Microsoft',
      jobTitle: 'Software Development Engineer',
      package: 2400000,
      placementDate: '2024-01-20',
      department: 'Information Technology',
      type: 'campus'
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      rollNumber: 'EC2021012',
      companyName: 'Amazon',
      jobTitle: 'Data Scientist',
      package: 1900000,
      placementDate: '2024-01-25',
      department: 'Electronics',
      type: 'campus'
    },
    {
      id: '4',
      studentName: 'Sarah Wilson',
      rollNumber: 'CS2021018',
      companyName: 'Apple',
      jobTitle: 'iOS Developer',
      package: 2600000,
      placementDate: '2024-02-01',
      department: 'Computer Science',
      type: 'off_campus'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full_time':
        return 'bg-blue-100 text-blue-800';
      case 'internship':
        return 'bg-purple-100 text-purple-800';
      case 'part_time':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const filteredDrives = drives.filter(drive => {
    const matchesSearch = drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || drive.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredRecords = records.filter(record => {
    return record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Placement statistics
  const stats = {
    totalPlacements: records.length,
    averagePackage: records.reduce((sum, record) => sum + record.package, 0) / records.length,
    highestPackage: Math.max(...records.map(r => r.package)),
    placementRate: 85, // Mock percentage
    topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Goldman Sachs']
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Placements</h1>
          <p className="text-muted-foreground">
            Track placement drives, records, and career opportunities
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'drives' ? 'default' : 'outline'}
            onClick={() => setActiveTab('drives')}
            className="flex items-center space-x-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Current Drives</span>
          </Button>
          <Button
            variant={activeTab === 'records' ? 'default' : 'outline'}
            onClick={() => setActiveTab('records')}
            className="flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Placement Records</span>
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stats')}
            className="flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Statistics</span>
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeTab === 'drives' && (
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
          {(currentRole === 'admin' || currentRole === 'teacher') && activeTab === 'drives' && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Drive
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Placement Drive</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Company Name" />
                  <Input placeholder="Job Title" />
                  <Input placeholder="Location" />
                  <div className="flex space-x-2">
                    <Button className="flex-1">Save</Button>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Placement Drives */}
        {activeTab === 'drives' && (
          <div className="space-y-6">
            {filteredDrives.map((drive) => (
              <Card key={drive.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Building2 className="w-6 h-6 text-primary" />
                        <CardTitle className="text-xl">{drive.companyName}</CardTitle>
                        <Badge className={getStatusColor(drive.status)}>
                          {drive.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-medium text-muted-foreground mb-3">{drive.jobTitle}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{drive.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>{formatSalary(drive.salary.min)} - {formatSalary(drive.salary.max)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{drive.totalPositions} positions</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getTypeColor(drive.type)}>
                      {drive.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{drive.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {drive.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm">
                      <span>Applied: <strong>{drive.appliedCount}</strong></span>
                      <span>Selected: <strong>{drive.selectedCount}</strong></span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {currentRole === 'student' && drive.status === 'ongoing' && (
                        <Button size="sm">Apply Now</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Placement Records */}
        {activeTab === 'records' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{record.studentName}</span>
                    <Badge variant="outline">{record.rollNumber}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{record.companyName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Position: </span>
                      <span className="font-medium">{record.jobTitle}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Package: </span>
                      <span className="font-medium text-green-600">{formatSalary(record.package)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Department: </span>
                      <span>{record.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {new Date(record.placementDate).toLocaleDateString()}
                      </span>
                      <Badge className={record.type === 'campus' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                        {record.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Statistics */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalPlacements}</p>
                      <p className="text-sm text-muted-foreground">Total Placements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{formatSalary(stats.averagePackage)}</p>
                      <p className="text-sm text-muted-foreground">Average Package</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{formatSalary(stats.highestPackage)}</p>
                      <p className="text-sm text-muted-foreground">Highest Package</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.placementRate}%</p>
                      <p className="text-sm text-muted-foreground">Placement Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Recruiters */}
            <Card>
              <CardHeader>
                <CardTitle>Top Recruiters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stats.topRecruiters.map((company, index) => (
                    <Badge key={index} variant="outline" className="text-sm p-2">
                      {company}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'drives' && filteredDrives.length === 0) || 
          (activeTab === 'records' && filteredRecords.length === 0)) && (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No {activeTab} found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : `No ${activeTab} have been added yet.`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlacementsPage;
