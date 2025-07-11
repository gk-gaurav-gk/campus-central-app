import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Calendar as CalendarIcon, Plus, MapPin, Video, Clock, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: 'class' | 'exam' | 'assignment_due' | 'meeting' | 'other';
  start_time: string;
  end_time: string;
  location?: string;
  is_virtual: boolean;
  meeting_url?: string;
  max_attendees?: number;
  organizer_name?: string;
  course_title?: string;
}

const EventCalendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'other' as const,
    start_time: '',
    end_time: '',
    location: '',
    is_virtual: false,
    meeting_url: '',
    max_attendees: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles!events_organizer_id_fkey(first_name, last_name),
          courses(title)
        `)
        .gte('end_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(50);

      if (error) throw error;

      const eventsWithDetails = data?.map(event => ({
        ...event,
        event_type: event.event_type as 'class' | 'exam' | 'assignment_due' | 'meeting' | 'other',
        organizer_name: event.profiles 
          ? `${event.profiles.first_name || ''} ${event.profiles.last_name || ''}`.trim()
          : 'Unknown',
        course_title: event.courses?.title || null,
      })) || [];

      setEvents(eventsWithDetails);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!formData.title.trim() || !formData.start_time || !formData.end_time) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description || null,
          event_type: formData.event_type,
          start_time: formData.start_time,
          end_time: formData.end_time,
          location: formData.location || null,
          is_virtual: formData.is_virtual,
          meeting_url: formData.meeting_url || null,
          max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
          organizer_id: user?.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Event created successfully',
      });

      setIsCreateOpen(false);
      setFormData({
        title: '',
        description: '',
        event_type: 'other',
        start_time: '',
        end_time: '',
        location: '',
        is_virtual: false,
        meeting_url: '',
        max_attendees: '',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      class: 'bg-blue-500',
      exam: 'bg-red-500',
      assignment_due: 'bg-orange-500',
      meeting: 'bg-green-500',
      other: 'bg-gray-500',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getEventTypeBadge = (type: string) => {
    const variants = {
      class: 'default',
      exam: 'destructive',
      assignment_due: 'secondary',
      meeting: 'default',
      other: 'outline',
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'outline'}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const selectedDateEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-4">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Event Calendar</h3>
          <p className="text-sm text-muted-foreground">
            Schedule and manage academic events and deadlines
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Event Type</label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="assignment_due">Assignment Due</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="virtual"
                  checked={formData.is_virtual}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_virtual: e.target.checked }))}
                />
                <label htmlFor="virtual" className="text-sm font-medium">Virtual Event</label>
              </div>
              
              {formData.is_virtual ? (
                <div>
                  <label className="text-sm font-medium">Meeting URL</label>
                  <Input
                    value={formData.meeting_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, meeting_url: e.target.value }))}
                    placeholder="Enter meeting URL"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter event location"
                  />
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">Max Attendees (Optional)</label>
                <Input
                  type="number"
                  value={formData.max_attendees}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_attendees: e.target.value }))}
                  placeholder="Enter maximum number of attendees"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateEvent} className="flex-1">
                  Create Event
                </Button>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar and Events Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Events for Selected Date */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Events for {selectedDate.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No events</h3>
                  <p className="text-muted-foreground">
                    No events scheduled for this date.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <Card key={event.id} className="border-l-4" style={{ borderLeftColor: getEventTypeColor(event.event_type).replace('bg-', '#') }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-foreground">{event.title}</h4>
                              {getEventTypeBadge(event.event_type)}
                            </div>
                            
                            {event.description && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                            
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              
                              {event.is_virtual ? (
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4" />
                                  <span>Virtual Event</span>
                                  {event.meeting_url && (
                                    <Button variant="link" size="sm" className="p-0 h-auto">
                                      Join Meeting
                                    </Button>
                                  )}
                                </div>
                              ) : event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>Organized by {event.organizer_name}</span>
                              </div>
                              
                              {event.course_title && (
                                <Badge variant="outline">{event.course_title}</Badge>
                              )}
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
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.event_type)}`}></div>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.start_time).toLocaleDateString()} at {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {getEventTypeBadge(event.event_type)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCalendar;