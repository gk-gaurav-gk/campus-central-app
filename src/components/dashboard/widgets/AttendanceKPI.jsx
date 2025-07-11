import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, TrendingUp } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceKPI = ({ data }) => {
  const { percentage, daysPresent, totalDays, trend } = data;

  const chartData = {
    datasets: [{
      data: [percentage, 100 - percentage],
      backgroundColor: [
        'hsl(180 70% 45%)',
        'hsl(210 40% 96%)'
      ],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    maintainAspectRatio: false
  };

  return (
    <Card className="glass-card hover-lift group">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span>Attendance Summary</span>
          <CheckCircle className="h-4 w-4 text-secondary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold font-comfortaa bg-gradient-primary bg-clip-text text-transparent">
              {percentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              {daysPresent}/{totalDays} days
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-secondary" />
              <span className="text-xs text-secondary font-medium">{trend}</span>
            </div>
          </div>
          <div className="relative w-16 h-16">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{percentage}%</span>
            </div>
          </div>
        </div>
        <Button size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default AttendanceKPI;