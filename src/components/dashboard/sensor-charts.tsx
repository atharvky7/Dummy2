'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { useData } from '@/contexts/data-context';
import type { Sensor } from '@/lib/types';

type ChartDataPoint = {
  time: string;
  value: number;
};

type SensorChartData = {
  [key in Sensor['id']]: ChartDataPoint[];
};

const chartConfig = {
  value: {
    label: 'Value',
  },
  energy: {
    label: 'Energy',
    color: 'hsl(var(--chart-1))',
  },
  water: {
    label: 'Water',
    color: 'hsl(var(--chart-2))',
  },
  noise: {
    label: 'Noise',
    color: 'hsl(var(--chart-3))',
  },
  air: {
    label: 'Air Quality',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export default function SensorCharts() {
  const { sensors, isOffline } = useData();
  const [chartData, setChartData] = useState<SensorChartData>({
    energy: [],
    water: [],
    noise: [],
    air: [],
  });

  useEffect(() => {
    if (isOffline) return;

    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChartData((prevData) => {
      const newData = { ...prevData };
      sensors.forEach((sensor) => {
        newData[sensor.id] = [
          ...prevData[sensor.id],
          { time: timeLabel, value: sensor.value },
        ].slice(-30); // Keep last 30 data points
      });
      return newData;
    });
  }, [sensors, isOffline]);

  const renderChart = (sensorId: Sensor['id'], unit: string) => (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData[sensorId]}
        margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <defs>
            <linearGradient id={`${sensorId}-gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`hsl(var(--chart-${sensorId === 'energy' ? 1 : sensorId === 'water' ? 2 : sensorId === 'noise' ? 3 : 4}))`} stopOpacity={0.8} />
                <stop offset="95%" stopColor={`hsl(var(--chart-${sensorId === 'energy' ? 1 : sensorId === 'water' ? 2 : sensorId === 'noise' ? 3 : 4}))`} stopOpacity={0.1} />
            </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          fill={`url(#${sensorId}-gradient)`}
          stroke={`hsl(var(--chart-${sensorId === 'energy' ? 1 : sensorId === 'water' ? 2 : sensorId === 'noise' ? 3 : 4}))`}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Telemetry Feed</CardTitle>
        <CardDescription>Real-time sensor data from the construction site.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="energy">
          <TabsList>
            {sensors.map((sensor) => (
              <TabsTrigger key={sensor.id} value={sensor.id}>
                {sensor.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {sensors.map((sensor) => (
            <TabsContent key={sensor.id} value={sensor.id}>
              {renderChart(sensor.id, sensor.unit)}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
