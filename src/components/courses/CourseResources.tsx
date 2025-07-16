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
  Upload, 
  Download, 
  FileText, 
  Video, 
  Image, 
  Archive,
  Eye,
  Trash2,
  Plus,
  FolderOpen
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  category: 'study_material' | 'assignment' | 'recording' | 'other';
  uploaded_by: string;
  created_at: string;
  download_count: number;
  is_downloadable: boolean;
}

interface CourseResourcesProps {
  courseId: string;
}

const CourseResources: React.FC<CourseResourcesProps> = ({ courseId }) => {
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock resources data
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Introduction to Data Structures',
      description: 'Basic concepts and overview of data structures',
      file_name: 'DS_Intro.pdf',
      file_url: '/mock-files/ds-intro.pdf',
      file_type: 'application/pdf',
      file_size: 2400000,
      category: 'study_material',
      uploaded_by: 'Dr. Rajesh Kumar',
      created_at: '2024-01-15T10:00:00Z',
      download_count: 45,
      is_downloadable: true
    },
    {
      id: '2',
      title: 'Arrays and Linked Lists',
      description: 'Detailed explanation of arrays and linked list implementations',
      file_name: 'Arrays_LinkedLists.pdf',
      file_url: '/mock-files/arrays-linkedlists.pdf',
      file_type: 'application/pdf',
      file_size: 3200000,
      category: 'study_material',
      uploaded_by: 'Dr. Rajesh Kumar',
      created_at: '2024-01-12T14:30:00Z',
      download_count: 32,
      is_downloadable: true
    },
    {
      id: '3',
      title: 'Programming Assignment 1',
      description: 'Implement basic data structures',
      file_name: 'Assignment1.pdf',
      file_url: '/mock-files/assignment1.pdf',
      file_type: 'application/pdf',
      file_size: 800000,
      category: 'assignment',
      uploaded_by: 'Dr. Rajesh Kumar',
      created_at: '2024-01-10T09:00:00Z',
      download_count: 28,
      is_downloadable: true
    },
    {
      id: '4',
      title: 'Lecture Recording - Week 1',
      description: 'Introduction to course and basic concepts',
      file_name: 'Lecture_Week1.mp4',
      file_url: '/mock-files/lecture-week1.mp4',
      file_type: 'video/mp4',
      file_size: 125000000,
      category: 'recording',
      uploaded_by: 'Dr. Rajesh Kumar',
      created_at: '2024-01-08T11:00:00Z',
      download_count: 18,
      is_downloadable: true
    }
  ];

  useEffect(() => {
    loadResources();
  }, [courseId]);

  const loadResources = async () => {
    setLoading(true);
    try {
      // Using mock data for now
      setResources(mockResources);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast({
        title: 'Error',
        description: 'Failed to load course resources',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('video')) return Video;
    if (fileType.includes('image')) return Image;
    if (fileType.includes('zip') || fileType.includes('archive')) return Archive;
    return FileText;
  };

  const getFileColor = (fileType: string) => {
    if (fileType.includes('pdf')) return 'text-red-500';
    if (fileType.includes('video')) return 'text-blue-500';
    if (fileType.includes('image')) return 'text-green-500';
    if (fileType.includes('zip') || fileType.includes('archive')) return 'text-purple-500';
    return 'text-gray-500';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDownload = async (resource: Resource) => {
    try {
      // Mock download - in real implementation, would download actual file
      toast({
        title: 'Download Started',
        description: `Downloading ${resource.title}...`,
      });
      
      // Update download count
      setResources(prev => prev.map(r => 
        r.id === resource.id 
          ? { ...r, download_count: r.download_count + 1 }
          : r
      ));
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Unable to download file',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async (formData: FormData) => {
    try {
      // Mock upload implementation
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const category = formData.get('category') as string;
      
      const newResource: Resource = {
        id: Date.now().toString(),
        title,
        description,
        file_name: title + '.pdf', // Mock filename
        file_url: '/mock-files/' + title.toLowerCase().replace(/\s+/g, '-') + '.pdf',
        file_type: 'application/pdf',
        file_size: 1000000, // Mock size
        category: category as any,
        uploaded_by: 'Dr. Rajesh Kumar',
        created_at: new Date().toISOString(),
        download_count: 0,
        is_downloadable: true
      };

      setResources(prev => [...prev, newResource]);
      setShowUpload(false);
      
      toast({
        title: 'Success',
        description: 'Resource uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Unable to upload file',
        variant: 'destructive',
      });
    }
  };

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

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
      {/* Resource Categories */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button 
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Resources
          </Button>
          <Button 
            variant={selectedCategory === 'study_material' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('study_material')}
          >
            Study Material
          </Button>
          <Button 
            variant={selectedCategory === 'assignment' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('assignment')}
          >
            Assignments
          </Button>
          <Button 
            variant={selectedCategory === 'recording' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('recording')}
          >
            Recordings
          </Button>
        </div>
        
        {(currentRole === 'teacher' || currentRole === 'admin') && (
          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Upload Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Course Resource</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpload(formData);
              }} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="Resource title" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" placeholder="Brief description" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue="study_material">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study_material">Study Material</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="recording">Recording</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="file">File</Label>
                  <Input id="file" name="file" type="file" required />
                </div>
                <Button type="submit" className="w-full">Upload Resource</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5" />
            <span>Course Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {selectedCategory === 'all' ? 'No resources available' : `No ${selectedCategory} resources`}
              </h3>
              <p className="text-muted-foreground">
                {currentRole === 'teacher' 
                  ? 'Upload your first resource to get started.' 
                  : 'No resources have been uploaded yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource) => {
                const Icon = getFileIcon(resource.file_type);
                const iconColor = getFileColor(resource.file_type);
                
                return (
                  <div 
                    key={resource.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Icon className={`w-8 h-8 ${iconColor}`} />
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        {resource.description && (
                          <p className="text-sm text-muted-foreground mb-1">{resource.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(resource.file_size)}</span>
                          <span>•</span>
                          <span>Uploaded by {resource.uploaded_by}</span>
                          <span>•</span>
                          <span>{formatDate(resource.created_at)}</span>
                          <span>•</span>
                          <span>{resource.download_count} downloads</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {resource.category.replace('_', ' ').toUpperCase()}
                      </Badge>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      
                      {resource.is_downloadable && (
                        <Button size="sm" onClick={() => handleDownload(resource)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      
                      {(currentRole === 'teacher' || currentRole === 'admin') && (
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseResources;