'use client';

import { useMemo } from 'react';
import type { SensorData } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, Legend } from 'recharts';

interface SensorChartProps {
  sensor: SensorData;
  currentHour: number;
  isGreenMode: boolean;
}

const chartConfig = {
  live: {
    label: "Live Value",
    color: "#10b981",
  },
  predicted: {
    label: "Predicted",
    color: "#a1a1aa",
  },
  green: {
    label: 'Green Scenario',
    color: '#22c55e',
  }
} as const;

const CustomLegend = () => {
    return (
        <div className="flex justify-center items-center space-x-4 text-xs mt-2">
            <div className="flex items-center">
                <div className="w-3 h-3 mr-1.5" style={{ backgroundColor: chartConfig.live.color }}></div>
                <span>Live Value ({chartConfig.live.label})</span>
            </div>
            <div className="flex items-center">
                <svg width="12" height="12" className="mr-1.5"><line x1="0" y1="6" x2="12" y2="6" stroke={chartConfig.predicted.color} strokeWidth="2" strokeDasharray="3 3"/></svg>
                <span>Predicted</span>
            </div>
            <div className="flex items-center">
                 <svg width="12" height="12" className="mr-1.5"><line x1="0" y1="6" x2="12" y2="6" stroke={chartConfig.green.color} strokeWidth="2" strokeDasharray="3 3"/></svg>
                <span>Green Scenario</span>
            </div>
        </div>
    );
};

const SensorChart: React.FC<SensorChartProps> = ({ sensor, currentHour, isGreenMode }) => {
  const chartData = useMemo(() => {
    const historySlice = sensor.history.slice(0, currentHour + 1);
    
    // Ensure we don't go out of bounds
    if (historySlice.length === 0) return [];

    const lastDataPoint = historySlice[historySlice.length - 1];

    const data = historySlice.map((p, index) => ({
      name: index % 6 === 0 ? `${p.timestamp.getHours()}:00` : '',
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
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis unit={sensor.unit} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={40} domain={[0, 'dataMax + 10']}/>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent
                        indicator="line"
                        labelFormatter={(value, payload) => payload?.[0]?.payload.name}
                        formatter={(value, name) => (
                          <div className="flex items-center">
                            <div className={`w-2.5 h-2.5 mr-2 rounded-full bg-${name === 'live' ? 'primary' : 'muted-foreground'}`}></div>
                            <div>
                               <p className="text-sm">{chartConfig[name as keyof typeof chartConfig].label}</p>
                               <p className="text-sm font-bold">{typeof value === 'number' && value.toFixed(1)}</p>
                            </div>
                          </div>
                        )}
                    />}
                />
                <Area type="monotone" dataKey="live" stroke={chartConfig.live.color} fillOpacity={0.2} strokeWidth={2} fill={`url(#colorLive)`} name="Live" />
                <defs>
                    <linearGradient id="colorLive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartConfig.live.color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={chartConfig.live.color} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Line type="monotone" dataKey="predicted" stroke={chartConfig.predicted.color} strokeDasharray="5 5" dot={false} strokeWidth={2} name="Predicted" />
                {isGreenMode && <Line type="monotone" dataKey="green" stroke={chartConfig.green.color} strokeDasharray="5 5" dot={false} name="Green Scenario" strokeWidth={2} />}
                 <Legend content={<CustomLegend />} verticalAlign="bottom" />
            </AreaChart>
        </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SensorChart;
