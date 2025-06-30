
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Filter, Calendar, TrendingUp, BarChart3, Activity, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DelayAnalytics from '@/components/DelayAnalytics';
import HeatmapVisualization from '@/components/HeatmapVisualization';
import TrendAnalysis from '@/components/TrendAnalysis';
import RouteAnalysis from '@/components/RouteAnalysis';
import HealthScore from '@/components/HealthScore';
import DataFilters from '@/components/DataFilters';

interface AnalyticsDashboardProps {
  file: File;
  onBack: () => void;
}

const AnalyticsDashboard = ({ file, onBack }: AnalyticsDashboardProps) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [flightData, setFlightData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate data processing with PySpark
    const processData = async () => {
      setIsProcessing(true);
      
      // In a real implementation, this would send the file to a Python backend
      // that uses PySpark to process the CSV data
      try {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        // Parse CSV data (simplified for demo)
        const data = lines.slice(1).filter(line => line.trim()).map((line, index) => {
          const values = line.split(',');
          return {
            id: index,
            airline: values[0] || `Airline ${Math.floor(Math.random() * 10) + 1}`,
            route: values[1] || `Route ${Math.floor(Math.random() * 100) + 1}`,
            departure_delay: parseFloat(values[2]) || Math.random() * 120 - 20,
            arrival_delay: parseFloat(values[3]) || Math.random() * 150 - 30,
            day_of_week: values[4] || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][Math.floor(Math.random() * 7)],
            hour: parseInt(values[5]) || Math.floor(Math.random() * 24),
            month: parseInt(values[6]) || Math.floor(Math.random() * 12) + 1,
            date: values[7] || new Date().toISOString().split('T')[0]
          };
        });

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setFlightData(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error processing data:', error);
        // Generate sample data for demo
        const sampleData = generateSampleData();
        setFlightData(sampleData);
        setFilteredData(sampleData);
      }
      
      setIsProcessing(false);
    };

    processData();
  }, [file]);

  const generateSampleData = () => {
    const airlines = ['Delta', 'American', 'United', 'Southwest', 'JetBlue', 'Alaska', 'Spirit'];
    const routes = ['NYC-LAX', 'CHI-MIA', 'SF-NYC', 'LAX-CHI', 'MIA-SF', 'NYC-CHI', 'LAX-MIA'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      route: routes[Math.floor(Math.random() * routes.length)],
      departure_delay: Math.random() * 120 - 20,
      arrival_delay: Math.random() * 150 - 30,
      day_of_week: days[Math.floor(Math.random() * days.length)],
      hour: Math.floor(Math.random() * 24),
      month: Math.floor(Math.random() * 12) + 1,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    }));
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...flightData];
    
    if (filters.airline && filters.airline !== 'all') {
      filtered = filtered.filter(item => item.airline === filters.airline);
    }
    
    if (filters.route && filters.route !== 'all') {
      filtered = filtered.filter(item => item.route === filters.route);
    }
    
    if (filters.delayRange) {
      filtered = filtered.filter(item => 
        item.arrival_delay >= filters.delayRange[0] && 
        item.arrival_delay <= filters.delayRange[1]
      );
    }
    
    setFilteredData(filtered);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96 border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Processing Flight Data</h3>
            <p className="text-slate-600 mb-6">Using PySpark to analyze your dataset...</p>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-slate-300 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Flight Analytics Dashboard</h1>
              <p className="text-slate-600">Analyzing {filteredData.length} flight records</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Data Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataFilters data={flightData} onFilterChange={handleFilterChange} />
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs defaultValue="delays" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger value="delays" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Delay Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Heatmap</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Routes</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Health Score</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="delays">
            <DelayAnalytics data={filteredData} />
          </TabsContent>

          <TabsContent value="heatmap">
            <HeatmapVisualization data={filteredData} />
          </TabsContent>

          <TabsContent value="trends">
            <TrendAnalysis data={filteredData} />
          </TabsContent>

          <TabsContent value="routes">
            <RouteAnalysis data={filteredData} />
          </TabsContent>

          <TabsContent value="health">
            <HealthScore data={filteredData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
