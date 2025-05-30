import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccidentData, ZoneData, getRiskColor } from '@/lib/accidentAnalysis';
import { MapPin, AlertTriangle, Eye, Info } from 'lucide-react';
import { useState } from 'react';

interface AccidentMapProps {
  accidentData: AccidentData[];
  zoneData: ZoneData[];
}

const AccidentMap = ({ accidentData, zoneData }: AccidentMapProps) => {
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [hoveredAccident, setHoveredAccident] = useState<AccidentData | null>(null);

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
      <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border shadow-lg overflow-hidden">
        {/* Map Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
          style={{
            backgroundImage: `url('/lovable-uploads/e9ec3d3b-1ad2-46e5-a8c3-e08f9f46853e.png')`
          }}
        />
        
        {/* Dynamic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
        
        <div className="absolute inset-0">
          {/* Zone Areas with Enhanced Styling */}
          {zoneData.map((zone) => {
            const position = getPosition(zone.latitude, zone.longitude);
            const isSelected = selectedZone?.id === zone.id;
            return (
              <div
                key={zone.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                onClick={() => setSelectedZone(isSelected ? null : zone)}
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isSelected ? 'scale-125 animate-pulse' : 'hover:scale-110'
                  }`}
                  style={{ 
                    backgroundColor: getRiskColor(zone.riskLevel) + '40',
                    border: `3px solid ${getRiskColor(zone.riskLevel)}`,
                    boxShadow: `0 0 20px ${getRiskColor(zone.riskLevel)}50`
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white shadow-xl transition-all duration-300"
                    style={{ backgroundColor: getRiskColor(zone.riskLevel) }}
                  />
                </div>
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-300 ${
                  isSelected ? 'scale-110' : ''
                }`}>
                  <div className="bg-white px-3 py-2 rounded-lg shadow-xl text-xs font-medium whitespace-nowrap border-2 border-gray-100">
                    <div className="font-semibold text-gray-800">{zone.name}</div>
                    <div className="text-gray-500">{zone.accidentCount} accidents</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Accident Points with Enhanced Interactivity */}
          {accidentData.slice(0, 60).map((accident) => {
            const position = getPosition(accident.latitude, accident.longitude);
            const isHovered = hoveredAccident?.id === accident.id;
            return (
              <div
                key={accident.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                onMouseEnter={() => setHoveredAccident(accident)}
                onMouseLeave={() => setHoveredAccident(null)}
              >
                <div
                  className={`w-4 h-4 rounded-full shadow-lg border-2 border-white transition-all duration-200 ${
                    isHovered ? 'scale-150 z-50' : 'hover:scale-125'
                  } ${
                    accident.severity === 'fatal' ? 'bg-red-800 shadow-red-500/50' :
                    accident.severity === 'severe' ? 'bg-red-600 shadow-red-400/50' :
                    accident.severity === 'moderate' ? 'bg-orange-500 shadow-orange-400/50' :
                    'bg-yellow-500 shadow-yellow-400/50'
                  }`}
                />
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-fade-in">
                    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs whitespace-nowrap">
                      <div className="font-semibold">{accident.location}</div>
                      <div className="text-gray-300">{accident.severity} - {accident.date}</div>
                      <div className="text-gray-400">{accident.time}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Enhanced Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            Risk Zones
          </h4>
          <div className="space-y-2 text-xs">
            {[
              { level: 'red', label: 'High Risk', color: '#dc2626' },
              { level: 'orange', label: 'Medium Risk', color: '#f97316' },
              { level: 'yellow', label: 'Low Risk', color: '#eab308' },
              { level: 'green', label: 'Safe Zone', color: '#22c55e' }
            ].map(({ level, label, color }) => (
              <div key={level} className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded transition-colors">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Accident Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Accident Severity
          </h4>
          <div className="space-y-2 text-xs">
            {[
              { severity: 'fatal', label: 'Fatal', color: '#991b1b' },
              { severity: 'severe', label: 'Severe', color: '#dc2626' },
              { severity: 'moderate', label: 'Moderate', color: '#f97316' },
              { severity: 'minor', label: 'Minor', color: '#eab308' }
            ].map(({ severity, label, color }) => (
              <div key={severity} className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded transition-colors">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Info Panel */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border">
          <div className="flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Interactive Map</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Click zones • Hover accidents
          </div>
        </div>
      </div>

      {/* Zone Details with Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {zoneData.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;
          return (
            <Card 
              key={zone.id} 
              className={`shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                isSelected ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedZone(isSelected ? null : zone)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {zone.name}
                  </CardTitle>
                  <Badge 
                    variant="secondary"
                    className="font-semibold border-2 transition-all duration-200"
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
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">{zone.accidentCount}</div>
                    <div className="text-xs text-gray-600">Accidents</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">{zone.riskScore}</div>
                    <div className="text-xs text-gray-600">Risk Score</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">{(zone.population / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-gray-600">Population</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Zone Details */}
      {selectedZone && (
        <Card className="shadow-xl border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MapPin className="w-5 h-5" />
              {selectedZone.name} - Detailed Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive risk assessment and safety recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Safety Recommendations</h4>
                <ul className="space-y-2">
                  {selectedZone.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Zone Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Risk Level:</span>
                    <Badge style={{ backgroundColor: getRiskColor(selectedZone.riskLevel) + '20', color: getRiskColor(selectedZone.riskLevel) }}>
                      {selectedZone.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coordinates:</span>
                    <span className="font-mono text-sm">{selectedZone.latitude.toFixed(4)}, {selectedZone.longitude.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccidentMap;
