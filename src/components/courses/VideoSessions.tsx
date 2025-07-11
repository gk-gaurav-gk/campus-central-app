import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Video, Plus, Clock, Users, Calendar, Play, Square, Settings, BarChart3 } from 'lucide-react';

interface VideoSession {
  id: string;
  title: string;
  description?: string;
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  meeting_url?: string;
  meeting_id?: string;
  passcode?: string;
  is_recorded: boolean;
  recording_url?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  max_participants: number;
  instructor_name?: string;
  course_title?: string;
  attendance_count: number;
}

const VideoSessions = () => {
  const [sessions, setSessions] = useState<VideoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_start: '',
    scheduled_end: '',
    max_participants: 100,
    is_recorded: false,
    passcode: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('video_sessions')
        .select(`
          *,
          profiles!video_sessions_instructor_id_fkey(first_name, last_name),
          courses(title),
          video_attendance(count)
        `)
        .order('scheduled_start', { ascending: false })
        .limit(20);

      if (error) throw error;

      const sessionsWithDetails = data?.map(session => ({
        ...session,
        status: session.status as 'scheduled' | 'live' | 'ended' | 'cancelled',
        instructor_name: session.profiles 
          ? `${session.profiles.first_name || ''} ${session.profiles.last_name || ''}`.trim()
          : 'Unknown',
        course_title: session.courses?.title || null,
        attendance_count: session.video_attendance?.length || 0,
      })) || [];

      setSessions(sessionsWithDetails);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load video sessions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!formData.title.trim() || !formData.scheduled_start || !formData.scheduled_end) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Generate a simple meeting ID and URL
      const meetingId = Math.random().toString(36).substring(2, 15);
      const meetingUrl = `https://meet.jit.si/${meetingId}`;

      const { error } = await supabase
        .from('video_sessions')
        .insert({
          course_id: 'temp-course-id', // Will be updated when course selection is implemented
          title: formData.title,
          description: formData.description || null,
          scheduled_start: formData.scheduled_start,
          scheduled_end: formData.scheduled_end,
          max_participants: formData.max_participants,
          is_recorded: formData.is_recorded,
          passcode: formData.passcode || null,
          meeting_id: meetingId,
          meeting_url: meetingUrl,
          instructor_id: user?.id,
          status: 'scheduled',
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Video session created successfully',
      });

      setIsCreateOpen(false);
      setFormData({
        title: '',
        description: '',
        scheduled_start: '',
        scheduled_end: '',
        max_participants: 100,
        is_recorded: false,
        passcode: '',
      });
      fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create video session',
        variant: 'destructive',
      });
    }
  };

  const handleJoinSession = (session: VideoSession) => {
    if (session.meeting_url) {
      window.open(session.meeting_url, '_blank');
      // Record attendance
      recordAttendance(session.id);
    }
  };

  const recordAttendance = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('video_attendance')
        .upsert({
          session_id: sessionId,
          participant_id: user?.id,
          joined_at: new Date().toISOString(),
          is_present: true,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording attendance:', error);
    }
  };

  const updateSessionStatus = async (sessionId: string, status: string) => {
    try {
      const updateData: any = { status };
      
      if (status === 'live') {
        updateData.actual_start = new Date().toISOString();
      } else if (status === 'ended') {
        updateData.actual_end = new Date().toISOString();
      }

      const { error } = await supabase
        .from('video_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Session ${status}`,
      });

      fetchSessions();
    } catch (error) {
      console.error('Error updating session status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update session status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'secondary',
      live: 'default',
      ended: 'outline',
      cancelled: 'destructive',
    } as const;

    const colors = {
      scheduled: 'text-blue-500',
      live: 'text-green-500',
      ended: 'text-gray-500',
      cancelled: 'text-red-500',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        <span className={colors[status as keyof typeof colors]}>
          {status.toUpperCase()}
        </span>
      </Badge>
    );
  };

  const isSessionLive = (session: VideoSession) => {
    const now = new Date();
    const start = new Date(session.scheduled_start);
    const end = new Date(session.scheduled_end);
    return now >= start && now <= end && session.status !== 'ended' && session.status !== 'cancelled';
  };

  const canJoinSession = (session: VideoSession) => {
    const now = new Date();
    const start = new Date(session.scheduled_start);
    return now >= start && session.status !== 'ended' && session.status !== 'cancelled';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
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
          <h3 className="text-lg font-medium">Video Sessions</h3>
          <p className="text-sm text-muted-foreground">
            Virtual classroom with interactive tools and attendance tracking
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Video Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Session Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter session title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter session description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduled_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_start: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduled_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_end: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Max Participants</label>
                <Input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 100 }))}
                  min="1"
                  max="500"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Passcode (Optional)</label>
                <Input
                  value={formData.passcode}
                  onChange={(e) => setFormData(prev => ({ ...prev, passcode: e.target.value }))}
                  placeholder="Enter meeting passcode"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recorded"
                  checked={formData.is_recorded}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_recorded: e.target.checked }))}
                />
                <label htmlFor="recorded" className="text-sm font-medium">Record Session</label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateSession} className="flex-1">
                  Schedule Session
                </Button>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No video sessions</h3>
              <p className="text-muted-foreground">
                No video sessions have been scheduled yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session.id} className={`transition-shadow hover:shadow-md ${isSessionLive(session) ? 'border-green-500' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      {getStatusBadge(session.status)}
                      {isSessionLive(session) && (
                        <Badge variant="default" className="bg-green-500">
                          <span className="animate-pulse">● LIVE</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {session.instructor_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(session.scheduled_start).toLocaleDateString()} at {new Date(session.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {session.course_title && (
                        <Badge variant="outline">{session.course_title}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {session.attendance_count}/{session.max_participants}
                    </Badge>
                    {session.is_recorded && (
                      <Badge variant="secondary">Recorded</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {session.description && (
                  <p className="text-foreground mb-4">{session.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Duration: {Math.round((new Date(session.scheduled_end).getTime() - new Date(session.scheduled_start).getTime()) / (1000 * 60))} min
                    </span>
                    {session.passcode && (
                      <span>Passcode: {session.passcode}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {canJoinSession(session) && (
                      <Button
                        onClick={() => handleJoinSession(session)}
                        className="flex items-center gap-1"
                      >
                        <Video className="w-4 h-4" />
                        Join Session
                      </Button>
                    )}
                    
                    {(session as any).instructor_id === user?.id && (
                      <>
                        {session.status === 'scheduled' && (
                          <Button
                            variant="outline"
                            onClick={() => updateSessionStatus(session.id, 'live')}
                            className="flex items-center gap-1"
                          >
                            <Play className="w-4 h-4" />
                            Start
                          </Button>
                        )}
                        
                        {session.status === 'live' && (
                          <Button
                            variant="outline"
                            onClick={() => updateSessionStatus(session.id, 'ended')}
                            className="flex items-center gap-1"
                          >
                            <Square className="w-4 h-4" />
                            End
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {session.recording_url && (
                      <Button variant="outline" size="sm">
                        View Recording
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Scheduled</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Live</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.status === 'live').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Square className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.status === 'ended').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Total Attendance</p>
                <p className="text-2xl font-bold">
                  {sessions.reduce((sum, s) => sum + s.attendance_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoSessions;