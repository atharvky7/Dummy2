'use server';

/**
 * @fileOverview Simulates what-if scenarios for construction projects by adjusting parameters and predicting outcomes.
 *
 * - simulateWhatIf - A function that takes simulation parameters and returns updated predictions for project delay, CO2 emissions, and costs.
 * - SimulateWhatIfInput - The input type for the simulateWhatIf function, defining adjustable parameters.
 * - SimulateWhatIfOutput - The return type for the simulateWhatIf function, providing predicted outcomes.
 */

import {ai} from '@/ai/init';
import {z} from 'genkit';

const SimulateWhatIfInputSchema = z.object({
  truckDelayHours: z
    .number()
    .describe('The number of truck delay hours to simulate.'),
  energyUsagePercentage: z
    .number()
    .describe('The percentage of energy usage to simulate.'),
});
export type SimulateWhatIfInput = z.infer<typeof SimulateWhatIfInputSchema>;

const SimulateWhatIfOutputSchema = z.object({
  predictedDelayDays: z
    .number()
    .describe('The predicted project delay in days.'),
  predictedCO2Emissions: z
    .number()
    .describe('The predicted CO2 emissions in kilograms.'),
  predictedCostSavings: z
    .number()
    .describe('The predicted cost savings in USD.'),
});
export type SimulateWhatIfOutput = z.infer<typeof SimulateWhatIfOutputSchema>;

export async function simulateWhatIf(input: SimulateWhatIfInput): Promise<SimulateWhatIfOutput> {
  return simulateWhatIfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateWhatIfPrompt',
  input: {schema: SimulateWhatIfInputSchema},
  output: {schema: SimulateWhatIfOutputSchema},
  prompt: `You are an AI assistant specialized in construction project planning and sustainability.

You will receive simulation parameters related to truck delay hours and energy usage percentage.

Based on these parameters, predict the impact on project delay (in days), CO2 emissions (in kilograms), and cost savings (in USD).

Truck Delay Hours: {{{truckDelayHours}}}
Energy Usage Percentage: {{{energyUsagePercentage}}}

Consider factors like logistical impacts of truck delays, energy consumption of equipment, and potential savings from reduced energy use or optimized logistics.

Ensure the predictions are realistic and directionally correct.`,
});

const simulateWhatIfFlow = ai.defineFlow(
  {
    name: 'simulateWhatIfFlow',
    inputSchema: SimulateWhatIfInputSchema,
    outputSchema: SimulateWhatIfOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
