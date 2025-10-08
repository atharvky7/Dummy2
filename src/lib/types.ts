export type HistoryPoint = {
  timestamp: Date;
  value: number;
  predicted: number;
  co2e: number;
};

export type SensorData = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  unit: 'kWh' | 'm³' | 'ppm';
  history: HistoryPoint[];
};
