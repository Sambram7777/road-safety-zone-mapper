
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

// Real New York locations with hypothetical accident data
export const generateAccidentData = (): AccidentData[] => {
  const locations = [
    // High-risk areas (Manhattan busy intersections)
    { name: "Times Square", lat: 40.7580, lng: -73.9855, risk: 'high' },
    { name: "Columbus Circle", lat: 40.7681, lng: -73.9819, risk: 'high' },
    { name: "Union Square", lat: 40.7359, lng: -73.9911, risk: 'high' },
    { name: "Grand Central Terminal", lat: 40.7527, lng: -73.9772, risk: 'high' },
    { name: "Brooklyn Bridge Entrance", lat: 40.7061, lng: -73.9969, risk: 'high' },
    
    // Medium-risk areas
    { name: "Central Park South", lat: 40.7829, lng: -73.9654, risk: 'medium' },
    { name: "Williamsburg Bridge", lat: 40.7134, lng: -73.9630, risk: 'medium' },
    { name: "Queens Boulevard", lat: 40.7282, lng: -73.7949, risk: 'medium' },
    { name: "Atlantic Avenue Brooklyn", lat: 40.6892, lng: -73.9442, risk: 'medium' },
    { name: "Bronx Concourse Plaza", lat: 40.8176, lng: -73.9482, risk: 'medium' },
    
    // Low-risk areas (residential/suburban)
    { name: "Park Slope Brooklyn", lat: 40.6782, lng: -73.9776, risk: 'low' },
    { name: "Astoria Queens", lat: 40.7722, lng: -73.9196, risk: 'low' },
    { name: "Staten Island Mall", lat: 40.5795, lng: -74.1502, risk: 'low' },
    { name: "Riverdale Bronx", lat: 40.8988, lng: -73.9143, risk: 'low' },
    { name: "Bay Ridge Brooklyn", lat: 40.6323, lng: -74.0250, risk: 'low' },
    
    // Very safe areas
    { name: "Central Park Reservoir", lat: 40.7851, lng: -73.9658, risk: 'safe' },
    { name: "Prospect Park Brooklyn", lat: 40.6602, lng: -73.9690, risk: 'safe' },
    { name: "Staten Island Greenbelt", lat: 40.5795, lng: -74.1502, risk: 'safe' },
  ];

  const accidents: AccidentData[] = [];
  
  locations.forEach((location, index) => {
    let accidentCount;
    if (location.risk === 'high') accidentCount = Math.floor(Math.random() * 20) + 25; // 25-45 accidents
    else if (location.risk === 'medium') accidentCount = Math.floor(Math.random() * 15) + 8; // 8-23 accidents
    else if (location.risk === 'low') accidentCount = Math.floor(Math.random() * 8) + 2; // 2-10 accidents
    else accidentCount = Math.floor(Math.random() * 3); // 0-3 accidents

    for (let i = 0; i < accidentCount; i++) {
      const severityRand = Math.random();
      let severity: 'minor' | 'moderate' | 'severe' | 'fatal';
      
      if (location.risk === 'high') {
        if (severityRand < 0.1) severity = 'fatal';
        else if (severityRand < 0.3) severity = 'severe';
        else if (severityRand < 0.6) severity = 'moderate';
        else severity = 'minor';
      } else if (location.risk === 'medium') {
        if (severityRand < 0.05) severity = 'fatal';
        else if (severityRand < 0.2) severity = 'severe';
        else if (severityRand < 0.5) severity = 'moderate';
        else severity = 'minor';
      } else {
        if (severityRand < 0.02) severity = 'fatal';
        else if (severityRand < 0.1) severity = 'severe';
        else if (severityRand < 0.3) severity = 'moderate';
        else severity = 'minor';
      }

      const accident: AccidentData = {
        id: `acc_${index}_${i}`,
        latitude: location.lat + (Math.random() - 0.5) * 0.008, // Smaller radius for realistic clustering
        longitude: location.lng + (Math.random() - 0.5) * 0.008,
        date: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        severity,
        location: location.name,
        weather: ['clear', 'rain', 'fog', 'snow'][Math.floor(Math.random() * 4)] as any,
        roadType: ['highway', 'urban', 'rural', 'intersection'][Math.floor(Math.random() * 4)] as any,
        casualties: severity === 'fatal' ? Math.floor(Math.random() * 3) + 1 : 
                   severity === 'severe' ? Math.floor(Math.random() * 4) : 
                   Math.floor(Math.random() * 2),
      };
      accidents.push(accident);
    }
  });

  return accidents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Real zone analysis for New York locations
export const analyzeAccidentZones = (accidents: AccidentData[]): ZoneData[] => {
  const zones: ZoneData[] = [
    {
      id: 'zone_1',
      name: 'Midtown Manhattan',
      latitude: 40.7580,
      longitude: -73.9855,
      accidentCount: 0,
      riskLevel: 'red',
      riskScore: 0,
      population: 28000,
      recommendations: []
    },
    {
      id: 'zone_2',
      name: 'Lower Manhattan',
      latitude: 40.7061,
      longitude: -73.9969,
      accidentCount: 0,
      riskLevel: 'red',
      riskScore: 0,
      population: 22000,
      recommendations: []
    },
    {
      id: 'zone_3',
      name: 'Upper West Side',
      latitude: 40.7829,
      longitude: -73.9654,
      accidentCount: 0,
      riskLevel: 'orange',
      riskScore: 0,
      population: 25000,
      recommendations: []
    },
    {
      id: 'zone_4',
      name: 'Williamsburg Brooklyn',
      latitude: 40.7134,
      longitude: -73.9630,
      accidentCount: 0,
      riskLevel: 'orange',
      riskScore: 0,
      population: 18000,
      recommendations: []
    },
    {
      id: 'zone_5',
      name: 'Queens Boulevard Corridor',
      latitude: 40.7282,
      longitude: -73.7949,
      accidentCount: 0,
      riskLevel: 'yellow',
      riskScore: 0,
      population: 32000,
      recommendations: []
    },
    {
      id: 'zone_6',
      name: 'Park Slope Brooklyn',
      latitude: 40.6782,
      longitude: -73.9776,
      accidentCount: 0,
      riskLevel: 'yellow',
      riskScore: 0,
      population: 15000,
      recommendations: []
    },
    {
      id: 'zone_7',
      name: 'Astoria Queens',
      latitude: 40.7722,
      longitude: -73.9196,
      accidentCount: 0,
      riskLevel: 'green',
      riskScore: 0,
      population: 20000,
      recommendations: []
    },
    {
      id: 'zone_8',
      name: 'Staten Island Residential',
      latitude: 40.5795,
      longitude: -74.1502,
      accidentCount: 0,
      riskLevel: 'green',
      riskScore: 0,
      population: 12000,
      recommendations: []
    }
  ];

  // Calculate accident counts and risk scores for each zone
  zones.forEach(zone => {
    const zoneAccidents = accidents.filter(accident => {
      const distance = Math.sqrt(
        Math.pow((accident.latitude - zone.latitude) * 111, 2) + 
        Math.pow((accident.longitude - zone.longitude) * 85, 2) // Approximate NYC lat/lng to km conversion
      );
      return distance < 2; // Within 2km
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
        'Increase NYPD patrol frequency',
        'Add speed cameras and enforcement',
        'Improve pedestrian crossings',
        'Install traffic calming measures'
      ];
    } else if (zone.accidentCount >= 10 || zone.riskScore >= 50) {
      zone.riskLevel = 'orange';
      zone.recommendations = [
        'Add warning signs at intersections',
        'Improve road markings and visibility',
        'Install speed reduction measures',
        'Regular safety inspections',
        'Enhanced lighting systems'
      ];
    } else if (zone.accidentCount >= 3 || zone.riskScore >= 20) {
      zone.riskLevel = 'yellow';
      zone.recommendations = [
        'Monitor traffic patterns',
        'Quarterly safety reviews',
        'Community awareness programs',
        'Bike lane improvements'
      ];
    } else {
      zone.riskLevel = 'green';
      zone.recommendations = [
        'Maintain current safety measures',
        'Annual safety assessments',
        'Community engagement programs'
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
