
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccidentMap from '@/components/AccidentMap';
import DataAnalysis from '@/components/DataAnalysis';
import ZoneClassification from '@/components/ZoneClassification';
import AccidentDataTable from '@/components/AccidentDataTable';
import { generateAccidentData, AccidentData, analyzeAccidentZones, ZoneData } from '@/lib/accidentAnalysis';
import { MapPin, AlertTriangle, BarChart3, Database } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Analyzing Road Accident Data...</h2>
          <p className="text-gray-500">Processing ML algorithms for zone classification</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Road Accident Analysis System
          </h1>
          <p className="text-lg text-gray-600">
            ML-powered accident frequency analysis and risk zone classification
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Accidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{totalAccidents}</div>
              <div className="flex items-center text-sm text-gray-500">
                <Database className="w-4 h-4 mr-1" />
                Last 2 years
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Red Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{redZones}</div>
              <div className="flex items-center text-sm text-red-500">
                <AlertTriangle className="w-4 h-4 mr-1" />
                High Risk
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Orange Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{orangeZones}</div>
              <div className="flex items-center text-sm text-orange-500">
                <MapPin className="w-4 h-4 mr-1" />
                Medium Risk
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">Yellow Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">{yellowZones}</div>
              <div className="flex items-center text-sm text-yellow-500">
                <MapPin className="w-4 h-4 mr-1" />
                Low Risk
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Green Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{greenZones}</div>
              <div className="flex items-center text-sm text-green-500">
                <MapPin className="w-4 h-4 mr-1" />
                Safe Zones
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Risk Map
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Data Analysis
            </TabsTrigger>
            <TabsTrigger value="classification" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Zone Classification
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Raw Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Accident Risk Heat Map</CardTitle>
                <CardDescription>
                  Interactive map showing accident frequency and risk zones
                </CardDescription>
              </CardHeader>
              <CardContent>
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
