
'use server';

import { predictEquipmentFailure, type PredictEquipmentFailureInput, type PredictEquipmentFailureOutput } from '@/ai/flows/predictive-maintenance-alerts';
import type { SensorData } from './types';

export async function analyzeFailureRisk(sensor: SensorData): Promise<{ success: true, data: PredictEquipmentFailureOutput } | { success: false, error: string }> {
  // Adapt the SensorData to the PredictEquipmentFailureInput format
  const input: PredictEquipmentFailureInput = {
    sensorData: [{
      id: sensor.id,
      name: sensor.name,
      unit: sensor.unit,
      history: sensor.history.map(h => ({
        timestamp: h.timestamp.toISOString(),
        value: h.value
      }))
    }]
  };

  try {
    const result = await predictEquipmentFailure(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI analysis failed:', error);
    if (error instanceof Error) {
        return { success: false, error: `An error occurred during analysis: ${error.message}` };
    }
    return { success: false, error: 'An unknown error occurred during analysis.' };
  }
}
