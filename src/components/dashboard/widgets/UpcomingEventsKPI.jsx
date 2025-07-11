import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

const UpcomingEventsKPI = ({ events }) => {
  const nextEvent = events?.[0];

  if (!nextEvent) {
    return (
      <Card className="glass-card hover-lift group bg-gradient-pink/10 border-pink/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            <span>Next Event</span>
            <Calendar className="h-4 w-4 text-pink" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-pink/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming events</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card hover-lift group bg-gradient-pink/10 border-pink/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span>Next Event</span>
          <Calendar className="h-4 w-4 text-pink" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm leading-tight mb-2">
              {nextEvent.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {nextEvent.time}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {nextEvent.urgent && (
              <Badge variant="destructive" className="text-xs">
                Urgent
              </Badge>
            )}
            <Badge variant="outline" className="text-xs border-pink/30 text-pink">
              {nextEvent.type}
            </Badge>
          </div>

          <div className="pt-2">
            {nextEvent.canRSVP ? (
              <Button 
                size="sm" 
                className="w-full bg-pink hover:bg-pink/90 text-pink-foreground group-hover:scale-105 transition-all"
              >
                RSVP Now
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-pink/30 text-pink hover:bg-pink/10 group-hover:scale-105 transition-all"
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsKPI;