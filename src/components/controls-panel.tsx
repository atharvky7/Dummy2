'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SensorData } from '@/lib/types';
import { analyzeFailureRisk } from '@/lib/actions';
import type { PredictEquipmentFailureOutput } from '@/ai/flows/predictive-maintenance-alerts';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const ThreeViewer = dynamic(() => import('@/components/three-viewer'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-48 rounded-lg" />,
});

interface ControlsPanelProps {
  timelineValue: number;
  setTimelineValue: (value: number) => void;
  isGreenMode: boolean;
  setIsGreenMode: (value: boolean) => void;
  activeSensorId: number | null;
  onSensorSelect: (id: number | null) => void;
  activeSensor: SensorData | null;
}

const SDGIcon = () => (
    <svg className="w-8 h-8 mr-3 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-3.5l6-3.5-6-3.5v7zm1-3.5c0-.28.22-.5.5-.5s.5.22.5.5-.22.5-.5.5-.5-.22-.5-.5z"/></svg>
);

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  timelineValue,
  setTimelineValue,
  isGreenMode,
  setIsGreenMode,
  activeSensorId,
  onSensorSelect,
  activeSensor,
}) => {
    const [co2Reduction, setCo2Reduction] = useState(28);

    const handleTimelineChange = (value: number[]) => {
        setTimelineValue(value[0]);
    };

    const timelineLabel = timelineValue === 23 ? 'Now' : `-${23 - timelineValue}h ago`;
    
    return (
        <div className="absolute top-4 right-4 z-[1000] w-[90vw] max-w-sm max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4 pr-1">
            <Card className="shadow-lg">
                <CardHeader>
                    <h1 className="text-xl font-bold text-gray-800">Digital Twin Dashboard</h1>
                    <p className="text-xs text-gray-500">Real-time Sustainability & Operations Monitoring</p>
                </CardHeader>
            </Card>

            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <Label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">Last 24 Hours Replay</Label>
                    <Slider
                        id="timeline"
                        min={0}
                        max={23}
                        step={1}
                        value={[timelineValue]}
                        onValueChange={handleTimelineChange}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>-24h</span>
                        <span className="font-semibold text-emerald-600">{timelineLabel}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="scenario-toggle" className="text-sm font-medium text-gray-700">Green Scenario Mode</Label>
                        <Switch
                            id="scenario-toggle"
                            checked={isGreenMode}
                            onCheckedChange={setIsGreenMode}
                        />
                    </div>
                    <div className={`transition-all duration-300 ${isGreenMode ? 'opacity-100 mt-3' : 'opacity-0 h-0 invisible'}`}>
                        {isGreenMode && (
                            <div className="flex items-center p-3 bg-emerald-50 rounded-md">
                                <SDGIcon />
                                <div>
                                    <p className="text-sm font-semibold text-emerald-800">SDG 12: Responsible Production</p>
                                    <p className="text-xs text-emerald-600">CO₂ emissions reduced by {co2Reduction}%</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <h3 className="text-sm font-medium text-gray-700">3D Site Model</h3>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-48 bg-gray-200 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center text-gray-500 text-sm">
                        <ThreeViewer activeSensorId={activeSensorId} onObjectClick={onSensorSelect} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ControlsPanel;
