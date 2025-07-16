import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useRole } from '@/contexts/RoleContext';
import { 
  Bell, 
  Pin, 
  Calendar, 
  Plus,
  AlertCircle,
  Info,
  CheckCircle,
  Megaphone
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'important' | 'urgent' | 'success';
  isPinned: boolean;
  author: string;
  createdAt: string;
  expiresAt?: string;
}

interface CourseAnnouncementsProps {
  courseId: string;
}

const CourseAnnouncements: React.FC<CourseAnnouncementsProps> = ({ courseId }) => {
  const { currentRole, user } = useRole();
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Assignment 2 Deadline Extended',
      content: 'Due to technical issues with the submission portal, the deadline for Assignment 2 has been extended to January 28th, 2024.',
      type: 'important',
      isPinned: true,
      author: 'Dr. Sarah Wilson',
      createdAt: '2024-01-16T09:00:00Z',
      expiresAt: '2024-01-28T23:59:59Z'
    },
    {
      id: '2',
      title: 'Guest Lecture This Friday',
      content: 'We have a special guest lecture by John Doe from Meta on "React Performance Optimization" this Friday at 2 PM.',
      type: 'info',
      isPinned: false,
      author: 'Dr. Sarah Wilson',
      createdAt: '2024-01-15T14:30:00Z'
    },
    {
      id: '3',
      title: 'Course Materials Updated',
      content: 'New slides and code examples for Week 3 have been uploaded to the resources section.',
      type: 'success',
      isPinned: false,
      author: 'Dr. Sarah Wilson',
      createdAt: '2024-01-14T11:15:00Z'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as const,
    isPinned: false
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'important':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'border-orange-200 bg-orange-50';
      case 'urgent':
        return 'border-red-200 bg-red-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title.trim() && newAnnouncement.content.trim()) {
      const announcement: Announcement = {
        id: Date.now().toString(),
        ...newAnnouncement,
        author: user.name,
        createdAt: new Date().toISOString()
      };
      
      setAnnouncements([announcement, ...announcements]);
      setNewAnnouncement({ title: '', content: '', type: 'info', isPinned: false });
      setShowCreateForm(false);
    }
  };

  // Sort announcements - pinned first, then by date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Announcements</CardTitle>
          {(currentRole === 'teacher' || currentRole === 'admin') && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Create Announcement Form */}
          {showCreateForm && (currentRole === 'teacher' || currentRole === 'admin') && (
            <Card className="mb-6 border-dashed">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Input
                    placeholder="Announcement title..."
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  />
                  
                  <Textarea
                    placeholder="Announcement content..."
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    className="min-h-24"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <select 
                        value={newAnnouncement.type}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, type: e.target.value as any})}
                        className="border rounded px-3 py-1 text-sm"
                      >
                        <option value="info">Information</option>
                        <option value="important">Important</option>
                        <option value="urgent">Urgent</option>
                        <option value="success">Good News</option>
                      </select>
                      
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newAnnouncement.isPinned}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, isPinned: e.target.checked})}
                        />
                        <span>Pin announcement</span>
                      </label>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateAnnouncement}>
                        Post Announcement
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Announcements List */}
          {sortedAnnouncements.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No announcements</h3>
              <p className="text-muted-foreground">
                {currentRole === 'teacher' 
                  ? 'Create your first announcement to keep students informed.' 
                  : 'No announcements have been posted yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAnnouncements.map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className={`${getTypeColor(announcement.type)} ${
                    announcement.isPinned ? 'border-l-4 border-l-yellow-400' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getTypeIcon(announcement.type)}
                        
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{announcement.title}</h3>
                            {announcement.isPinned && (
                              <Pin className="w-4 h-4 text-yellow-600" />
                            )}
                            <Badge className={getBadgeColor(announcement.type)}>
                              {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground">{announcement.content}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Posted: {formatDate(announcement.createdAt)}</span>
                            </div>
                            
                            <span>•</span>
                            <span>By {announcement.author}</span>
                            
                            {announcement.expiresAt && (
                              <>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Bell className="w-4 h-4" />
                                  <span>Expires: {formatDate(announcement.expiresAt)}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseAnnouncements;