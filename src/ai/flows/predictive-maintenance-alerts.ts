'use server';

/**
 * @fileOverview Predictive maintenance AI agent.
 *
 * - predictEquipmentFailure - A function that predicts potential equipment failures.
 * - PredictEquipmentFailureInput - The input type for the predictEquipmentFailure function.
 * - PredictEquipmentFailureOutput - The return type for the predictEquipmentFailure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictEquipmentFailureInputSchema = z.object({
  sensorData: z.array(
    z.object({
      id: z.number().describe('The sensor ID.'),
      name: z.string().describe('The name of the asset being monitored.'),
      unit: z.string().describe('The unit of measurement for the sensor data.'),
      history: z.array(
        z.object({
          timestamp: z.string().describe('The timestamp of the sensor reading.'),
          value: z.number().describe('The sensor reading value.'),
        })
      ).describe('Historical sensor data.')
    })
  ).describe('An array of sensor data with historical readings.'),
});
export type PredictEquipmentFailureInput = z.infer<typeof PredictEquipmentFailureInputSchema>;

const PredictEquipmentFailureOutputSchema = z.array(
  z.object({
    sensorId: z.number().describe('The ID of the sensor that may indicate a failure.'),
    assetName: z.string().describe('The name of the asset associated with the sensor.'),
    failureProbability: z.number().describe('The probability of failure (0-1).'),
    reason: z.string().describe('The reason for the predicted failure.'),
    recommendation: z.string().describe('Recommended actions to prevent the failure.'),
  })
).describe('An array of predicted equipment failures and recommendations.');
export type PredictEquipmentFailureOutput = z.infer<typeof PredictEquipmentFailureOutputSchema>;

export async function predictEquipmentFailure(input: PredictEquipmentFailureInput): Promise<PredictEquipmentFailureOutput> {
  return predictEquipmentFailureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictEquipmentFailurePrompt',
  input: {schema: PredictEquipmentFailureInputSchema},
  output: {schema: PredictEquipmentFailureOutputSchema},
  prompt: `You are an expert maintenance engineer. Analyze the provided sensor data to predict potential equipment failures.

For each sensor, examine its historical data for anomalies, trends, and deviations from normal behavior.  Calculate the probability of failure based on these factors. Provide a clear reason for the prediction and recommend specific actions to prevent the failure.

Output the results in JSON format.

Here is the sensor data:

{{#each sensorData}}
Sensor ID: {{this.id}}
Asset Name: {{this.name}}
Unit: {{this.unit}}
History:
{{#each this.history}}
  Timestamp: {{this.timestamp}}, Value: {{this.value}}
{{/each}}
\n
{{/each}}`,
});

const predictEquipmentFailureFlow = ai.defineFlow(
  {
    name: 'predictEquipmentFailureFlow',
    inputSchema: PredictEquipmentFailureInputSchema,
    outputSchema: PredictEquipmentFailureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
