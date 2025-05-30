
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccidentMap from '@/components/AccidentMap';
import DataAnalysis from '@/components/DataAnalysis';
import ZoneClassification from '@/components/ZoneClassification';
import AccidentDataTable from '@/components/AccidentDataTable';
import { generateAccidentData, AccidentData, analyzeAccidentZones, ZoneData } from '@/lib/accidentAnalysis';
import { MapPin, AlertTriangle, BarChart3, Database, Brain, TrendingUp } from 'lucide-react';

const Index = () => {
  const [accidentData, setAccidentData] = useState<AccidentData[]>([]);
  const [zoneData, setZoneData] = useState<ZoneData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading ML analysis
    setTimeout(() => {
      const data = generateAccidentData();
      const zones = analyzeAccidentZones(data);
      setAccidentData(data);
      setZoneData(zones);
      setLoading(false);
    }, 1500);
  }, []);

  const totalAccidents = accidentData.length;
  const redZones = zoneData.filter(z => z.riskLevel === 'red').length;
  const orangeZones = zoneData.filter(z => z.riskLevel === 'orange').length;
  const yellowZones = zoneData.filter(z => z.riskLevel === 'yellow').length;
  const greenZones = zoneData.filter(z => z.riskLevel === 'green').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Road Accident Data...</h2>
          <p className="text-gray-600 mb-4">Processing ML algorithms for zone classification</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Road Accident Analysis System
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced ML-powered accident frequency analysis and intelligent risk zone classification for urban safety optimization
          </p>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Total Accidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800 mb-1">{totalAccidents}</div>
              <div className="flex items-center text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 mr-1" />
                Last 2 years
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Critical Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-800 mb-1">{redZones}</div>
              <div className="text-sm text-red-600 font-medium">Immediate Action Required</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Medium Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-800 mb-1">{orangeZones}</div>
              <div className="text-sm text-orange-600 font-medium">Monitor & Improve</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Low Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-800 mb-1">{yellowZones}</div>
              <div className="text-sm text-yellow-600 font-medium">Regular Assessment</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Safe Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800 mb-1">{greenZones}</div>
              <div className="text-sm text-green-600 font-medium">Maintain Standards</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg border-0 ring-1 ring-gray-200 p-1">
            <TabsTrigger 
              value="map" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200"
            >
              <MapPin className="w-4 h-4" />
              Risk Map
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="classification" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200"
            >
              <AlertTriangle className="w-4 h-4" />
              ML Classification
            </TabsTrigger>
            <TabsTrigger 
              value="data" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200"
            >
              <Database className="w-4 h-4" />
              Dataset
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <Card className="shadow-xl border-0 ring-1 ring-gray-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <MapPin className="w-5 h-5" />
                  Interactive Risk Heat Map
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Real-time visualization of accident frequency and risk zones with interactive zone analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AccidentMap accidentData={accidentData} zoneData={zoneData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <DataAnalysis accidentData={accidentData} zoneData={zoneData} />
          </TabsContent>

          <TabsContent value="classification" className="space-y-4">
            <ZoneClassification zoneData={zoneData} />
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <AccidentDataTable accidentData={accidentData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
