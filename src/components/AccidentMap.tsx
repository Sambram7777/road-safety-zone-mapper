import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccidentData, ZoneData, getRiskColor } from '@/lib/accidentAnalysis';
import { MapPin, AlertTriangle } from 'lucide-react';

interface AccidentMapProps {
  accidentData: AccidentData[];
  zoneData: ZoneData[];
}

const AccidentMap = ({ accidentData, zoneData }: AccidentMapProps) => {
  // Create a simple visualization using CSS positioning
  const mapBounds = {
    minLat: Math.min(...zoneData.map(z => z.latitude)) - 0.05,
    maxLat: Math.max(...zoneData.map(z => z.latitude)) + 0.05,
    minLng: Math.min(...zoneData.map(z => z.longitude)) - 0.05,
    maxLng: Math.max(...zoneData.map(z => z.longitude)) + 0.05,
  };

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <div className="space-y-6">
      {/* Map Visualization */}
      <div className="relative w-full h-96 bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
        {/* Map Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/37c9d574-ac80-4754-9bf6-8101a91355f6.png')`
          }}
        />
        
        {/* Overlay for better visibility */}
        <div className="absolute inset-0 bg-blue-900 opacity-10"></div>
        
        <div className="absolute inset-0">
          {/* Zone Areas */}
          {zoneData.map((zone) => {
            const position = getPosition(zone.latitude, zone.longitude);
            return (
              <div
                key={zone.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full opacity-60 flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: getRiskColor(zone.riskLevel) }}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: getRiskColor(zone.riskLevel) }}
                  />
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                  <div className="bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap border">
                    {zone.name}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Accident Points */}
          {accidentData.slice(0, 50).map((accident) => {
            const position = getPosition(accident.latitude, accident.longitude);
            return (
              <div
                key={accident.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
              >
                <div
                  className={`w-3 h-3 rounded-full shadow-lg border border-white ${
                    accident.severity === 'fatal' ? 'bg-red-800' :
                    accident.severity === 'severe' ? 'bg-red-600' :
                    accident.severity === 'moderate' ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`}
                  title={`${accident.location} - ${accident.severity} - ${accident.date}`}
                />
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <h4 className="font-semibold text-sm mb-2">Risk Zones</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span>High Risk (Red)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Medium Risk (Orange)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Low Risk (Yellow)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Safe Zone (Green)</span>
            </div>
          </div>
        </div>

        {/* Accident Legend */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
          <h4 className="font-semibold text-sm mb-2">Accident Severity</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-800"></div>
              <span>Fatal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span>Severe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Minor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {zoneData.map((zone) => (
          <Card key={zone.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{zone.name}</CardTitle>
                <Badge 
                  variant="secondary"
                  style={{ 
                    backgroundColor: getRiskColor(zone.riskLevel) + '20',
                    color: getRiskColor(zone.riskLevel),
                    borderColor: getRiskColor(zone.riskLevel)
                  }}
                >
                  {zone.riskLevel.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Accidents:</span>
                  <span className="font-medium">{zone.accidentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Score:</span>
                  <span className="font-medium">{zone.riskScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Population:</span>
                  <span className="font-medium">{zone.population.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccidentMap;
