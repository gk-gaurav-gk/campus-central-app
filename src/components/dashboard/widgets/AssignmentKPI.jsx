import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AssignmentKPI = ({ data }) => {
  const { submitted, pending, graded, total } = data;

  const chartData = {
    labels: ['Status'],
    datasets: [
      {
        label: 'Submitted',
        data: [submitted],
        backgroundColor: 'hsl(160 65% 50%)',
        borderRadius: 4,
        barThickness: 20
      },
      {
        label: 'Pending',
        data: [pending],
        backgroundColor: 'hsl(45 100% 70%)',
        borderRadius: 4,
        barThickness: 20
      },
      {
        label: 'Graded',
        data: [graded],
        backgroundColor: 'hsl(180 70% 45%)',
        borderRadius: 4,
        barThickness: 20
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        stacked: true,
        display: false
      },
      y: {
        stacked: true,
        display: false
      }
    }
  };

  return (
    <Card className="glass-card hover-lift group">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span>Assignment Status</span>
          <BookOpen className="h-4 w-4 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold font-comfortaa bg-gradient-secondary bg-clip-text text-transparent">
              {submitted}/{total}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>

          <div className="h-12">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div className="flex justify-between text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span>Submitted: {submitted}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span>Pending: {pending}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Graded: {graded}</span>
            </div>
          </div>

          <Button size="sm" variant="outline" className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground transition-all">
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentKPI;