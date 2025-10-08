import type { SensorData, HistoryPoint } from './types';

export const getMockSensorData = (): SensorData[] => {
  const siteCenter: [number, number] = [12.9716, 77.5946]; // Bangalore, India
  const sensorCount = 15;
  const sensorData: SensorData[] = [];
  const now = new Date();

  const assetNames = [
    'HVAC Unit A-1', 'Water Pump 3', 'Lighting Grid B', 'Solar Inverter 7',
    'Air Quality Monitor', 'Energy Meter C4', 'Substation T-82', 'Water Main Inlet',
    'Perimeter Lighting', 'Generator G-2', 'Cooling Tower 1', 'Exhaust Fan E-5',
    'Smart Window Actuator', 'EV Charger 04', 'Greywater Recycler'
  ];

  for (let i = 0; i < sensorCount; i++) {
    const history: HistoryPoint[] = [];
    for (let h = 0; h < 24; h++) {
      const timestamp = new Date(now.getTime() - h * 60 * 60 * 1000);
      const baseValue = Math.sin(h * 0.5 + i) * 20 + 50 + Math.random() * 10;
      const value = Math.max(0, baseValue);
      history.push({
        timestamp,
        value,
        predicted: value * (1 + (Math.random() - 0.4) * 0.1),
        co2e: value * 0.45,
      });
    }
    sensorData.push({
      id: i,
      name: assetNames[i % assetNames.length],
      lat: siteCenter[0] + (Math.random() - 0.5) * 0.005,
      lng: siteCenter[1] + (Math.random() - 0.5) * 0.005,
      unit: i % 3 === 0 ? 'kWh' : (i % 3 === 1 ? 'm³' : 'ppm'),
      history: history.reverse(),
    });
  }

  return sensorData;
};
