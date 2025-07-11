import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, MessageSquare, Calendar, Bell, Video, Users } from 'lucide-react';
import CourseList from '@/components/courses/CourseList';
import NotificationCenter from '@/components/courses/NotificationCenter';
import DigitalNoticeboard from '@/components/courses/DigitalNoticeboard';
import EventCalendar from '@/components/courses/EventCalendar';
import ForumsList from '@/components/courses/ForumsList';
import ChatGroups from '@/components/courses/ChatGroups';
import VideoSessions from '@/components/courses/VideoSessions';

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Communication & Collaboration
          </h1>
          <p className="text-muted-foreground">
            Comprehensive platform for course management and interactive learning
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="noticeboard" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Noticeboard
            </TabsTrigger>
            <TabsTrigger value="forums" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Forums
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video Classes
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course Management</CardTitle>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Course
                </Button>
              </CardHeader>
              <CardContent>
                <CourseList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrated Notifications</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Centralized SMS, email, and push notification system
                </p>
              </CardHeader>
              <CardContent>
                <NotificationCenter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="noticeboard" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Digital Noticeboard</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Share announcements and updates with targeted audiences
                </p>
              </CardHeader>
              <CardContent>
                <DigitalNoticeboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forums" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Forums & Discussion Boards</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Dedicated discussion spaces for each course
                </p>
              </CardHeader>
              <CardContent>
                <ForumsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Chat & Messaging</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time communication with file sharing and @mentions
                </p>
              </CardHeader>
              <CardContent>
                <ChatGroups />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Online Video Classes</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Virtual classroom with interactive tools and attendance tracking
                </p>
              </CardHeader>
              <CardContent>
                <VideoSessions />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Schedule and manage academic events and deadlines
                </p>
              </CardHeader>
              <CardContent>
                <EventCalendar />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoursesPage;