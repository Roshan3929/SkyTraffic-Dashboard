
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FlightData } from '@/utils/dataProcessing';

interface HealthScoreProps {
  data: FlightData[];
}

interface RouteHealthScore {
  route: string;
  ORIGIN_AIRPORT: string;
  DESTINATION_AIRPORT: string;
  DELAY_PERCENT: number;
  AVG_POS_DELAY: number;
  HEALTH_SCORE: number;
  NORM_HEALTH_SCORE: number;
  totalFlights: number;
  delayedFlights: number;
  grade: { letter: string; color: string };
}

const HealthScore = ({ data }: HealthScoreProps) => {
  // Calculate health scores for routes using PySpark formula
  const routeHealth = data.reduce((acc: any, flight) => {
    const routeKey = `${flight.ORIGIN_AIRPORT}-${flight.DESTINATION_AIRPORT}`;
    
    if (!acc[routeKey]) {
      acc[routeKey] = {
        route: routeKey,
        ORIGIN_AIRPORT: flight.ORIGIN_AIRPORT,
        DESTINATION_AIRPORT: flight.DESTINATION_AIRPORT,
        flights: [],
        delayedCount: 0,
        totalPosDelay: 0
      };
    }
    
    acc[routeKey].flights.push(flight);
    acc[routeKey].delayedCount += flight.IS_DELAYED;
    acc[routeKey].totalPosDelay += flight.POS_DELAY;
    
    return acc;
  }, {});

  const healthScores: RouteHealthScore[] = Object.values(routeHealth).map((route: any) => {
    const totalFlights = route.flights.length;
    const delayedFlights = route.delayedCount;
    
    // PySpark formula implementation
    const DELAY_PERCENT = (delayedFlights / totalFlights) * 100;
    const AVG_POS_DELAY = route.totalPosDelay / totalFlights;
    const HEALTH_SCORE = 100 - (DELAY_PERCENT + (AVG_POS_DELAY * 0.5));
    
    return {
      route: route.route,
      ORIGIN_AIRPORT: route.ORIGIN_AIRPORT,
      DESTINATION_AIRPORT: route.DESTINATION_AIRPORT,
      DELAY_PERCENT,
      AVG_POS_DELAY,
      HEALTH_SCORE,
      NORM_HEALTH_SCORE: 0, // Will be calculated after normalization
      totalFlights,
      delayedFlights,
      grade: getGrade(HEALTH_SCORE)
    };
  });

  // Min-max normalization
  const minScore = Math.min(...healthScores.map(r => r.HEALTH_SCORE));
  const maxScore = Math.max(...healthScores.map(r => r.HEALTH_SCORE));
  const scoreRange = maxScore - minScore;

  healthScores.forEach(route => {
    route.NORM_HEALTH_SCORE = scoreRange > 0 ? 
      100 * (route.HEALTH_SCORE - minScore) / scoreRange : 50;
  });

  // Sort by normalized health score
  const sortedRoutes = healthScores.sort((a, b) => b.NORM_HEALTH_SCORE - a.NORM_HEALTH_SCORE);

  function getGrade(score: number): { letter: string; color: string } {
    if (score >= 80) return { letter: 'A+', color: 'text-green-600' };
    if (score >= 70) return { letter: 'A', color: 'text-green-500' };
    if (score >= 60) return { letter: 'B', color: 'text-blue-500' };
    if (score >= 50) return { letter: 'C', color: 'text-yellow-500' };
    if (score >= 40) return { letter: 'D', color: 'text-orange-500' };
    return { letter: 'F', color: 'text-red-500' };
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  }

  // Overall system health
  const overallHealth = healthScores.reduce((sum, route) => sum + route.NORM_HEALTH_SCORE, 0) / healthScores.length;
  const overallGrade = getGrade(overallHealth);

  // Airline-level aggregation for summary
  const airlineHealth = data.reduce((acc: any, flight) => {
    if (!acc[flight.AIRLINE]) {
      acc[flight.AIRLINE] = {
        airline: flight.AIRLINE,
        flights: [],
        delayedCount: 0,
        totalPosDelay: 0
      };
    }
    
    acc[flight.AIRLINE].flights.push(flight);
    acc[flight.AIRLINE].delayedCount += flight.IS_DELAYED;
    acc[flight.AIRLINE].totalPosDelay += flight.POS_DELAY;
    
    return acc;
  }, {});

  const airlineScores = Object.values(airlineHealth).map((airline: any) => {
    const totalFlights = airline.flights.length;
    const DELAY_PERCENT = (airline.delayedCount / totalFlights) * 100;
    const AVG_POS_DELAY = airline.totalPosDelay / totalFlights;
    const HEALTH_SCORE = 100 - (DELAY_PERCENT + (AVG_POS_DELAY * 0.5));
    
    return {
      airline: airline.airline,
      HEALTH_SCORE,
      DELAY_PERCENT,
      AVG_POS_DELAY,
      totalFlights,
      grade: getGrade(HEALTH_SCORE)
    };
  }).sort((a, b) => b.HEALTH_SCORE - a.HEALTH_SCORE);

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Overall Flight System Health</CardTitle>
          <CardDescription>PySpark-based health assessment using delay patterns</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div>
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {overallHealth.toFixed(0)}
              </div>
              <div className="text-sm text-slate-600">Normalized Health Score</div>
            </div>
            <div>
              <div className={`text-6xl font-bold ${overallGrade.color} mb-2`}>
                {overallGrade.letter}
              </div>
              <div className="text-sm text-slate-600">Grade</div>
            </div>
          </div>
          <Progress 
            value={overallHealth} 
            className="w-full h-4"
          />
        </CardContent>
      </Card>

      {/* Top/Bottom Routes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-600">Top 5 Performing Routes</CardTitle>
            <CardDescription>Routes with highest health scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedRoutes.slice(0, 5).map((route, index) => (
                <div key={route.route} className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-slate-800">{route.route}</div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-lg font-bold ${route.grade.color}`}>
                        {route.grade.letter}
                      </div>
                      <div className="text-lg font-bold text-slate-700">
                        {route.NORM_HEALTH_SCORE.toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-red-600">{route.DELAY_PERCENT.toFixed(1)}%</div>
                      <div className="text-xs text-slate-600">Delay Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-orange-600">{route.AVG_POS_DELAY.toFixed(1)}</div>
                      <div className="text-xs text-slate-600">Avg Pos Delay</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{route.totalFlights}</div>
                      <div className="text-xs text-slate-600">Flights</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-red-600">Bottom 5 Performing Routes</CardTitle>
            <CardDescription>Routes needing improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedRoutes.slice(-5).reverse().map((route, index) => (
                <div key={route.route} className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-slate-800">{route.route}</div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-lg font-bold ${route.grade.color}`}>
                        {route.grade.letter}
                      </div>
                      <div className="text-lg font-bold text-slate-700">
                        {route.NORM_HEALTH_SCORE.toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-red-600">{route.DELAY_PERCENT.toFixed(1)}%</div>
                      <div className="text-xs text-slate-600">Delay Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-orange-600">{route.AVG_POS_DELAY.toFixed(1)}</div>
                      <div className="text-xs text-slate-600">Avg Pos Delay</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{route.totalFlights}</div>
                      <div className="text-xs text-slate-600">Flights</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Airline Health Summary */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Airline Health Summary</CardTitle>
          <CardDescription>Health scores aggregated by airline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {airlineScores.map((airline) => (
              <div key={airline.airline} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-slate-800">{airline.airline}</div>
                  <div className={`text-xl font-bold ${airline.grade.color}`}>
                    {airline.grade.letter}
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-700 mb-2">
                  {airline.HEALTH_SCORE.toFixed(0)}
                </div>
                <div className="text-sm text-slate-600">
                  {airline.totalFlights} flights • {airline.DELAY_PERCENT.toFixed(1)}% delayed
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PySpark Health Score Methodology */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>PySpark Health Score Methodology</CardTitle>
          <CardDescription>Implementation based on your PySpark formula</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">Formula Components:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-blue-50 rounded">
                  <code className="font-mono">POS_DELAY = max(DEPARTURE_DELAY, 0)</code>
                  <p className="text-slate-600 mt-1">Only positive delays count</p>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <code className="font-mono">IS_DELAYED = DEPARTURE_DELAY > 15 ? 1 : 0</code>
                  <p className="text-slate-600 mt-1">Binary flag for significant delays</p>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <code className="font-mono">DELAY_PERCENT = (delayed_flights / total_flights) * 100</code>
                  <p className="text-slate-600 mt-1">Percentage of delayed flights per route</p>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <code className="font-mono">HEALTH_SCORE = 100 - (DELAY_PERCENT + AVG_POS_DELAY * 0.5)</code>
                  <p className="text-slate-600 mt-1">Core health score calculation</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">Normalization:</h4>
              <div className="p-4 bg-indigo-50 rounded">
                <code className="font-mono text-sm">
                  NORM_HEALTH_SCORE = 100 * (HEALTH_SCORE - min_score) / (max_score - min_score)
                </code>
                <p className="text-slate-600 mt-2">
                  Min-max normalization scales all scores to 0-100 range for fair comparison
                </p>
              </div>
              <div className="text-sm text-slate-600">
                <p><strong>Route-based Analysis:</strong> Health scores are calculated per route (origin-destination pair) as specified in your PySpark implementation.</p>
                <p className="mt-2"><strong>Delay Threshold:</strong> Flights with departure delays > 15 minutes are considered delayed.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthScore;
