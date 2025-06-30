
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DelayAnalyticsProps {
  data: any[];
}

const DelayAnalytics = ({ data }: DelayAnalyticsProps) => {
  // Process data for airline delays
  const airlineDelays = data.reduce((acc: any, flight) => {
    if (!acc[flight.airline]) {
      acc[flight.airline] = { 
        airline: flight.airline, 
        departure_delays: [], 
        arrival_delays: [],
        count: 0 
      };
    }
    acc[flight.airline].departure_delays.push(flight.departure_delay);
    acc[flight.airline].arrival_delays.push(flight.arrival_delay);
    acc[flight.airline].count++;
    return acc;
  }, {});

  const airlineData = Object.values(airlineDelays).map((airline: any) => ({
    airline: airline.airline,
    avg_departure_delay: airline.departure_delays.reduce((a: number, b: number) => a + b, 0) / airline.departure_delays.length,
    avg_arrival_delay: airline.arrival_delays.reduce((a: number, b: number) => a + b, 0) / airline.arrival_delays.length,
    flights: airline.count
  }));

  // Process data for day of week delays
  const dayDelays = data.reduce((acc: any, flight) => {
    if (!acc[flight.day_of_week]) {
      acc[flight.day_of_week] = { 
        day: flight.day_of_week, 
        delays: [],
        count: 0 
      };
    }
    acc[flight.day_of_week].delays.push(flight.arrival_delay);
    acc[flight.day_of_week].count++;
    return acc;
  }, {});

  const dayData = Object.values(dayDelays).map((day: any) => ({
    day: day.day,
    avg_delay: day.delays.reduce((a: number, b: number) => a + b, 0) / day.delays.length,
    flights: day.count
  }));

  // Sort days properly
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedDayData = dayData.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Average Delays by Airline</CardTitle>
          <CardDescription>Departure vs Arrival delays across airlines</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={airlineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="airline" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="avg_departure_delay" 
                fill="#3b82f6" 
                name="Avg Departure Delay"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="avg_arrival_delay" 
                fill="#6366f1" 
                name="Avg Arrival Delay"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Delays by Day of Week</CardTitle>
          <CardDescription>Average arrival delays throughout the week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sortedDayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="avg_delay" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Avg Delay (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm lg:col-span-2">
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
          <CardDescription>Key metrics from your flight data analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {data.length.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Total Flights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {(data.reduce((sum, flight) => sum + flight.arrival_delay, 0) / data.length).toFixed(1)}
              </div>
              <div className="text-sm text-slate-600">Avg Arrival Delay (min)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(data.map(flight => flight.airline)).size}
              </div>
              <div className="text-sm text-slate-600">Airlines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {new Set(data.map(flight => flight.route)).size}
              </div>
              <div className="text-sm text-slate-600">Routes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DelayAnalytics;
