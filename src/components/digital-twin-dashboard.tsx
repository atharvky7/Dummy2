'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { SensorData } from '@/lib/types';
import { getMockSensorData } from '@/lib/mock-data';
import ControlsPanel from '@/components/controls-panel';
import MapView from '@/components/map-view';

const DigitalTwinDashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [timelineValue, setTimelineValue] = useState<number>(23);
  const [isGreenMode, setIsGreenMode] = useState<boolean>(false);
  const [activeSensorId, setActiveSensorId] = useState<number | null>(null);

  useEffect(() => {
    setSensorData(getMockSensorData());
  }, [])
  
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
        isGreenMode={isGreenMode}
        activeSensorId={activeSensorId}
        onSensorSelect={handleSensorSelect}
        activeSensor={activeSensor}
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
