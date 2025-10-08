'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { materialLabels, materialTypes } from '@/lib/data';
import type { Material, MaterialReuseSuggestion } from '@/lib/types';
import { getMaterialReuseSuggestions } from '@/ai/flows/get-material-reuse-suggestions';
import { Loader2, Recycle, DollarSign, Leaf } from 'lucide-react';

const formSchema = z.object({
  material: z.enum(materialTypes, {
    required_error: 'Please select a material.',
  }),
  quantity: z.coerce.number().min(0.1, 'Quantity must be greater than 0.'),
  location: z.string().min(1, 'Location is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CircularityAdvisor() {
  const [suggestions, setSuggestions] = useState<MaterialReuseSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: 'New York, NY',
      quantity: 10,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await getMaterialReuseSuggestions(data);
      setSuggestions(result);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      // You would show a toast message here in a real app
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Circularity Advisor</CardTitle>
          <CardDescription>Get AI-powered reuse suggestions for demolition materials.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a material" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {materialTypes.map((material) => (
                          <SelectItem key={material} value={material}>
                            {materialLabels[material]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (tons)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Get Suggestions'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader><div className="h-5 w-3/4 rounded bg-muted"></div></CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 w-1/2 rounded bg-muted"></div>
                <div className="h-4 w-1/3 rounded bg-muted"></div>
              </CardContent>
            </Card>
          ))}
        {suggestions.length > 0 &&
          suggestions.map((suggestion, i) => (
            <Card key={i} className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Recycle className="text-primary" /> {suggestion.reuseSuggestion}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Leaf className="text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">CO₂ Savings</p>
                    <p className="font-bold">{suggestion.co2Savings.toLocaleString()} kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cost Savings</p>
                    <p className="font-bold">${suggestion.costSavings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        {!isLoading && suggestions.length === 0 && (
          <Card className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
            <CardContent>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Recycle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Your suggestions will appear here</h3>
              <p className="text-muted-foreground">Fill out the form to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
