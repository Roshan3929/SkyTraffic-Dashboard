
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface HealthScoreProps {
  data: any[];
}

const HealthScore = ({ data }: HealthScoreProps) => {
  // Calculate health scores for airlines
  const airlineHealth = data.reduce((acc: any, flight) => {
    if (!acc[flight.airline]) {
      acc[flight.airline] = {
        airline: flight.airline,
        flights: [],
        onTime: 0,
        delayed: 0,
        severelyDelayed: 0
      };
    }
    
    acc[flight.airline].flights.push(flight);
    
    if (flight.arrival_delay <= 15) {
      acc[flight.airline].onTime++;
    } else if (flight.arrival_delay <= 60) {
      acc[flight.airline].delayed++;
    } else {
      acc[flight.airline].severelyDelayed++;
    }
    
    return acc;
  }, {});

  const healthScores = Object.values(airlineHealth).map((airline: any) => {
    const total = airline.flights.length;
    const onTimeRate = (airline.onTime / total) * 100;
    const delayRate = (airline.delayed / total) * 100;
    const severeDelayRate = (airline.severelyDelayed / total) * 100;
    
    // Health score calculation (0-100)
    // On-time flights: +1 point each
    // Delayed flights (15-60min): -0.5 points each
    // Severely delayed flights (>60min): -2 points each
    const rawScore = (airline.onTime * 1) + (airline.delayed * -0.5) + (airline.severelyDelayed * -2);
    const healthScore = Math.max(0, Math.min(100, ((rawScore / total) + 2) * 33.33));
    
    const avgDelay = airline.flights.reduce((sum: number, flight: any) => sum + flight.arrival_delay, 0) / total;
    
    return {
      airline: airline.airline,
      healthScore,
      onTimeRate,
      delayRate,
      severeDelayRate,
      avgDelay,
      totalFlights: total,
      grade: getGrade(healthScore)
    };
  }).sort((a, b) => b.healthScore - a.healthScore);

  function getGrade(score: number): { letter: string; color: string } {
    if (score >= 90) return { letter: 'A+', color: 'text-green-600' };
    if (score >= 80) return { letter: 'A', color: 'text-green-500' };
    if (score >= 70) return { letter: 'B', color: 'text-blue-500' };
    if (score >= 60) return { letter: 'C', color: 'text-yellow-500' };
    if (score >= 50) return { letter: 'D', color: 'text-orange-500' };
    return { letter: 'F', color: 'text-red-500' };
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  }

  // Overall system health
  const overallHealth = healthScores.reduce((sum, airline) => sum + airline.healthScore, 0) / healthScores.length;
  const overallGrade = getGrade(overallHealth);

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Overall Flight System Health</CardTitle>
          <CardDescription>Comprehensive health assessment based on delay patterns</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div>
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {overallHealth.toFixed(0)}
              </div>
              <div className="text-sm text-slate-600">Health Score</div>
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

      {/* Airline Health Rankings */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Airline Health Rankings</CardTitle>
          <CardDescription>Performance ranking based on delay patterns and severity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthScores.map((airline, index) => (
              <div key={airline.airline} className="p-6 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                      index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                      'bg-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">{airline.airline}</h3>
                      <p className="text-sm text-slate-600">{airline.totalFlights} flights analyzed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-3">
                      <div className={`text-3xl font-bold ${airline.grade.color}`}>
                        {airline.grade.letter}
                      </div>
                      <div className="text-2xl font-bold text-slate-700">
                        {airline.healthScore.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {airline.onTimeRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-600">On-Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {airline.delayRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-600">Delayed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {airline.severeDelayRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-600">Severe Delay</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {airline.avgDelay.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-600">Avg Delay (min)</div>
                  </div>
                </div>

                <Progress 
                  value={airline.healthScore} 
                  className="w-full h-3"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Score Methodology */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Health Score Methodology</CardTitle>
          <CardDescription>How flight health scores are calculated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">+1 Point</div>
              <div className="font-medium mb-2">On-Time Flights</div>
              <div className="text-sm text-slate-600">Arrival delay ≤ 15 minutes</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-2">-0.5 Points</div>
              <div className="font-medium mb-2">Delayed Flights</div>
              <div className="text-sm text-slate-600">Arrival delay 15-60 minutes</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-2">-2 Points</div>
              <div className="font-medium mb-2">Severe Delays</div>
              <div className="text-sm text-slate-600">Arrival delay &gt; 60 minutes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthScore;
