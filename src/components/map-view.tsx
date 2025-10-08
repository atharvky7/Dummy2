'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import type { SensorData, HistoryPoint } from '@/lib/types';
import SensorPopupContent from './sensor-popup-content';

const siteCenter: L.LatLngExpression = [12.9716, 77.5946];

interface MapViewProps {
  sensors: SensorData[];
  timelineValue: number;
  activeSensorId: number | null;
  onSensorSelect: (id: number | null) => void;
}

const getStatusColor = (value: number) => {
  if (value > 80) return '#ef4444'; // Red
  if (value > 60) return '#f59e0b'; // Amber
  return '#10b981'; // Green
};

const MapLayers = ({ sensors, timelineValue, activeSensorId, onSensorSelect }: MapViewProps) => {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    if (!heatLayerRef.current) {
      heatLayerRef.current = L.heatLayer([], { radius: 25, blur: 15, maxZoom: 17 }).addTo(map);
    }

    const heatData: L.LatLngTuple[] = sensors.map(sensor => {
      const dataPoint = sensor.history[timelineValue];
      return dataPoint ? [sensor.lat, sensor.lng, dataPoint.value / 100] : [0,0,0];
    }).filter(p => p[2] > 0) as L.LatLngTuple[];

    heatLayerRef.current.setLatLngs(heatData);
  }, [sensors, timelineValue, map]);

  useEffect(() => {
    const handlePopupClose = () => {
      onSensorSelect(null);
    };
    map.on('popupclose', handlePopupClose);

    return () => {
      map.off('popupclose', handlePopupClose);
    };
  }, [map, onSensorSelect]);
  
  useEffect(() => {
    if (activeSensorId !== null) {
      const sensor = sensors.find(s => s.id === activeSensorId);
      if (sensor) {
        const panelElement = document.querySelector('.absolute.top-4.right-4');
        const panelWidth = panelElement ? (panelElement as HTMLElement).offsetWidth + 24 : 420;
        
        map.flyTo([sensor.lat, sensor.lng], 17, { animate: true, duration: 1 });
        // This is a workaround since react-leaflet's Popup doesn't directly expose autoPanOptions
        map.options.autoPanPaddingTopRight = new L.Point(panelWidth, 50);
        map.options.autoPanPaddingBottomLeft = new L.Point(50, 50);
      }
    } else {
        // Reset autopan padding when no sensor is selected
        map.options.autoPanPaddingTopRight = new L.Point(0, 0);
        map.options.autoPanPaddingBottomLeft = new L.Point(0, 0);
    }
  }, [activeSensorId, sensors, map]);


  return (
    <>
      {sensors.map(sensor => {
        const dataPoint = sensor.history[timelineValue];
        if (!dataPoint) return null;

        const isSelected = sensor.id === activeSensorId;
        const color = getStatusColor(dataPoint.value);
        
        return (
          <CircleMarker
            key={sensor.id}
            center={[sensor.lat, sensor.lng]}
            radius={isSelected ? 12 : 8}
            fillColor={color}
            color={isSelected ? '#374151' : 'white'}
            weight={isSelected ? 4 : 2}
            opacity={1}
            fillOpacity={0.9}
            eventHandlers={{
              click: () => {
                onSensorSelect(sensor.id);
              },
            }}
          >
            {isSelected && (
              <Popup minWidth={320} autoPan>
                <SensorPopupContent sensor={sensor} dataPoint={dataPoint} timelineValue={timelineValue} />
              </Popup>
            )}
          </CircleMarker>
        );
      })}
    </>
  );
};

const MapView: React.FC<MapViewProps> = (props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // This effect hook will manage the lifecycle of the Leaflet map.
    // It ensures that we have a valid container and that any existing map is cleaned up.
    
    if (mapContainerRef.current && mapRef.current === null) {
      // If the container exists but the map hasn't been initialized, create it.
      mapRef.current = new L.Map(mapContainerRef.current, {
        center: siteCenter,
        zoom: 17,
        zoomControl: false,
      });
    }

    return () => {
      // Cleanup function: This is the crucial part.
      // When the component unmounts, we destroy the map instance.
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // The empty dependency array ensures this runs only once on mount and cleanup on unmount.

  return (
    <div ref={mapContainerRef} style={{ height: '100%', width: '100%', zIndex: 10 }}>
        {mapRef.current && (
            // We are no longer using MapContainer. We are now using a simple div
            // and managing the map instance ourselves.
            // The TileLayer, ZoomControl, and MapLayers will be added to the existing map instance.
            <MapContainer-placeholder map={mapRef.current}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <ZoomControl position="bottomright" />
                <MapLayers {...props} />
            </MapContainer-placeholder>
        )}
    </div>
  );
};

// A placeholder component to bridge react-leaflet context
const MapContainerPlaceholder: React.FC<{ map: L.Map; children: React.ReactNode }> = ({ map, children }) => {
  const context = useMemo(() => ({ __version: '1', map }), [map]);
  const LeafletProvider = (L.Control as any).extend({
      onAdd: () => {
          // This is a dummy control that does nothing, just to host the provider
          const div = L.DomUtil.create('div');
          return div;
      }
  });
  
  // Use React.createContext and Provider to pass down the map instance
  const MapContextProvider = require('react-leaflet').MapContainer._context.Provider;

  return <MapContextProvider value={context}>{children}</MapContextProvider>;
};


export default MapView;