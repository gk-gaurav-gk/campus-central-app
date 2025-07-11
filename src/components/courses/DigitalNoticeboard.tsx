import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Pin, Plus, Eye, Calendar, Users, FileText } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: string[];
  is_pinned: boolean;
  is_published: boolean;
  publish_at: string;
  expire_at?: string;
  created_at: string;
  author_name?: string;
  course_title?: string;
}

const DigitalNoticeboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_audience: ['all'],
    is_pinned: false,
    expire_at: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          profiles!announcements_author_id_fkey(first_name, last_name),
          courses(title)
        `)
        .eq('is_published', true)
        .lte('publish_at', new Date().toISOString())
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const announcementsWithAuthor = data?.map(announcement => ({
        ...announcement,
        author_name: announcement.profiles 
          ? `${announcement.profiles.first_name || ''} ${announcement.profiles.last_name || ''}`.trim()
          : 'Unknown',
        course_title: announcement.courses?.title || null,
      })) || [];

      setAnnouncements(announcementsWithAuthor);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: 'Error',
        description: 'Failed to load announcements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: formData.title,
          content: formData.content,
          target_audience: formData.target_audience,
          is_pinned: formData.is_pinned,
          is_published: true,
          author_id: user?.id,
          expire_at: formData.expire_at || null,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Announcement created successfully',
      });

      setIsCreateOpen(false);
      setFormData({
        title: '',
        content: '',
        target_audience: ['all'],
        is_pinned: false,
        expire_at: '',
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to create announcement',
        variant: 'destructive',
      });
    }
  };

  const getAudienceBadges = (audience: string[]) => {
    return audience.map((aud, index) => (
      <Badge key={index} variant="secondary" className="text-xs">
        {aud === 'all' ? 'Everyone' : aud}
      </Badge>
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Recent Announcements</h3>
          <p className="text-sm text-muted-foreground">
            Stay updated with the latest news and information
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter announcement title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter announcement content"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Target Audience</label>
                <Select
                  value={formData.target_audience[0]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, target_audience: [value] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Everyone</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="teachers">Teachers</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Expiry Date (Optional)</label>
                <Input
                  type="datetime-local"
                  value={formData.expire_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, expire_at: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={formData.is_pinned}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_pinned: e.target.checked }))}
                />
                <label htmlFor="pinned" className="text-sm font-medium">Pin this announcement</label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateAnnouncement} className="flex-1">
                  Create Announcement
                </Button>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No announcements</h3>
              <p className="text-muted-foreground">
                There are no announcements at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className={`transition-shadow hover:shadow-md ${announcement.is_pinned ? 'border-primary' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {announcement.is_pinned && (
                        <Pin className="w-4 h-4 text-primary" />
                      )}
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        By {announcement.author_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                      {announcement.course_title && (
                        <Badge variant="outline">{announcement.course_title}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {getAudienceBadges(announcement.target_audience)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{announcement.content}</p>
                {announcement.expire_at && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(announcement.expire_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DigitalNoticeboard;