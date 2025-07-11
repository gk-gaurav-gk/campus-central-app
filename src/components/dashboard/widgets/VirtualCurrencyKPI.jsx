import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Plus, TrendingUp } from 'lucide-react';

const VirtualCurrencyKPI = ({ data }) => {
  const { balance, recentEarned, canSpend } = data;

  return (
    <Card className="glass-card hover-lift group bg-gradient-coral/10 border-coral/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span>EduCoins</span>
          <Award className="h-4 w-4 text-coral" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold font-comfortaa bg-gradient-coral bg-clip-text text-transparent flex items-center gap-2">
              <Award className="h-8 w-8 text-coral" />
              {balance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Available balance</p>
          </div>

          {recentEarned > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-coral/10 text-coral border-coral/20">
                <Plus className="h-3 w-3 mr-1" />
                +{recentEarned} earned today
              </Badge>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 rounded-lg bg-coral/5">
              <span className="text-xs">This week</span>
              <div className="flex items-center gap-1 text-coral">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">+{recentEarned}</span>
              </div>
            </div>
          </div>

          <Button 
            size="sm" 
            className={`w-full ${canSpend ? 'bg-coral hover:bg-coral/90 text-coral-foreground' : ''} group-hover:scale-105 transition-all`}
            disabled={!canSpend}
          >
            {canSpend ? 'Spend Now' : 'Earn More'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualCurrencyKPI;