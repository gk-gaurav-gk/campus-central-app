
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRole } from '@/contexts/RoleContext';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Download, 
  Eye,
  Users,
  Calendar,
  Award,
  Filter
} from 'lucide-react';

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publishedDate: string;
  journal: string;
  status: 'published' | 'in_review' | 'draft';
  category: string;
  citations: number;
  downloadUrl?: string;
  tags: string[];
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  principal_investigator: string;
  team_members: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'on_hold';
  budget: number;
  funding_agency: string;
}

const ResearchPage = () => {
  const { currentRole } = useRole();
  const [activeTab, setActiveTab] = useState<'papers' | 'projects'>('papers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Mock research papers data
  const [papers] = useState<ResearchPaper[]>([
    {
      id: '1',
      title: 'Machine Learning Applications in Educational Data Mining',
      abstract: 'This paper explores the application of machine learning techniques in educational data mining to improve student performance prediction and personalized learning paths.',
      authors: ['Dr. Sarah Wilson', 'Dr. John Smith', 'Maria Garcia'],
      publishedDate: '2024-01-15',
      journal: 'Journal of Educational Technology',
      status: 'published',
      category: 'Computer Science',
      citations: 45,
      downloadUrl: '/mock-files/ml-educational-mining.pdf',
      tags: ['Machine Learning', 'Education', 'Data Mining']
    },
    {
      id: '2',
      title: 'Sustainable Energy Solutions for Smart Campus',
      abstract: 'Research on implementing renewable energy sources and smart grid technologies to create a sustainable campus environment.',
      authors: ['Dr. Michael Chen', 'Dr. Lisa Park'],
      publishedDate: '2023-12-20',
      journal: 'Sustainable Energy Review',
      status: 'published',
      category: 'Environmental Science',
      citations: 32,
      downloadUrl: '/mock-files/sustainable-energy.pdf',
      tags: ['Renewable Energy', 'Smart Grid', 'Sustainability']
    },
    {
      id: '3',
      title: 'Advanced Algorithms for Network Security',
      abstract: 'Development of novel algorithms for detecting and preventing cybersecurity threats in distributed networks.',
      authors: ['Dr. Robert Johnson', 'Alex Kumar'],
      publishedDate: '2024-02-01',
      journal: 'Cybersecurity Journal',
      status: 'in_review',
      category: 'Computer Science',
      citations: 12,
      tags: ['Cybersecurity', 'Algorithms', 'Network Security']
    }
  ]);

  // Mock research projects data
  const [projects] = useState<ResearchProject[]>([
    {
      id: '1',
      title: 'AI-Powered Learning Management System',
      description: 'Development of an intelligent learning management system that adapts to individual student learning patterns.',
      principal_investigator: 'Dr. Sarah Wilson',
      team_members: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      startDate: '2023-09-01',
      endDate: '2025-08-31',
      status: 'active',
      budget: 150000,
      funding_agency: 'National Science Foundation'
    },
    {
      id: '2',
      title: 'Campus Sustainability Initiative',
      description: 'Comprehensive research project to implement and evaluate sustainable practices across the campus.',
      principal_investigator: 'Dr. Michael Chen',
      team_members: ['Lisa Park', 'David Wilson', 'Sarah Brown'],
      startDate: '2023-01-01',
      endDate: '2024-12-31',
      status: 'active',
      budget: 200000,
      funding_agency: 'Environmental Protection Agency'
    },
    {
      id: '3',
      title: 'Blockchain in Education',
      description: 'Exploring the applications of blockchain technology for secure credential verification and academic record management.',
      principal_investigator: 'Dr. Robert Johnson',
      team_members: ['Alex Kumar', 'Maria Rodriguez'],
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      status: 'completed',
      budget: 75000,
      funding_agency: 'Department of Education'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_review':
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.principal_investigator.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const categories = ['all', ...Array.from(new Set(papers.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Research</h1>
          <p className="text-muted-foreground">
            Explore academic research papers and ongoing projects
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'papers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('papers')}
            className="flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Research Papers</span>
          </Button>
          <Button
            variant={activeTab === 'projects' ? 'default' : 'outline'}
            onClick={() => setActiveTab('projects')}
            className="flex items-center space-x-2"
          >
            <Award className="w-4 h-4" />
            <span>Research Projects</span>
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
          {activeTab === 'papers' && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {(currentRole === 'teacher' || currentRole === 'admin') && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {activeTab === 'papers' ? 'Paper' : 'Project'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New {activeTab === 'papers' ? 'Research Paper' : 'Research Project'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Title" />
                  <Textarea placeholder="Description/Abstract" rows={4} />
                  <Input placeholder="Authors/Team Members" />
                  <div className="flex space-x-2">
                    <Button className="flex-1">Save Draft</Button>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Research Papers */}
        {activeTab === 'papers' && (
          <div className="space-y-6">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{paper.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{paper.authors.join(', ')}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
                        </span>
                        <span>{paper.citations} citations</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={getStatusColor(paper.status)}>
                          {paper.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{paper.category}</Badge>
                        <Badge variant="outline">{paper.journal}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{paper.abstract}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    {paper.downloadUrl && (
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Research Projects */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ${project.budget.toLocaleString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">PI: </span>
                      <span className="text-muted-foreground">{project.principal_investigator}</span>
                    </div>
                    <div>
                      <span className="font-medium">Team: </span>
                      <span className="text-muted-foreground">{project.team_members.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Duration: </span>
                      <span className="text-muted-foreground">
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Funding: </span>
                      <span className="text-muted-foreground">{project.funding_agency}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'papers' && filteredPapers.length === 0) || 
          (activeTab === 'projects' && filteredProjects.length === 0)) && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
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

export default ResearchPage;
