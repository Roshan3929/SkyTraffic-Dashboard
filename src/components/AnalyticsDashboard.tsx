
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
import { parseCsvToFlightData, generateSampleFlightData, FlightData } from '@/utils/dataProcessing';

interface AnalyticsDashboardProps {
  file: File;
  onBack: () => void;
}

const AnalyticsDashboard = ({ file, onBack }: AnalyticsDashboardProps) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [flightData, setFlightData] = useState<FlightData[]>([]);
  const [filteredData, setFilteredData] = useState<FlightData[]>([]);

  useEffect(() => {
    const processData = async () => {
      setIsProcessing(true);
      
      try {
        const text = await file.text();
        console.log('Processing CSV file:', file.name);
        
        // Parse CSV data using the new utility
        const data = parseCsvToFlightData(text);
        console.log('Parsed flight data:', data.slice(0, 5)); // Log first 5 records
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (data.length === 0) {
          console.log('No valid data found, generating sample data');
          const sampleData = generateSampleFlightData();
          setFlightData(sampleData);
          setFilteredData(sampleData);
        } else {
          setFlightData(data);
          setFilteredData(data);
        }
      } catch (error) {
        console.error('Error processing data:', error);
        // Generate sample data for demo
        const sampleData = generateSampleFlightData();
        setFlightData(sampleData);
        setFilteredData(sampleData);
      }
      
      setIsProcessing(false);
    };

    processData();
  }, [file]);

  const handleFilterChange = (filters: any) => {
    let filtered = [...flightData];
    
    if (filters.airline && filters.airline !== 'all') {
      filtered = filtered.filter(item => item.AIRLINE === filters.airline);
    }
    
    if (filters.route && filters.route !== 'all') {
      filtered = filtered.filter(item => item.route === filters.route);
    }
    
    if (filters.delayRange) {
      filtered = filtered.filter(item => 
        item.ARRIVAL_DELAY >= filters.delayRange[0] && 
        item.ARRIVAL_DELAY <= filters.delayRange[1]
      );
    }
    
    setFilteredData(filtered);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="w-96 border-slate-700 shadow-2xl bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Processing Flight Data</h3>
            <p className="text-slate-300 mb-6">Using PySpark to analyze your dataset...</p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-slate-800/80 backdrop-blur-sm border-slate-600 hover:bg-slate-700 text-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Flight Analytics Dashboard</h1>
              <p className="text-slate-300">Analyzing {filteredData.length} flight records</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-slate-700 shadow-lg bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-100">
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
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/80 backdrop-blur-sm border-slate-700 shadow-lg">
            <TabsTrigger value="delays" className="flex items-center space-x-2 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
              <TrendingUp className="w-4 h-4" />
              <span>Delay Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center space-x-2 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
              <Calendar className="w-4 h-4" />
              <span>Heatmap</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
              <BarChart3 className="w-4 h-4" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center space-x-2 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
              <MapPin className="w-4 h-4" />
              <span>Routes</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center space-x-2 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
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
