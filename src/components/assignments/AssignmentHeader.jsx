
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, TrendingUp } from 'lucide-react';

const AssignmentHeader = () => {
  return (
    <div className="relative overflow-hidden">
      <Card className="glass-card border-0 bg-gradient-primary text-white">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-comfortaa">My Assignments</h1>
                  <p className="text-white/90 text-lg">Track your progress and stay organized</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">85% Completion Rate</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">Current Streak: 12 days</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
                <Plus className="h-4 w-4 mr-2" />
                Submit Assignment
              </Button>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentHeader;
