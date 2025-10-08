'use client';

import Image from 'next/image';
import { useData } from '@/contexts/data-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Thermometer,
  Waves,
  Volume2,
  Wind,
  CircleDotDashed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import placeholderImages from '@/lib/placeholder-images.json';
import { useState } from 'react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

const sensorPositions = {
  energy: { top: '30%', left: '25%' },
  water: { top: '60%', left: '70%' },
  noise: { top: '15%', left: '80%' },
  air: { top: '75%', left: '15%' },
};

const sensorIcons = {
  energy: Thermometer,
  water: Waves,
  noise: Volume2,
  air: Wind,
};

export default function SensorMap() {
  const { sensors } = useData();
  const [showHeatmap, setShowHeatmap] = useState(false);

  const mapBgImage = placeholderImages.placeholderImages.find(
    (img) => img.id === 'sensor-map-background'
  );
  
  const getNoiseLevel = () => {
    const noiseSensor = sensors.find(s => s.id === 'noise');
    return noiseSensor ? noiseSensor.value : 0;
  };

  const noiseLevel = getNoiseLevel();
  const heatmapOpacity = Math.min(Math.max((noiseLevel - 60) / 30, 0), 1) * 0.7;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Interactive Sensor Map</CardTitle>
                <CardDescription>
                Click on a sensor to view its real-time status.
                </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="heatmap-toggle" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                <Label htmlFor="heatmap-toggle">Show Noise Heatmap</Label>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border">
          {mapBgImage && (
            <Image
              src={mapBgImage.imageUrl}
              alt={mapBgImage.description}
              data-ai-hint={mapBgImage.imageHint}
              fill
              className="object-cover"
            />
          )}

          {showHeatmap && (
             <div 
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at 80% 15%, hsla(0, 70%, 60%, ${heatmapOpacity}) 0%, hsla(0, 70%, 60%, 0) 50%)`,
                }}
            />
          )}

          {sensors.map((sensor) => {
            const Icon = sensorIcons[sensor.id];
            const isOverLimit = sensor.value > sensor.limit;
            const position = sensorPositions[sensor.id];

            return (
              <Popover key={sensor.id}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background"
                    style={{ top: position.top, left: position.left }}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5',
                        isOverLimit ? 'text-destructive' : 'text-primary'
                      )}
                    />
                     <span className={cn(
                        "absolute top-0 right-0 block h-3 w-3 rounded-full",
                        isOverLimit ? 'bg-destructive animate-pulse' : 'bg-green-500'
                     )}></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {sensor.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Real-time reading from sensor pin.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <span className="font-semibold">Value</span>
                        <span className="col-span-2 text-right text-lg font-bold">
                          {sensor.value.toFixed(1)} {sensor.unit}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <span className="font-semibold">Status</span>
                        <span className="col-span-2 text-right">
                          {isOverLimit ? (
                            <span className="font-bold text-destructive">Over Limit</span>
                          ) : (
                            <span className="font-bold text-primary">Nominal</span>
                          )}
                        </span>
                      </div>
                       <div className="grid grid-cols-3 items-center gap-4">
                        <span className="font-semibold">Limit</span>
                        <span className="col-span-2 text-right">
                          {sensor.limit} {sensor.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
