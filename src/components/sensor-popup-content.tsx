'use client';
import React from 'react';
import type { HistoryPoint, SensorData } from '@/lib/types';
import SensorChart from './sensor-chart';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { analyzeFailureRisk } from '@/lib/actions';
import type { PredictEquipmentFailureOutput } from '@/ai/flows/predictive-maintenance-alerts';

interface SensorPopupContentProps {
  sensor: SensorData;
  dataPoint: HistoryPoint;
  timelineValue: number;
  isGreenMode: boolean;
}

const MetricDisplay = ({ label, value, unit, isGreen, greenValue, originalValue }: { label: string; value: string; unit: string; isGreen: boolean; greenValue: string, originalValue: string }) => {
    if (isGreen) {
        return (
             <div className="flex justify-between items-baseline p-2 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-500">{label}</span>
                <div className="text-right">
                    <span className='text-gray-400 line-through mr-2'>{originalValue}</span>
                    <span className='text-emerald-600 font-bold'>{greenValue} {unit}</span>
                </div>
            </div>
        )
    }
    return (
        <div className="flex justify-between items-baseline p-2 bg-gray-50 rounded-md">
            <span className="text-sm text-gray-500">{label}</span>
            <span className='text-lg font-semibold text-gray-900'>{value} {unit}</span>
        </div>
    )
}

const SensorPopupContent: React.FC<SensorPopupContentProps> = ({ sensor, dataPoint, timelineValue, isGreenMode }) => {
  const [isPredictionDialogOpen, setPredictionDialogOpen] = React.useState(false);
  const [predictionData, setPredictionData] = React.useState<PredictEquipmentFailureOutput | null>(null);
  const [isAnalyzing, startTransition] = React.useTransition();
  const { toast } = useToast();

  const handleAnalyze = () => {
    startTransition(async () => {
      const result = await analyzeFailureRisk(sensor);
      if (result.success) {
        setPredictionData(result.data);
        setPredictionDialogOpen(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="p-4 bg-card text-card-foreground rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-3">{sensor.name}</h3>
      <div className="space-y-2">
        <MetricDisplay
            label="Live metrics"
            value={dataPoint.value.toFixed(1)}
            unit={sensor.unit}
            isGreen={isGreenMode}
            greenValue={(dataPoint.value * 0.85).toFixed(1)}
            originalValue={dataPoint.value.toFixed(1)}
        />
        <MetricDisplay
            label="Predicted (Next 6h)"
            value={dataPoint.predicted.toFixed(1)}
            unit={sensor.unit}
            isGreen={isGreenMode}
            greenValue={(dataPoint.predicted * 0.85).toFixed(1)}
            originalValue={dataPoint.predicted.toFixed(1)}
        />
        <MetricDisplay
            label="CO₂e Impact"
            value={dataPoint.co2e.toFixed(2)}
            unit="kg"
            isGreen={isGreenMode}
            greenValue={(dataPoint.co2e * 0.72).toFixed(2)}
            originalValue={dataPoint.co2e.toFixed(2)}
        />
      </div>

      <div className="mt-4 h-40">
        <SensorChart sensor={sensor} currentHour={timelineValue} isGreenMode={isGreenMode} />
      </div>

      <div className="mt-4 p-2">
        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Failure Risk
        </Button>
      </div>

      <AlertDialog open={isPredictionDialogOpen} onOpenChange={setPredictionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Predictive Maintenance Analysis</AlertDialogTitle>
            <AlertDialogDescription>AI-powered failure prediction for: <strong>{sensor.name}</strong></AlertDialogDescription>
          </AlertDialogHeader>
            {predictionData && predictionData.length > 0 ? predictionData.map((prediction, index) => (
                <div key={index} className="text-sm space-y-2 border-t pt-4">
                    <p><strong>Failure Probability:</strong> <span className="font-mono p-1 bg-muted rounded">{ (prediction.failureProbability * 100).toFixed(1) }%</span></p>
                    <p><strong>Reason:</strong> {prediction.reason}</p>
                    <p><strong>Recommendation:</strong> {prediction.recommendation}</p>
                </div>
            )) : <p className="text-sm text-muted-foreground">No potential failures detected.</p> }
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SensorPopupContent;
