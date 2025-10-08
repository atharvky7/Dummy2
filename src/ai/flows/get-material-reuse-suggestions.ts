'use server';

/**
 * @fileOverview Provides AI-powered material reuse suggestions for demolition materials.
 *
 * - getMaterialReuseSuggestions - A function that provides reuse suggestions for demolition materials.
 * - MaterialReuseInput - The input type for the getMaterialReuseSuggestions function.
 * - MaterialReuseOutput - The return type for the getMaterialReuseSuggestions function.
 */

import {ai} from '@/ai/init';
import {z} from 'genkit';

const MaterialReuseInputSchema = z.object({
  material: z.string().describe('The type of demolition material (e.g., concrete, steel, wood).'),
  quantity: z.number().describe('The quantity of the demolition material in tons.'),
  location: z.string().describe('The location where the demolition material is available.'),
});
export type MaterialReuseInput = z.infer<typeof MaterialReuseInputSchema>;

const MaterialReuseSuggestionSchema = z.object({
  reuseSuggestion: z.string().describe('A suggestion for reusing the demolition material.'),
  co2Savings: z.number().describe('The estimated CO2 savings in kg.'),
  costSavings: z.number().describe('The estimated cost savings in USD.'),
});

const MaterialReuseOutputSchema = z.array(MaterialReuseSuggestionSchema);
export type MaterialReuseOutput = z.infer<typeof MaterialReuseOutputSchema>;

export async function getMaterialReuseSuggestions(
  input: MaterialReuseInput
): Promise<MaterialReuseOutput> {
  return getMaterialReuseSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'materialReusePrompt',
  input: {schema: MaterialReuseInputSchema},
  output: {schema: MaterialReuseOutputSchema},
  prompt: `You are an expert in construction material reuse and circular economy principles.

  Given the following demolition material, its quantity, and location, provide several reuse suggestions with estimated CO2 and cost savings for each suggestion.

  Material: {{{material}}}
  Quantity: {{{quantity}}} tons
  Location: {{{location}}}

  Format your response as a JSON array of objects. Each object should have the following keys:
  - reuseSuggestion: A suggestion for reusing the demolition material.
  - co2Savings: The estimated CO2 savings in kg.
  - costSavings: The estimated cost savings in USD.

  Example:
  [
    {
      "reuseSuggestion": "Crush concrete for use as road base.",
      "co2Savings": 500,
      "costSavings": 1000
    },
    {
      "reuseSuggestion": "Use reclaimed steel in new construction.",
      "co2Savings": 1200,
      "costSavings": 2500
    }
  ]
  `,
});

const getMaterialReuseSuggestionsFlow = ai.defineFlow(
  {
    name: 'getMaterialReuseSuggestionsFlow',
    inputSchema: MaterialReuseInputSchema,
    outputSchema: MaterialReuseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
