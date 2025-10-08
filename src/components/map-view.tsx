'use client';

import React, { useCallback, useState } from 'react';
import type { SensorData } from '@/lib/types';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import SensorPopupContent from './sensor-popup-content';
import { Skeleton } from './ui/skeleton';

interface MapViewProps {
  sensors: SensorData[];
  timelineValue: number;
  isGreenMode: boolean;
  activeSensorId: number | null;
  onSensorSelect: (id: number | null) => void;
  activeSensor: SensorData | null;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const siteCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

const mapOptions = {
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
    { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
    { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  ],
  disableDefaultUI: true,
  zoomControl: true,
};

const getStatusColor = (value: number) => {
  if (value > 80) return '#ef4444'; // Red
  if (value > 60) return '#f59e0b'; // Amber
  return '#10b981'; // Green
};

const MapView: React.FC<MapViewProps> = ({
  sensors,
  timelineValue,
  isGreenMode,
  activeSensorId,
  onSensorSelect,
  activeSensor,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const activeSensorDataPoint = activeSensor ? activeSensor.history[timelineValue] : null;

  if (!isLoaded) return <Skeleton className="w-full h-full" />;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={siteCenter}
      zoom={15}
      options={mapOptions}
    >
      {sensors.map((sensor) => {
        const dataPoint = sensor.history[0];
        if (!dataPoint) return null;
        const color = getStatusColor(dataPoint.value);
        
        return (
          <Marker
            key={sensor.id}
            position={{ lat: sensor.lat, lng: sensor.lng }}
            onClick={() => onSensorSelect(sensor.id)}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2,
              scale: activeSensorId === sensor.id ? 10 : 6,
            }}
          />
        );
      })}

      {activeSensor && activeSensorDataPoint && (
        <InfoWindow
          position={{ lat: activeSensor.lat, lng: activeSensor.lng }}
          onCloseClick={() => onSensorSelect(null)}
          options={{
            pixelOffset: new window.google.maps.Size(0, -30),
            disableAutoPan: true,
          }}
        >
          <div className="w-80">
            <SensorPopupContent
              sensor={activeSensor}
              dataPoint={activeSensorDataPoint}
              timelineValue={timelineValue}
              isGreenMode={isGreenMode}
            />
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapView;
