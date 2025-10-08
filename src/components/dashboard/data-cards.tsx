'use client';

import { useData } from '@/contexts/data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Thermometer,
  Waves,
  Volume2,
  Wind,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const icons: Record<string, ReactNode> = {
  energy: <Thermometer className="h-6 w-6 text-muted-foreground" />,
  water: <Waves className="h-6 w-6 text-muted-foreground" />,
  noise: <Volume2 className="h-6 w-6 text-muted-foreground" />,
  air: <Wind className="h-6 w-6 text-muted-foreground" />,
};

export default function DataCards() {
  const { sensors, isOffline } = useData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {sensors.map((sensor) => {
        const change = sensor.change ?? 0;
        const isOverLimit = sensor.value > sensor.limit;
        
        return (
          <Card key={sensor.id} className={cn(isOffline && 'opacity-60')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
              {icons[sensor.id]}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {`${sensor.value.toFixed(1)} ${sensor.unit}`}
              </div>
              <div className={cn(`text-xs`, 
                isOffline ? 'text-muted-foreground' :
                isOverLimit ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {isClient ? 
                    (isOffline ? <span>Offline</span> :
                    isOverLimit ? 
                        <span className="flex items-center font-semibold">
                            <TrendingUp className="mr-1 h-4 w-4" />
                            Over Limit ({sensor.limit} {sensor.unit})
                        </span> :
                        <span className="flex items-center">
                            {change >= 0 ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                            {change.toFixed(1)}% from last hour
                        </span>
                    )
                    : <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
                }
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
