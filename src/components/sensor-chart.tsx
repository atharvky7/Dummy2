'use client';

import { useMemo } from 'react';
import type { SensorData } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';

interface SensorChartProps {
  sensor: SensorData;
  currentHour: number;
  isGreenMode: boolean;
}

const chartConfig = {
  live: {
    label: "Live",
    color: "hsl(var(--primary))",
  },
  predicted: {
    label: "Predicted",
    color: "hsl(var(--muted-foreground))",
  },
  green: {
    label: 'Green Scenario',
    color: 'hsl(var(--chart-2))',
  }
} as const;

const SensorChart: React.FC<SensorChartProps> = ({ sensor, currentHour, isGreenMode }) => {
  const chartData = useMemo(() => {
    const historySlice = sensor.history.slice(0, currentHour + 1);
    const lastDataPoint = historySlice[historySlice.length - 1];

    const data = historySlice.map(p => ({
      name: p.timestamp.getHours() % 3 === 0 ? `${p.timestamp.getHours()}:00` : '',
      live: p.value,
      predicted: null,
      green: isGreenMode ? p.value * 0.85 : null
    }));

    // Add prediction points
    const lastValue = lastDataPoint.value;
    const predictedValue = lastDataPoint.predicted;
    data[data.length - 1].predicted = lastValue; // Start prediction from last known value

    for (let i = 1; i <= 6; i++) {
        const interpolatedPrediction = lastValue + (predictedValue * 1.05 - lastValue) * (i / 6);
        data.push({
            name: `+${i}h`,
            live: null,
            predicted: interpolatedPrediction,
            green: isGreenMode ? interpolatedPrediction * 0.85 : null
        });
    }

    return data;
  }, [sensor, currentHour, isGreenMode]);

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis unit={sensor.unit} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent
                        indicator="line"
                        labelFormatter={(value, payload) => payload?.[0]?.payload.name}
                    />}
                />
                <Area type="monotone" dataKey="live" stroke={chartConfig.live.color} fillOpacity={0.1} fill={chartConfig.live.color} name="Live" />
                <Line type="monotone" dataKey="predicted" stroke={chartConfig.predicted.color} strokeDasharray="5 5" dot={false} name="Predicted" />
                {isGreenMode && <Line type="monotone" dataKey="green" stroke={chartConfig.green.color} strokeDasharray="5 5" dot={false} name="Green Scenario" />}
            </AreaChart>
        </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SensorChart;
