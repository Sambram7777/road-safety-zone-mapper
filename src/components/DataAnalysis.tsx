
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccidentData, ZoneData } from '@/lib/accidentAnalysis';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DataAnalysisProps {
  accidentData: AccidentData[];
  zoneData: ZoneData[];
}

const DataAnalysis = ({ accidentData, zoneData }: DataAnalysisProps) => {
  // Prepare data for charts
  const severityData = [
    { name: 'Minor', count: accidentData.filter(a => a.severity === 'minor').length, color: '#fbbf24' },
    { name: 'Moderate', count: accidentData.filter(a => a.severity === 'moderate').length, color: '#f97316' },
    { name: 'Severe', count: accidentData.filter(a => a.severity === 'severe').length, color: '#dc2626' },
    { name: 'Fatal', count: accidentData.filter(a => a.severity === 'fatal').length, color: '#991b1b' },
  ];

  const weatherData = [
    { name: 'Clear', count: accidentData.filter(a => a.weather === 'clear').length },
    { name: 'Rain', count: accidentData.filter(a => a.weather === 'rain').length },
    { name: 'Fog', count: accidentData.filter(a => a.weather === 'fog').length },
    { name: 'Snow', count: accidentData.filter(a => a.weather === 'snow').length },
  ];

  const roadTypeData = [
    { name: 'Highway', count: accidentData.filter(a => a.roadType === 'highway').length },
    { name: 'Urban', count: accidentData.filter(a => a.roadType === 'urban').length },
    { name: 'Rural', count: accidentData.filter(a => a.roadType === 'rural').length },
    { name: 'Intersection', count: accidentData.filter(a => a.roadType === 'intersection').length },
  ];

  const zoneRiskData = zoneData.map(zone => ({
    name: zone.name.split(' ').slice(0, 2).join(' '),
    accidents: zone.accidentCount,
    riskScore: zone.riskScore,
    population: Math.round(zone.population / 1000),
  }));

  // Monthly trend data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i).toLocaleDateString('en-US', { month: 'short' });
    const count = accidentData.filter(a => {
      const accidentMonth = new Date(a.date).getMonth();
      return accidentMonth === i;
    }).length;
    return { month, accidents: count };
  });

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Severity Distribution */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Accident Severity Distribution</CardTitle>
          <CardDescription>Breakdown of accidents by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weather Conditions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Accidents by Weather Conditions</CardTitle>
          <CardDescription>Impact of weather on accident frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Road Type Analysis */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Accidents by Road Type</CardTitle>
          <CardDescription>Distribution across different road categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roadTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Zone Risk Analysis */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Zone Risk Analysis</CardTitle>
          <CardDescription>Risk scores vs accident counts by zone</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneRiskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="accidents" fill="#f59e0b" name="Accidents" />
              <Bar dataKey="riskScore" fill="#ef4444" name="Risk Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card className="shadow-lg lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Accident Trends</CardTitle>
          <CardDescription>Accident frequency throughout the year</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accidents" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Statistics */}
      <Card className="shadow-lg lg:col-span-2">
        <CardHeader>
          <CardTitle>Key ML Analysis Insights</CardTitle>
          <CardDescription>Statistical findings from the accident data analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">High-Risk Zones</h4>
              <p className="text-2xl font-bold text-red-700">
                {zoneData.filter(z => z.riskLevel === 'red').length}
              </p>
              <p className="text-sm text-red-600">
                Require immediate intervention
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Peak Risk Hour</h4>
              <p className="text-2xl font-bold text-blue-700">
                {(() => {
                  const hourCounts = Array.from({ length: 24 }, (_, i) => ({
                    hour: i,
                    count: accidentData.filter(a => parseInt(a.time.split(':')[0]) === i).length
                  }));
                  const peakHour = hourCounts.reduce((max, curr) => curr.count > max.count ? curr : max);
                  return `${peakHour.hour}:00`;
                })()}
              </p>
              <p className="text-sm text-blue-600">
                Most accidents occur
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Safest Zones</h4>
              <p className="text-2xl font-bold text-green-700">
                {zoneData.filter(z => z.riskLevel === 'green').length}
              </p>
              <p className="text-sm text-green-600">
                Maintain safety standards
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Risk Reduction</h4>
              <p className="text-2xl font-bold text-purple-700">
                {Math.round((zoneData.filter(z => z.riskLevel === 'green' || z.riskLevel === 'yellow').length / zoneData.length) * 100)}%
              </p>
              <p className="text-sm text-purple-600">
                Zones are low/safe risk
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataAnalysis;
