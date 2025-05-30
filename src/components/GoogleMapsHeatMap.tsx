
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccidentData, ZoneData, getRiskColor } from '@/lib/accidentAnalysis';
import { MapPin, AlertTriangle } from 'lucide-react';

interface GoogleMapsHeatMapProps {
  accidentData: AccidentData[];
  zoneData: ZoneData[];
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMapsHeatMap = ({ accidentData, zoneData }: GoogleMapsHeatMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const heatmapRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Create script tag for Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Define global callback
      window.initMap = initializeMap;

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
        delete window.initMap;
      };
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Center map on New York City
      const center = { lat: 40.7128, lng: -74.0060 };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 11,
        center: center,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'all',
            stylers: [{ saturation: -60 }]
          }
        ]
      });

      // Add zone markers
      zoneData.forEach((zone) => {
        const marker = new window.google.maps.Marker({
          position: { lat: zone.latitude, lng: zone.longitude },
          map: mapInstanceRef.current,
          title: zone.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: getRiskColor(zone.riskLevel),
            fillOpacity: 0.8,
            strokeColor: '#fff',
            strokeWeight: 2,
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: ${getRiskColor(zone.riskLevel)};">
                ${zone.name}
              </h3>
              <p style="margin: 4px 0;"><strong>Risk Level:</strong> ${zone.riskLevel.toUpperCase()}</p>
              <p style="margin: 4px 0;"><strong>Accidents:</strong> ${zone.accidentCount}</p>
              <p style="margin: 4px 0;"><strong>Risk Score:</strong> ${zone.riskScore}</p>
              <p style="margin: 4px 0;"><strong>Population:</strong> ${zone.population.toLocaleString()}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
      });

      // Create heatmap data
      const heatmapData = accidentData.map((accident) => ({
        location: new window.google.maps.LatLng(accident.latitude, accident.longitude),
        weight: accident.severity === 'fatal' ? 4 : 
                accident.severity === 'severe' ? 3 : 
                accident.severity === 'moderate' ? 2 : 1
      }));

      // Add heatmap layer
      heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: mapInstanceRef.current,
        radius: 20,
        opacity: 0.6,
        gradient: [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
      });
    };

    loadGoogleMaps();
  }, [accidentData, zoneData]);

  const toggleHeatmap = () => {
    if (heatmapRef.current) {
      heatmapRef.current.setMap(
        heatmapRef.current.getMap() ? null : mapInstanceRef.current
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* API Key Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> To see the real Google Maps, you need to add your Google Maps API key. 
              Replace "YOUR_API_KEY" in the GoogleMapsHeatMap component with your actual API key.
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Real-Time Risk Heat Map</CardTitle>
              <CardDescription>
                Google Maps integration showing accident frequency and risk zones with heatmap overlay
              </CardDescription>
            </div>
            <button
              onClick={toggleHeatmap}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Toggle Heatmap
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef} 
            className="w-full h-96 bg-gray-200 rounded-lg border-2 border-gray-300"
            style={{ minHeight: '400px' }}
          >
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading Google Maps...
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Zone Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-600"></div>
                <span className="text-sm"><strong>Red Zone:</strong> High Risk (≥20 accidents)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-sm"><strong>Orange Zone:</strong> Medium Risk (10-19 accidents)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm"><strong>Yellow Zone:</strong> Low Risk (3-9 accidents)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm"><strong>Green Zone:</strong> Safe Zone (&lt;3 accidents)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Heatmap Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-2">
                Heat intensity based on accident severity:
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-800"></div>
                <span className="text-sm">Fatal Accidents (Weight: 4)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-600"></div>
                <span className="text-sm">Severe Accidents (Weight: 3)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-sm">Moderate Accidents (Weight: 2)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Minor Accidents (Weight: 1)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone Statistics */}
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

export default GoogleMapsHeatMap;
