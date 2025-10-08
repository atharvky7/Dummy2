'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { SensorData } from '@/lib/types';
import { getMockSensorData } from '@/lib/mock-data';
import ControlsPanel from '@/components/controls-panel';
import { Skeleton } from './ui/skeleton';

const DigitalTwinDashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [timelineValue, setTimelineValue] = useState<number>(23);
  const [isGreenMode, setIsGreenMode] = useState<boolean>(false);
  const [activeSensorId, setActiveSensorId] = useState<number | null>(null);

  useEffect(() => {
    setSensorData(getMockSensorData());
  }, [])
  

  const MapView = useMemo(
    () =>
      dynamic(() => import('@/components/map-view'), {
        ssr: false,
        loading: () => <Skeleton className="w-full h-full" />,
      }),
    []
  );

  const handleSensorSelect = (sensorId: number | null) => {
    setActiveSensorId(sensorId);
  };

  const activeSensor = useMemo(() => {
    if (activeSensorId === null) return null;
    return sensorData.find(s => s.id === activeSensorId) ?? null;
  }, [activeSensorId, sensorData]);

  return (
    <div className="w-full h-full relative">
      <MapView
        sensors={sensorData}
        timelineValue={timelineValue}
        activeSensorId={activeSensorId}
        onSensorSelect={handleSensorSelect}
      />
      <ControlsPanel
        timelineValue={timelineValue}
        setTimelineValue={setTimelineValue}
        isGreenMode={isGreenMode}
        setIsGreenMode={setIsGreenMode}
        activeSensorId={activeSensorId}
        onSensorSelect={handleSensorSelect}
        activeSensor={activeSensor}
      />
    </div>
  );
};

export default DigitalTwinDashboard;
