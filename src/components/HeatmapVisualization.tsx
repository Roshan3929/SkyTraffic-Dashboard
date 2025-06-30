
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HeatmapVisualizationProps {
  data: any[];
}

const HeatmapVisualization = ({ data }: HeatmapVisualizationProps) => {
  // Create heatmap data structure
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const heatmapData = days.map(day => {
    return hours.map(hour => {
      const flights = data.filter(flight => 
        flight.day_of_week === day && flight.hour === hour
      );
      
      const avgDelay = flights.length > 0 
        ? flights.reduce((sum, flight) => sum + flight.arrival_delay, 0) / flights.length
        : 0;

      return {
        day,
        hour,
        avgDelay,
        flightCount: flights.length
      };
    });
  });

  const getColor = (delay: number) => {
    if (delay <= -10) return 'bg-green-500';
    if (delay <= 0) return 'bg-green-300';
    if (delay <= 15) return 'bg-yellow-300';
    if (delay <= 30) return 'bg-orange-300';
    if (delay <= 60) return 'bg-red-300';
    return 'bg-red-500';
  };

  const getIntensity = (delay: number) => {
    const intensity = Math.min(Math.abs(delay) / 60, 1);
    return Math.max(0.3, intensity);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Average Arrival Delay Heatmap</CardTitle>
        <CardDescription>Delays by day of week and hour of day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Early (&lt; -10min)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-300 rounded"></div>
              <span>On Time (0-15min)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-300 rounded"></div>
              <span>Delayed (15-30min)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Very Delayed (&gt; 60min)</span>
            </div>
          </div>

          {/* Hour labels */}
          <div className="grid grid-cols-25 gap-1 text-xs">
            <div></div>
            {hours.map(hour => (
              <div key={hour} className="text-center font-medium text-slate-600">
                {hour}
              </div>
            ))}
          </div>

          {/* Heatmap */}
          {heatmapData.map((dayData, dayIndex) => (
            <div key={days[dayIndex]} className="grid grid-cols-25 gap-1">
              <div className="text-sm font-medium text-slate-700 flex items-center">
                {days[dayIndex].slice(0, 3)}
              </div>
              {dayData.map((cell, hourIndex) => (
                <div
                  key={`${dayIndex}-${hourIndex}`}
                  className={`h-8 rounded ${getColor(cell.avgDelay)} cursor-pointer transition-all hover:scale-110`}
                  style={{ 
                    opacity: cell.flightCount > 0 ? getIntensity(cell.avgDelay) : 0.1 
                  }}
                  title={`${cell.day} ${cell.hour}:00 - Avg Delay: ${cell.avgDelay.toFixed(1)}min (${cell.flightCount} flights)`}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatmapVisualization;
