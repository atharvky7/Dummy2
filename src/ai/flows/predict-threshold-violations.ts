'use server';

/**
 * @fileOverview Predicts potential violations of environmental thresholds based on current trends.
 *
 * - predictThresholdViolations - A function that predicts potential threshold violations.
 * - PredictThresholdViolationsInput - The input type for the predictThresholdViolations function.
 * - PredictThresholdViolationsOutput - The return type for the predictThresholdViolations function.
 */

import {ai} from '@/ai/init';
import {z} from 'genkit';

const PredictThresholdViolationsInputSchema = z.object({
  noiseLevel: z.number().describe('Current noise level in decibels.'),
  airQualityIndex: z.number().describe('Current air quality index value.'),
  waterConsumptionRate: z.number().describe('Current water consumption rate.'),
  energyConsumptionRate: z.number().describe('Current energy consumption rate.'),
  timeOfDay: z.string().describe('Current time of day (e.g., morning, afternoon, evening, night).'),
  dayOfWeek: z.string().describe('Current day of the week (e.g., Monday, Tuesday, etc.).'),
});
export type PredictThresholdViolationsInput = z.infer<typeof PredictThresholdViolationsInputSchema>;

const PredictThresholdViolationsOutputSchema = z.object({
  noiseViolationLikelihood: z
    .string()
    .describe('Likelihood of noise level exceeding the threshold (e.g., High, Medium, Low).'),
  airQualityViolationLikelihood: z
    .string()
    .describe('Likelihood of air quality index exceeding the threshold (e.g., High, Medium, Low).'),
  waterViolationLikelihood: z
    .string()
    .describe('Likelihood of water consumption rate exceeding the threshold (e.g., High, Medium, Low).'),
  energyViolationLikelihood: z
    .string()
    .describe('Likelihood of energy consumption rate exceeding the threshold (e.g., High, Medium, Low).'),
  suggestedActions: z
    .string()
    .describe('Suggested actions to prevent potential threshold violations.'),
});
export type PredictThresholdViolationsOutput = z.infer<typeof PredictThresholdViolationsOutputSchema>;

export async function predictThresholdViolations(
  input: PredictThresholdViolationsInput
): Promise<PredictThresholdViolationsOutput> {
  return predictThresholdViolationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictThresholdViolationsPrompt',
  input: {schema: PredictThresholdViolationsInputSchema},
  output: {schema: PredictThresholdViolationsOutputSchema},
  prompt: `You are an AI assistant specializing in predicting environmental threshold violations for construction sites.

  Based on the current sensor readings and trends, predict the likelihood of exceeding the noise level, air quality, water consumption, and energy consumption thresholds.
  Provide suggested actions to prevent these potential violations.

Current Sensor Readings:
Noise Level: {{{noiseLevel}}} dB
Air Quality Index: {{{airQualityIndex}}}
Water Consumption Rate: {{{waterConsumptionRate}}}
Energy Consumption Rate: {{{energyConsumptionRate}}}
Time of Day: {{{timeOfDay}}}
Day of Week: {{{dayOfWeek}}}


Consider these factors when predicting threshold violations:
- Historical data on sensor readings and violations
- Weather conditions
- Construction activities
- Local regulations

Output the likelihood of each violation as High, Medium, or Low.
Suggest actions to prevent these potential violations.


Here's an example of the desired output format:
{
  "noiseViolationLikelihood": "Medium",
  "airQualityViolationLikelihood": "Low",
  "waterViolationLikelihood": "High",
  "energyViolationLikelihood": "Low",
  "suggestedActions": "Reduce noise levels by using noise barriers, Improve air quality by watering down construction areas, Reduce water consumption by fixing leaks"
}

Predictions:
`, // Ensure that the output is in the format of PredictThresholdViolationsOutputSchema
});

const predictThresholdViolationsFlow = ai_defineFlow(
  {
    name: 'predictThresholdViolationsFlow',
    inputSchema: PredictThresholdViolationsInputSchema,
    outputSchema: PredictThresholdViolationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
