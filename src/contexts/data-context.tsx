'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Alert, Sensor } from '@/lib/types';
import { initialSensors } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { BellRing } from 'lucide-react';

type DataContextType = {
  sensors: Sensor[];
  alerts: Alert[];
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>, showToast?: boolean) => void;
  clearAlerts: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  const addAlert = useCallback((alertData: Omit<Alert, 'id' | 'timestamp'>, showToast = false) => {
    const newAlert: Alert = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 20)); // Keep last 20 alerts
    
    if (showToast) {
      // Defer toast to next tick to avoid state update during render
      setTimeout(() => {
          toast({
              title: (
                  <div className="flex items-center gap-2">
                  <BellRing className="text-accent" />
                  <span className="font-bold">{newAlert.title}</span>
                  </div>
              ),
              description: newAlert.description,
              variant: 'default',
          });
      }, 0);
    }
  }, [toast]);

  const clearAlerts = () => {
    setAlerts([]);
  };

  useEffect(() => {
    if (isOffline) {
      setTimeout(() => {
        toast({
          title: 'Offline Mode Activated',
          description: 'Sensor data is being buffered and will sync upon reconnection.',
        });
      }, 0);
      return;
    }

    const interval = setInterval(() => {
      setSensors(prevSensors => {
        return prevSensors.map(oldSensor => {
          // Simulate data fluctuation
          const changePercent = (Math.random() - 0.5) * (oldSensor.limit * 0.02) / oldSensor.value * 100;
          let newValue = Math.max(0, oldSensor.value * (1 + changePercent / 100));

          // Randomly spike a value to trigger an alert
          // Reduced probability from 0.02 to 0.005 to make alerts less frequent
          if (Math.random() < 0.005) {
            newValue = oldSensor.limit * (1 + Math.random() * 0.1);
          }

          const wasOverLimit = oldSensor.value > oldSensor.limit;
          const isOverLimit = newValue > oldSensor.limit;

          if (isOverLimit && !wasOverLimit) {
              // Add alert to sidebar, but don't show a toast by default
              addAlert({
                  title: `${oldSensor.name} Threshold Exceeded`,
                  description: `${oldSensor.name} at ${newValue.toFixed(2)} ${oldSensor.unit} has exceeded the limit of ${oldSensor.limit} ${oldSensor.unit}.`,
                  severity: 'High',
                  mitigationPlan: `Implement noise reduction measures immediately. Use quieter equipment and install temporary noise barriers.`,
                  communityImpact: `Nearby residents may experience temporary high noise levels. We are working to resolve this as quickly as possible.`
              });
          }
          
          return { ...oldSensor, value: newValue, timestamp: Date.now(), change: changePercent };
        });
      });
    }, 60000); // Update every 1 minute

    return () => clearInterval(interval);
  }, [isOffline, addAlert, toast]);

  return (
    <DataContext.Provider value={{ sensors, alerts, isOffline, setIsOffline, addAlert, clearAlerts }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
