'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { simulateWhatIf } from '@/ai/flows/simulate-what-if-scenarios';
import { Loader2, Hourglass, Mountain, DollarSign } from 'lucide-react';
import { debounce } from 'lodash';

type SimulationParams = {
  truckDelayHours: number;
  energyUsagePercentage: number;
};

type SimulationResult = {
  predictedDelayDays: number;
  predictedCO2Emissions: number;
  predictedCostSavings: number;
};

const initialParams: SimulationParams = {
  truckDelayHours: 0,
  energyUsagePercentage: 100,
};

const baseResult: SimulationResult = {
  predictedDelayDays: 5,
  predictedCO2Emissions: 15000,
  predictedCostSavings: 0,
};

export default function WhatIfSimulation() {
  const [params, setParams] = useState<SimulationParams>(initialParams);
  const [result, setResult] = useState<SimulationResult>(baseResult);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSimulate = useCallback(
    debounce(async (newParams: SimulationParams) => {
      setIsLoading(true);
      try {
        const aiResult = await simulateWhatIf(newParams);
        // We'll combine the base result with the AI result for a more dynamic feel
        setResult({
            predictedDelayDays: baseResult.predictedDelayDays + aiResult.predictedDelayDays,
            predictedCO2Emissions: baseResult.predictedCO2Emissions * (newParams.energyUsagePercentage / 100) + aiResult.predictedCO2Emissions,
            predictedCostSavings: baseResult.predictedCostSavings + aiResult.predictedCostSavings
        });
      } catch (error) {
        console.error('Simulation failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSimulate(params);
  }, [params, debouncedSimulate]);
  
  const handleTruckDelayChange = (value: number[]) => {
    setParams(prev => ({...prev, truckDelayHours: value[0]}));
  }

  const handleEnergyUsageChange = (value: number[]) => {
    setParams(prev => ({...prev, energyUsagePercentage: value[0]}));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>What-if Simulation</CardTitle>
          <CardDescription>Adjust parameters to see predicted outcomes on project metrics.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="truck-delay">Truck Delay Hours</Label>
              <span className="font-bold text-primary">{params.truckDelayHours} hrs</span>
            </div>
            <Slider
              id="truck-delay"
              min={0}
              max={24}
              step={1}
              value={[params.truckDelayHours]}
              onValueChange={handleTruckDelayChange}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="energy-usage">Energy Usage Percentage</Label>
              <span className="font-bold text-primary">{params.energyUsagePercentage}%</span>
            </div>
            <Slider
              id="energy-usage"
              min={50}
              max={150}
              step={5}
              value={[params.energyUsagePercentage]}
              onValueChange={handleEnergyUsageChange}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="relative">
        <CardHeader>
          <CardTitle>Predicted Outcomes</CardTitle>
          <CardDescription>Instant feedback based on your simulation parameters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                <Hourglass className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Predicted Project Delay</p>
              <p className="text-2xl font-bold">{result.predictedDelayDays.toFixed(1)} days</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900/50">
                <Mountain className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Predicted CO₂ Emissions</p>
              <p className="text-2xl font-bold">{result.predictedCO2Emissions.toLocaleString()} kg</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Predicted Cost Savings</p>
              <p className="text-2xl font-bold">${result.predictedCostSavings.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
