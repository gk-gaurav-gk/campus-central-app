import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/contexts/RoleContext';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Plus,
  Eye,
  Download,
  Settings,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff
} from 'lucide-react';

interface VideoSession {
  id: string;
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: 'scheduled' | 'live' | 'completed';
  participants: number;
  maxParticipants: number;
  recordingUrl?: string;
  meetingUrl?: string;
}

interface CourseVideoSessionsProps {
  courseId: string;
}

const CourseVideoSessions: React.FC<CourseVideoSessionsProps> = ({ courseId }) => {
  const { currentRole } = useRole();
  const [sessions, setSessions] = useState<VideoSession[]>([
    {
      id: '1',
      title: 'React Fundamentals - Live Lecture',
      description: 'Introduction to React components and JSX syntax',
      scheduledStart: '2024-01-18T10:00:00Z',
      scheduledEnd: '2024-01-18T11:30:00Z',
      status: 'scheduled',
      participants: 0,
      maxParticipants: 50
    },
    {
      id: '2',
      title: 'State Management Workshop',
      description: 'Hands-on workshop covering useState and useEffect hooks',
      scheduledStart: '2024-01-15T14:00:00Z',
      scheduledEnd: '2024-01-15T16:00:00Z',
      status: 'completed',
      participants: 23,
      maxParticipants: 50,
      recordingUrl: 'https://example.com/recording2'
    },
    {
      id: '3',
      title: 'Q&A Session - Week 2',
      description: 'Weekly Q&A and doubt clearing session',
      scheduledStart: '2024-01-12T15:00:00Z',
      scheduledEnd: '2024-01-12T16:00:00Z',
      status: 'completed',
      participants: 18,
      maxParticipants: 50,
      recordingUrl: 'https://example.com/recording1'
    }
  ]);

  const [inMeeting, setInMeeting] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return `${duration} min`;
  };

  const joinMeeting = () => {
    setInMeeting(true);
  };

  const leaveMeeting = () => {
    setInMeeting(false);
  };

  if (inMeeting) {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-900 text-white">
          <CardContent className="p-6">
            <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center">
                <Video className="w-16 h-16 mx-auto mb-4 text-white" />
                <p className="text-lg">Video Conference Active</p>
                <p className="text-sm text-gray-300">React Fundamentals - Live Lecture</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant={micEnabled ? "secondary" : "destructive"}
                size="lg"
                onClick={() => setMicEnabled(!micEnabled)}
                className="rounded-full w-12 h-12 p-0"
              >
                {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              
              <Button
                variant={cameraEnabled ? "secondary" : "destructive"}
                size="lg"
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className="rounded-full w-12 h-12 p-0"
              >
                {cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="destructive"
                size="lg"
                onClick={leaveMeeting}
                className="rounded-full w-12 h-12 p-0"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
              
              {(currentRole === 'teacher' || currentRole === 'admin') && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full w-12 h-12 p-0"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
              <span>25 participants</span>
              <span>Recording in progress</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Video Sessions</CardTitle>
          {(currentRole === 'teacher' || currentRole === 'admin') && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No video sessions</h3>
              <p className="text-muted-foreground">
                {currentRole === 'teacher' 
                  ? 'Schedule your first video session to get started.' 
                  : 'No video sessions have been scheduled yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => {
                const startDateTime = formatDateTime(session.scheduledStart);
                const endDateTime = formatDateTime(session.scheduledEnd);
                const duration = getDuration(session.scheduledStart, session.scheduledEnd);
                
                return (
                  <Card key={session.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{session.title}</h3>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status === 'live' && (
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                              )}
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground">{session.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{startDateTime.date}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{startDateTime.time} - {endDateTime.time}</span>
                              <span className="text-primary">({duration})</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>
                                {session.participants}/{session.maxParticipants} participants
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {session.status === 'scheduled' && (
                            <Button onClick={joinMeeting}>
                              <Video className="w-4 h-4 mr-2" />
                              Join Session
                            </Button>
                          )}
                          
                          {session.status === 'live' && (
                            <Button onClick={joinMeeting} className="bg-green-600 hover:bg-green-700">
                              <Play className="w-4 h-4 mr-2" />
                              Join Live
                            </Button>
                          )}
                          
                          {session.status === 'completed' && session.recordingUrl && (
                            <div className="flex space-x-2">
                              <Button variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                Watch Recording
                              </Button>
                              {currentRole === 'student' && (
                                <Button variant="outline">
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              )}
                            </div>
                          )}
                          
                          {(currentRole === 'teacher' || currentRole === 'admin') && (
                            <Button variant="outline">
                              <Settings className="w-4 h-4 mr-2" />
                              Manage
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseVideoSessions;