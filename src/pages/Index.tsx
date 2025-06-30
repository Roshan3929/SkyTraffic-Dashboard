
import React, { useState } from 'react';
import { Upload, BarChart3, TrendingUp, Calendar, MapPin, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/FileUpload';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const startAnalysis = () => {
    if (uploadedFile) {
      setShowAnalytics(true);
    }
  };

  if (showAnalytics && uploadedFile) {
    return <AnalyticsDashboard file={uploadedFile} onBack={() => setShowAnalytics(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Flight Analytics Suite
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Advanced flight data analysis powered by PySpark. Upload your CSV data and unlock comprehensive insights 
            into flight delays, patterns, and performance metrics.
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-semibold text-slate-800 mb-2">
                Upload Flight Data
              </CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Drop your CSV file below to begin comprehensive flight delay analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <FileUpload onFileUpload={handleFileUpload} />
              
              {uploadedFile && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-green-800">
                        File ready: {uploadedFile.name}
                      </span>
                    </div>
                    <Button 
                      onClick={startAnalysis}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Start Analysis
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Delay Analytics"
            description="Comprehensive analysis of departure and arrival delays grouped by airline, route, and day of the week"
            color="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8" />}
            title="Heatmap Visualization"
            description="Interactive heatmaps showing average arrival delays per day and hour with intuitive color coding"
            color="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Trend Analysis"
            description="Monthly trend lines and bar charts identifying the top 15 most delayed routes with detailed metrics"
            color="from-emerald-500 to-teal-500"
          />
          <FeatureCard
            icon={<Activity className="w-8 h-8" />}
            title="Health Score"
            description="Proprietary flight health scoring system based on delay percentage and severity metrics"
            color="from-orange-500 to-red-500"
          />
          <FeatureCard
            icon={<MapPin className="w-8 h-8" />}
            title="Route Intelligence"
            description="Advanced filtering capabilities with interactive dropdowns and sliders for precise data exploration"
            color="from-indigo-500 to-purple-500"
          />
          <FeatureCard
            icon={<Upload className="w-8 h-8" />}
            title="PySpark Engine"
            description="Lightning-fast data processing powered by Apache Spark for handling large-scale flight datasets"
            color="from-slate-600 to-slate-800"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group hover:-translate-y-1">
      <CardContent className="p-6">
        <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;
