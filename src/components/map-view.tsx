'use client';

import React from 'react';
import type { SensorData } from '@/lib/types';
import SensorPopupContent from './sensor-popup-content';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Image from 'next/image';

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

// Function to convert lat/lng to pixel coordinates on a static image
const projectToImage = (lat: number, lng: number, mapCenter: { lat: number; lng: number }, imageSize: { width: number; height: number }, zoom: number) => {
    // This is a simplified projection and might need tweaking for accuracy.
    // It assumes a linear mapping around the center.
    const mapBounds = {
        north: mapCenter.lat + (0.005 * 1.2),
        south: mapCenter.lat - (0.005 * 1.2),
        east: mapCenter.lng + (0.01 * 1.2),
        west: mapCenter.lng - (0.01 * 1.2),
    };
    
    const lngRatio = (lng - mapBounds.west) / (mapBounds.east - mapBounds.west);
    const latRatio = (lat - mapBounds.north) / (mapBounds.south - mapBounds.north);

    return {
        x: lngRatio * imageSize.width,
        y: latRatio * imageSize.height,
    };
};


const MapView: React.FC<MapViewProps> = ({
  sensors,
  timelineValue,
  isGreenMode,
  activeSensorId,
  onSensorSelect,
  activeSensor,
}) => {
  const activeSensorDataPoint = activeSensor ? activeSensor.history[timelineValue] : null;

  const siteCenter = { lat: 12.9716, lng: 77.5946 };
  const imageSize = { width: 1920, height: 1080 }; // Assuming a 16:9 image

  return (
    <div className="relative w-full h-full">
        <Image 
            src="https://cdn.serc.carleton.edu/images/sp/library/google_earth/google_maps_hello_world.webp" 
            alt="Static map background"
            layout="fill"
            objectFit="cover"
            className="opacity-100"
            data-ai-hint="map city"
        />
        <div className="absolute inset-0">
            {sensors.map((sensor) => {
                const dataPoint = sensor.history[0];
                if (!dataPoint) return null;
                const color = getStatusColor(dataPoint.value);
                const position = projectToImage(sensor.lat, sensor.lng, siteCenter, imageSize, 15);

                const markerStyle: React.CSSProperties = {
                    position: 'absolute',
                    left: `${(position.x / imageSize.width) * 100}%`,
                    top: `${(position.y / imageSize.height) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    width: activeSensorId === sensor.id ? '16px' : '10px',
                    height: activeSensorId === sensor.id ? '16px' : '10px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    border: '2px solid white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                };
                
                return (
                    <Popover key={sensor.id} open={activeSensorId === sensor.id} onOpenChange={(open) => onSensorSelect(open ? sensor.id : null)}>
                        <PopoverTrigger asChild>
                            <div style={markerStyle} onClick={() => onSensorSelect(sensor.id)} />
                        </PopoverTrigger>
                        {activeSensor && activeSensor.id === sensor.id && activeSensorDataPoint && (
                             <PopoverContent className="w-80 p-0 border-none shadow-xl" side="right" align="start" sideOffset={10}>
                                <div className="w-80">
                                    <SensorPopupContent
                                    sensor={activeSensor}
                                    dataPoint={activeSensorDataPoint}
                                    timelineValue={timelineValue}
                                    isGreenMode={isGreenMode}
                                    />
                                </div>
                            </PopoverContent>
                        )}
                    </Popover>
                );
            })}
        </div>
    </div>
  );
};

export default MapView;
