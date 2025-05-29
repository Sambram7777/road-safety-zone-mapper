
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ZoneData, getRiskColor } from '@/lib/accidentAnalysis';
import { AlertTriangle, CheckCircle, Clock, Shield, MapPin, Users, TrendingUp } from 'lucide-react';

interface ZoneClassificationProps {
  zoneData: ZoneData[];
}

const ZoneClassification = ({ zoneData }: ZoneClassificationProps) => {
  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'red': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'orange': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'yellow': return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      case 'green': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRiskDescription = (riskLevel: string) => {
    switch (riskLevel) {
      case 'red': return 'High accident frequency with severe incidents. Immediate safety interventions required.';
      case 'orange': return 'Moderate accident frequency. Regular monitoring and preventive measures needed.';
      case 'yellow': return 'Low accident frequency with some historical incidents. Periodic safety reviews recommended.';
      case 'green': return 'Minimal to no accidents recorded. Maintain current safety standards.';
      default: return 'Risk level undefined.';
    }
  };

  const sortedZones = [...zoneData].sort((a, b) => {
    const riskOrder = { red: 4, orange: 3, yellow: 2, green: 1 };
    return riskOrder[b.riskLevel as keyof typeof riskOrder] - riskOrder[a.riskLevel as keyof typeof riskOrder];
  });

  return (
    <div className="space-y-6">
      {/* Classification Overview */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>ML Classification Algorithm:</strong> Zones are classified based on accident frequency, severity scores, 
          population density, and historical patterns using a weighted risk assessment model.
        </AlertDescription>
      </Alert>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedZones.map((zone) => (
          <Card key={zone.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRiskIcon(zone.riskLevel)}
                  <CardTitle className="text-lg">{zone.name}</CardTitle>
                </div>
                <Badge 
                  variant="secondary"
                  style={{ 
                    backgroundColor: getRiskColor(zone.riskLevel) + '20',
                    color: getRiskColor(zone.riskLevel),
                    borderColor: getRiskColor(zone.riskLevel)
                  }}
                  className="font-semibold"
                >
                  {zone.riskLevel.toUpperCase()} ZONE
                </Badge>
              </div>
              <CardDescription>
                {getRiskDescription(zone.riskLevel)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">{zone.accidentCount}</div>
                    <div className="text-sm text-gray-600">Accidents</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">{zone.riskScore}</div>
                    <div className="text-sm text-gray-600">Risk Score</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">{(zone.population / 1000).toFixed(1)}K</div>
                    <div className="text-sm text-gray-600">Population</div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Lat: {zone.latitude.toFixed(4)}, Lng: {zone.longitude.toFixed(4)}</span>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Safety Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {zone.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Priority */}
                <div className={`p-3 rounded-lg border-l-4 ${
                  zone.riskLevel === 'red' ? 'bg-red-50 border-red-500' :
                  zone.riskLevel === 'orange' ? 'bg-orange-50 border-orange-500' :
                  zone.riskLevel === 'yellow' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-green-50 border-green-500'
                }`}>
                  <div className="font-medium text-sm">
                    {zone.riskLevel === 'red' && '🚨 Immediate Action Required'}
                    {zone.riskLevel === 'orange' && '⚠️ Monitor and Improve'}
                    {zone.riskLevel === 'yellow' && '📊 Regular Assessment'}
                    {zone.riskLevel === 'green' && '✅ Maintain Standards'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {zone.riskLevel === 'red' && 'Deploy safety measures within 30 days'}
                    {zone.riskLevel === 'orange' && 'Implement improvements within 90 days'}
                    {zone.riskLevel === 'yellow' && 'Review safety measures quarterly'}
                    {zone.riskLevel === 'green' && 'Annual safety assessment recommended'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ML Model Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            ML Classification Model Details
          </CardTitle>
          <CardDescription>
            Technical details about the machine learning approach used for zone classification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Algorithm Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Accident Frequency:</strong> Total number of accidents in the zone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Severity Weighting:</strong> Minor(1), Moderate(2), Severe(3), Fatal(4)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Population Density:</strong> Normalized by population per zone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Temporal Patterns:</strong> Historical accident trends analysis</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Classification Thresholds</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span><strong>Red Zone:</strong> ≥20 accidents OR risk score ≥80</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span><strong>Orange Zone:</strong> ≥10 accidents OR risk score ≥50</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span><strong>Yellow Zone:</strong> ≥3 accidents OR risk score ≥20</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span><strong>Green Zone:</strong> <3 accidents AND risk score <20</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZoneClassification;
