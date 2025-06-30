
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendAnalysisProps {
  data: any[];
}

const TrendAnalysis = ({ data }: TrendAnalysisProps) => {
  // Process monthly trend data
  const monthlyData = data.reduce((acc: any, flight) => {
    const month = flight.month;
    if (!acc[month]) {
      acc[month] = {
        month,
        delays: [],
        count: 0
      };
    }
    acc[month].delays.push(flight.arrival_delay);
    acc[month].count++;
    return acc;
  }, {});

  const trendData = Object.values(monthlyData).map((month: any) => ({
    month: month.month,
    monthName: new Date(2024, month.month - 1).toLocaleString('default', { month: 'long' }),
    avgDelay: month.delays.reduce((a: number, b: number) => a + b, 0) / month.delays.length,
    flights: month.count,
    onTimeRate: (month.delays.filter((d: number) => d <= 15).length / month.delays.length) * 100
  })).sort((a, b) => a.month - b.month);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Monthly Delay Trends</CardTitle>
          <CardDescription>Average delays and on-time performance by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="monthName" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis yAxisId="delay" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="rate" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                yAxisId="delay"
                type="monotone" 
                dataKey="avgDelay" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                name="Avg Delay (min)"
              />
              <Line 
                yAxisId="rate"
                type="monotone" 
                dataKey="onTimeRate" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                name="On-time Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {(data.reduce((sum, flight) => sum + flight.arrival_delay, 0) / data.length).toFixed(1)}
            </div>
            <div className="text-sm text-slate-600">Average Delay (minutes)</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {((data.filter(flight => flight.arrival_delay <= 15).length / data.length) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600">On-time Performance</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.max(...data.map(flight => flight.arrival_delay)).toFixed(0)}
            </div>
            <div className="text-sm text-slate-600">Max Delay (minutes)</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrendAnalysis;
