'use client';

import React from 'react';
import type { SensorData } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SensorPopupContent from './sensor-popup-content';

interface MapViewProps {
  sensors: SensorData[];
  timelineValue: number;
  isGreenMode: boolean;
  activeSensorId: number | null;
  onSensorSelect: (id: number | null) => void;
  activeSensor: SensorData | null;
}

const getStatusColor = (value: number) => {
  if (value > 80) return '#ef4444'; // Red
  if (value > 60) return '#f59e0b'; // Amber
  return '#10b981'; // Green
};

const DummyMap = ({ sensors, activeSensorId, onSensorSelect, timelineValue, isGreenMode, activeSensor }: MapViewProps) => {
  const activeSensorDataPoint = activeSensor ? activeSensor.history[timelineValue] : null;

  return (
    <div className="w-full h-full bg-[#f0f0f0] overflow-hidden relative">
        <Popover open={!!activeSensor} onOpenChange={(isOpen) => !isOpen && onSensorSelect(null)}>
            <svg width="100%" height="100%" viewBox="0 0 800 600">
                {/* Roads */}
                <path d="M 0 100 L 800 120" stroke="#dcdcdc" strokeWidth="15" fill="none" />
                <path d="M 0 400 L 800 380" stroke="#dcdcdc" strokeWidth="20" fill="none" />
                <path d="M 150 0 L 160 600" stroke="#dcdcdc" strokeWidth="12" fill="none" />
                <path d="M 600 0 L 580 600" stroke="#dcdcdc" strokeWidth="18" fill="none" />
                <path d="M 300 110 L 320 390" stroke="#dcdcdc" strokeWidth="8" fill="none" />
                <path d="M 160 250 L 590 260" stroke="#dcdcdc" strokeWidth="10" fill="none" />

                {/* Buildings / Houses */}
                <rect x="50" y="20" width="80" height="60" fill="#a0aec0" />
                <rect x="200" y="30" width="60" height="50" fill="#a0aec0" />
                <rect x="350" y="50" width="120" height="40" fill="#a0aec0" />
                <rect x="500" y="20" width="80" height="80" fill="#a0aec0" />
                <rect x="650" y="40" width="100" height="60" fill="#a0aec0" />

                <rect x="20" y="150" width="110" height="80" fill="#b0c4de" />
                <rect x="200" y="150" width="80" height="80" fill="#b0c4de" />
                <rect x="400" y="160" width="150" height="70" fill="#a0aec0" />
                <rect x="650" y="150" width="120" height="90" fill="#b0c4de" />

                <rect x="50" y="300" width="90" height="60" fill="#b0c4de" />
                <rect x="200" y="310" width="70" height="50" fill="#a0aec0" />
                <rect x="350" y="300" width="100" height="60" fill="#b0c4de" />

                <rect x="30" y="450" width="100" height="100" fill="#a0aec0" />
                <rect x="180" y="460" width="120" height="80" fill="#b0c4de" />
                <rect x="350" y="450" width="200" height="120" fill="#a0aec0" />
                <rect x="600" y="440" width="150" height="100" fill="#b0c4de" />

                {/* Sensor Markers */}
                {sensors.map(sensor => {
                const dataPoint = sensor.history[0]; // Use a fixed point for stable color
                if (!dataPoint) return null;
                const isSelected = sensor.id === activeSensorId;
                const color = getStatusColor(dataPoint.value);
                const scaledX = (sensor.lng - 77.5921) * 200000;
                const scaledY = (sensor.lat - 12.9690) * 200000;
                const marker = (
                    <circle
                        key={sensor.id}
                        cx={scaledX}
                        cy={scaledY}
                        r={isSelected ? 10 : 6}
                        fill={color}
                        stroke={isSelected ? '#374151' : 'white'}
                        strokeWidth={isSelected ? 3 : 2}
                        onClick={() => onSensorSelect(sensor.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <title>{sensor.name}</title>
                    </circle>
                );

                if (isSelected) {
                    return (
                        <PopoverTrigger key={`trigger-${sensor.id}`} asChild>
                           {marker}
                        </PopoverTrigger>
                    )
                }
                return marker;
                })}
            </svg>
            {activeSensor && activeSensorDataPoint && (
                <PopoverContent className="w-80 p-0" side="top" align="center" sideOffset={15}>
                    <SensorPopupContent sensor={activeSensor} dataPoint={activeSensorDataPoint} timelineValue={timelineValue} isGreenMode={isGreenMode} />
                </PopoverContent>
            )}
        </Popover>
    </div>
  );
};

const MapView: React.FC<MapViewProps> = (props) => {
  return <DummyMap {...props} />;
};

export default MapView;
