
export interface AccidentData {
  id: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  severity: 'minor' | 'moderate' | 'severe' | 'fatal';
  location: string;
  weather: 'clear' | 'rain' | 'fog' | 'snow';
  roadType: 'highway' | 'urban' | 'rural' | 'intersection';
  casualties: number;
}

export interface ZoneData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  accidentCount: number;
  riskLevel: 'red' | 'orange' | 'yellow' | 'green';
  riskScore: number;
  population: number;
  recommendations: string[];
}

// Generate realistic accident data for demonstration
export const generateAccidentData = (): AccidentData[] => {
  const locations = [
    { name: "Downtown Main St", lat: 40.7128, lng: -74.0060, risk: 'high' },
    { name: "Highway 101 Junction", lat: 40.7589, lng: -73.9851, risk: 'high' },
    { name: "Central Park Area", lat: 40.7829, lng: -73.9654, risk: 'medium' },
    { name: "Brooklyn Bridge", lat: 40.7061, lng: -73.9969, risk: 'medium' },
    { name: "Queens Boulevard", lat: 40.7282, lng: -73.7949, risk: 'medium' },
    { name: "Residential Oak St", lat: 40.6892, lng: -74.0445, risk: 'low' },
    { name: "Suburban Pine Ave", lat: 40.7505, lng: -73.8458, risk: 'low' },
    { name: "University District", lat: 40.8176, lng: -73.9482, risk: 'low' },
    { name: "Industrial Zone", lat: 40.6643, lng: -73.9385, risk: 'medium' },
    { name: "Airport Highway", lat: 40.6413, lng: -73.7781, risk: 'high' },
  ];

  const accidents: AccidentData[] = [];
  
  // Generate accidents based on risk levels
  locations.forEach((location, index) => {
    let accidentCount;
    if (location.risk === 'high') accidentCount = Math.floor(Math.random() * 25) + 15; // 15-40 accidents
    else if (location.risk === 'medium') accidentCount = Math.floor(Math.random() * 15) + 5; // 5-20 accidents
    else accidentCount = Math.floor(Math.random() * 8) + 0; // 0-8 accidents

    for (let i = 0; i < accidentCount; i++) {
      const accident: AccidentData = {
        id: `acc_${index}_${i}`,
        latitude: location.lat + (Math.random() - 0.5) * 0.01,
        longitude: location.lng + (Math.random() - 0.5) * 0.01,
        date: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        severity: ['minor', 'moderate', 'severe', 'fatal'][Math.floor(Math.random() * 4)] as any,
        location: location.name,
        weather: ['clear', 'rain', 'fog', 'snow'][Math.floor(Math.random() * 4)] as any,
        roadType: ['highway', 'urban', 'rural', 'intersection'][Math.floor(Math.random() * 4)] as any,
        casualties: Math.floor(Math.random() * 5),
      };
      accidents.push(accident);
    }
  });

  return accidents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Analyze accident data and classify zones
export const analyzeAccidentZones = (accidents: AccidentData[]): ZoneData[] => {
  const zones: ZoneData[] = [
    {
      id: 'zone_1',
      name: 'Downtown Commercial District',
      latitude: 40.7128,
      longitude: -74.0060,
      accidentCount: 0,
      riskLevel: 'red',
      riskScore: 0,
      population: 25000,
      recommendations: []
    },
    {
      id: 'zone_2',
      name: 'Highway 101 Corridor',
      latitude: 40.7589,
      longitude: -73.9851,
      accidentCount: 0,
      riskLevel: 'red',
      riskScore: 0,
      population: 15000,
      recommendations: []
    },
    {
      id: 'zone_3',
      name: 'Central Park Vicinity',
      latitude: 40.7829,
      longitude: -73.9654,
      accidentCount: 0,
      riskLevel: 'orange',
      riskScore: 0,
      population: 18000,
      recommendations: []
    },
    {
      id: 'zone_4',
      name: 'Brooklyn Bridge Area',
      latitude: 40.7061,
      longitude: -73.9969,
      accidentCount: 0,
      riskLevel: 'orange',
      riskScore: 0,
      population: 12000,
      recommendations: []
    },
    {
      id: 'zone_5',
      name: 'Queens Residential',
      latitude: 40.7282,
      longitude: -73.7949,
      accidentCount: 0,
      riskLevel: 'yellow',
      riskScore: 0,
      population: 22000,
      recommendations: []
    },
    {
      id: 'zone_6',
      name: 'Suburban Oak District',
      latitude: 40.6892,
      longitude: -74.0445,
      accidentCount: 0,
      riskLevel: 'green',
      riskScore: 0,
      population: 8000,
      recommendations: []
    },
    {
      id: 'zone_7',
      name: 'University Campus',
      latitude: 40.8176,
      longitude: -73.9482,
      accidentCount: 0,
      riskLevel: 'green',
      riskScore: 0,
      population: 30000,
      recommendations: []
    },
    {
      id: 'zone_8',
      name: 'Industrial Sector',
      latitude: 40.6643,
      longitude: -73.9385,
      accidentCount: 0,
      riskLevel: 'yellow',
      riskScore: 0,
      population: 5000,
      recommendations: []
    }
  ];

  // Calculate accident counts and risk scores for each zone
  zones.forEach(zone => {
    const zoneAccidents = accidents.filter(accident => {
      const distance = Math.sqrt(
        Math.pow(accident.latitude - zone.latitude, 2) + 
        Math.pow(accident.longitude - zone.longitude, 2)
      );
      return distance < 0.02; // Within roughly 2km
    });

    zone.accidentCount = zoneAccidents.length;
    
    // Calculate risk score based on accidents, severity, and population density
    const severityWeights = { minor: 1, moderate: 2, severe: 3, fatal: 4 };
    const totalSeverityScore = zoneAccidents.reduce((sum, acc) => 
      sum + severityWeights[acc.severity], 0
    );
    
    zone.riskScore = Math.round(
      (zone.accidentCount * 10 + totalSeverityScore * 5) / (zone.population / 1000)
    );

    // Classify risk level based on accident count and severity
    if (zone.accidentCount >= 20 || zone.riskScore >= 80) {
      zone.riskLevel = 'red';
      zone.recommendations = [
        'Install additional traffic lights',
        'Increase police patrol frequency',
        'Add speed cameras',
        'Improve road lighting',
        'Install pedestrian barriers'
      ];
    } else if (zone.accidentCount >= 10 || zone.riskScore >= 50) {
      zone.riskLevel = 'orange';
      zone.recommendations = [
        'Add warning signs',
        'Improve road markings',
        'Install speed bumps',
        'Regular safety inspections'
      ];
    } else if (zone.accidentCount >= 3 || zone.riskScore >= 20) {
      zone.riskLevel = 'yellow';
      zone.recommendations = [
        'Monitor traffic patterns',
        'Quarterly safety reviews',
        'Community awareness programs'
      ];
    } else {
      zone.riskLevel = 'green';
      zone.recommendations = [
        'Maintain current safety measures',
        'Annual safety assessments'
      ];
    }
  });

  return zones;
};

export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'red': return '#dc2626';
    case 'orange': return '#ea580c';
    case 'yellow': return '#ca8a04';
    case 'green': return '#16a34a';
    default: return '#6b7280';
  }
};
