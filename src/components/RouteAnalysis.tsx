
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FlightData } from '@/utils/dataProcessing';

interface RouteAnalysisProps {
  data: FlightData[];
}

const RouteAnalysis = ({ data }: RouteAnalysisProps) => {
  // Process route data using correct field names
  const routeDelays = data.reduce((acc: any, flight) => {
    if (!acc[flight.route]) {
      acc[flight.route] = {
        route: flight.route,
        delays: [],
        count: 0
      };
    }
    acc[flight.route].delays.push(flight.ARRIVAL_DELAY);
    acc[flight.route].count++;
    return acc;
  }, {});

  const routeData = Object.values(routeDelays).map((route: any) => ({
    route: route.route,
    avgDelay: route.delays.reduce((a: number, b: number) => a + b, 0) / route.delays.length,
    flights: route.count,
    delayedFlights: route.delays.filter((d: number) => d > 15).length,
    delayRate: (route.delays.filter((d: number) => d > 15).length / route.delays.length) * 100
  }))
  .sort((a, b) => b.avgDelay - a.avgDelay)
  .slice(0, 15); // Top 15 most delayed routes

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Top 15 Most Delayed Routes</CardTitle>
          <CardDescription>Routes with highest average arrival delays (ORIGIN_AIRPORT-DESTINATION_AIRPORT)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={routeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="route" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: string) => [
                  `${value.toFixed(1)} min`, 
                  'Average Delay'
                ]}
              />
              <Bar 
                dataKey="avgDelay" 
                fill="#ef4444"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Route Performance Summary</CardTitle>
            <CardDescription>Key metrics for analyzed routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routeData.slice(0, 5).map((route, index) => (
                <div key={route.route} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-red-500' : 
                      index === 1 ? 'bg-orange-500' : 
                      index === 2 ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{route.route}</div>
                      <div className="text-sm text-slate-600">{route.flights} flights</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">{route.avgDelay.toFixed(1)} min</div>
                    <div className="text-sm text-slate-600">{route.delayRate.toFixed(1)}% delayed</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Route Statistics</CardTitle>
            <CardDescription>Overall route performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {routeData.length}
                </div>
                <div className="text-sm text-slate-600">Total Routes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {routeData[0]?.avgDelay.toFixed(1) || '0'}
                </div>
                <div className="text-sm text-slate-600">Worst Avg Delay (min)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {routeData[routeData.length - 1]?.avgDelay.toFixed(1) || '0'}
                </div>
                <div className="text-sm text-slate-600">Best Avg Delay (min)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {(routeData.reduce((sum, route) => sum + route.delayRate, 0) / routeData.length).toFixed(1)}%
                </div>
                <div className="text-sm text-slate-600">Avg Delay Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RouteAnalysis;
