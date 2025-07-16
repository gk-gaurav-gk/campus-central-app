import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/contexts/RoleContext';
import { 
  Upload, 
  Download, 
  FileText, 
  Video, 
  Image, 
  Archive,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'image' | 'archive' | 'document';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
}

interface CourseResourcesProps {
  courseId: string;
}

const CourseResources: React.FC<CourseResourcesProps> = ({ courseId }) => {
  const { currentRole } = useRole();
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Introduction to React Fundamentals.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'Dr. Sarah Wilson',
      uploadedAt: '2024-01-15',
      downloadCount: 45
    },
    {
      id: '2',
      title: 'Component Lifecycle Demo.mp4',
      type: 'video',
      size: '125 MB',
      uploadedBy: 'Dr. Sarah Wilson',
      uploadedAt: '2024-01-12',
      downloadCount: 32
    },
    {
      id: '3',
      title: 'State Management Examples.zip',
      type: 'archive',
      size: '5.2 MB',
      uploadedBy: 'Dr. Sarah Wilson',
      uploadedAt: '2024-01-10',
      downloadCount: 28
    }
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return FileText;
      case 'video':
        return Video;
      case 'image':
        return Image;
      case 'archive':
        return Archive;
      default:
        return FileText;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'text-red-500';
      case 'video':
        return 'text-blue-500';
      case 'image':
        return 'text-green-500';
      case 'archive':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Resources</CardTitle>
          {(currentRole === 'teacher' || currentRole === 'admin') && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Resource
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No resources available</h3>
              <p className="text-muted-foreground">
                {currentRole === 'teacher' 
                  ? 'Upload your first resource to get started.' 
                  : 'No resources have been uploaded yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => {
                const Icon = getFileIcon(resource.type);
                const iconColor = getFileColor(resource.type);
                
                return (
                  <div 
                    key={resource.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Icon className={`w-8 h-8 ${iconColor}`} />
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{resource.size}</span>
                          <span>•</span>
                          <span>Uploaded by {resource.uploadedBy}</span>
                          <span>•</span>
                          <span>{resource.uploadedAt}</span>
                          <span>•</span>
                          <span>{resource.downloadCount} downloads</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {resource.type.toUpperCase()}
                      </Badge>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      
                      {currentRole === 'student' ? (
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      ) : (
                        <div className="flex space-x-2">
                          <Button size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          {(currentRole === 'teacher' || currentRole === 'admin') && (
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
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