
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccidentData } from '@/lib/accidentAnalysis';
import { Search, Calendar, MapPin, AlertCircle } from 'lucide-react';

interface AccidentDataTableProps {
  accidentData: AccidentData[];
}

const AccidentDataTable = ({ accidentData }: AccidentDataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [weatherFilter, setWeatherFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data
  const filteredData = accidentData.filter(accident => {
    const matchesSearch = accident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accident.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || accident.severity === severityFilter;
    const matchesWeather = weatherFilter === 'all' || accident.weather === weatherFilter;
    
    return matchesSearch && matchesSeverity && matchesWeather;
  });

  // Paginate data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'fatal': return 'bg-red-100 text-red-800 border-red-200';
      case 'severe': return 'bg-red-50 text-red-700 border-red-100';
      case 'moderate': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'minor': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'clear': return '☀️';
      case 'rain': return '🌧️';
      case 'fog': return '🌫️';
      case 'snow': return '❄️';
      default: return '🌤️';
    }
  };

  const getRoadTypeIcon = (roadType: string) => {
    switch (roadType) {
      case 'highway': return '🛣️';
      case 'urban': return '🏙️';
      case 'rural': return '🌾';
      case 'intersection': return '🚦';
      default: return '🛣️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filter Accident Data
          </CardTitle>
          <CardDescription>
            Search and filter through {accidentData.length} accident records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by location or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
                <SelectItem value="fatal">Fatal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={weatherFilter} onValueChange={setWeatherFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by weather" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Weather</SelectItem>
                <SelectItem value="clear">Clear</SelectItem>
                <SelectItem value="rain">Rain</SelectItem>
                <SelectItem value="fog">Fog</SelectItem>
                <SelectItem value="snow">Snow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredData.length} of {accidentData.length} accidents
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Accident Records Database
          </CardTitle>
          <CardDescription>
            Detailed view of all accident data with ML-derived insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">ID</th>
                  <th className="text-left p-3 font-semibold">Location</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Time</th>
                  <th className="text-left p-3 font-semibold">Severity</th>
                  <th className="text-left p-3 font-semibold">Weather</th>
                  <th className="text-left p-3 font-semibold">Road Type</th>
                  <th className="text-left p-3 font-semibold">Casualties</th>
                  <th className="text-left p-3 font-semibold">Coordinates</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((accident) => (
                  <tr key={accident.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono text-sm">{accident.id}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{accident.location}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(accident.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono">{accident.time}</td>
                    <td className="p-3">
                      <Badge className={getSeverityColor(accident.severity)}>
                        {accident.severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{getWeatherIcon(accident.weather)}</span>
                        <span className="capitalize">{accident.weather}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{getRoadTypeIcon(accident.roadType)}</span>
                        <span className="capitalize">{accident.roadType}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-bold ${accident.casualties > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {accident.casualties}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs text-gray-500">
                      <div>{accident.latitude.toFixed(4)}</div>
                      <div>{accident.longitude.toFixed(4)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Dataset Summary</CardTitle>
          <CardDescription>Key statistics from the current filtered dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{filteredData.length}</div>
              <div className="text-sm text-blue-600">Total Records</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">
                {filteredData.filter(a => a.severity === 'fatal' || a.severity === 'severe').length}
              </div>
              <div className="text-sm text-red-600">Critical Incidents</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">
                {filteredData.reduce((sum, a) => sum + a.casualties, 0)}
              </div>
              <div className="text-sm text-orange-600">Total Casualties</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {new Set(filteredData.map(a => a.location)).size}
              </div>
              <div className="text-sm text-green-600">Unique Locations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccidentDataTable;
