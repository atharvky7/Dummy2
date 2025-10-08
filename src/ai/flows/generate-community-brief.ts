'use server';

/**
 * @fileOverview Automatically generates a community brief when a construction site alert is triggered.
 *
 * - generateCommunityBrief - A function that generates a community brief.
 * - GenerateCommunityBriefInput - The input type for the generateCommunityBrief function.
 * - GenerateCommunityBriefOutput - The return type for the generateCommunityBrief function.
 */

import {ai} from '@/ai/init';
import {z} from 'genkit';

const GenerateCommunityBriefInputSchema = z.object({
  alertType: z.string().describe('The type of alert triggered (e.g., noise violation, air quality issue).'),
  alertDetails: z.string().describe('Detailed information about the alert, including specific readings and location.'),
  mitigationPlan: z.string().describe('The planned actions to mitigate the issue.'),
  communityImpact: z.string().describe('The potential impact on the local community.'),
  siteName: z.string().describe('The name of the construction site.'),
  date: z.string().describe('The date of the alert.'),
});
export type GenerateCommunityBriefInput = z.infer<typeof GenerateCommunityBriefInputSchema>;

const GenerateCommunityBriefOutputSchema = z.object({
  communityBrief: z.string().describe('A summary of the issue, mitigation plan, and impact on local residents.'),
});
export type GenerateCommunityBriefOutput = z.infer<typeof GenerateCommunityBriefOutputSchema>;

export async function generateCommunityBrief(input: GenerateCommunityBriefInput): Promise<GenerateCommunityBriefOutput> {
  return generateCommunityBriefFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCommunityBriefPrompt',
  input: {schema: GenerateCommunityBriefInputSchema},
  output: {schema: GenerateCommunityBriefOutputSchema},
  prompt: `You are a community relations specialist at a construction company. Your task is to generate a brief summary for the local community when an alert is triggered at a construction site. The summary should include the issue, the mitigation plan, and the potential impact on the local residents. The summary should be no more than 200 words and written in a clear, concise, and easy-to-understand manner. It must be formatted so it can be downloaded to a PDF or plain text file and sent to the community.

Construction Site: {{{siteName}}}
Date: {{{date}}}
Alert Type: {{{alertType}}}
Alert Details: {{{alertDetails}}}
Mitigation Plan: {{{mitigationPlan}}}
Community Impact: {{{communityImpact}}}

Community Brief:`,
});

const generateCommunityBriefFlow = ai.defineFlow(
  {
    name: 'generateCommunityBriefFlow',
    inputSchema: GenerateCommunityBriefInputSchema,
    outputSchema: GenerateCommunityBriefOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
