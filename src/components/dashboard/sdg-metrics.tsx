'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sdgData } from '@/lib/data';
import { Sdg9Icon, Sdg11Icon, Sdg12Icon, Sdg13Icon } from '@/components/icons';
import { useData } from '@/contexts/data-context';
import { formatNumber } from '@/lib/utils';

const iconMap = {
  9: Sdg9Icon,
  11: Sdg11Icon,
  12: Sdg12Icon,
  13: Sdg13Icon,
};

export default function SdgMetrics() {
  const { sensors } = useData();

  // Dummy data derived from sensors for demonstration
  const sdgMetrics = {
    '9': { value: sensors.find(s => s.id === 'energy')?.value || 0, unit: 'kWh', label: 'Energy Saved' },
    '11': { value: 15, unit: '%', label: 'Community Impact' }, // Dummy value
    '12': { value: 3.2, unit: 'tons', label: 'Waste Reused' }, // Dummy value
    '13': { value: 12.5, unit: 'tCO₂e', label: 'Emissions Reduced' }, // Dummy value
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sustainability & SDG Metrics</CardTitle>
        <CardDescription>Project alignment with UN Sustainable Development Goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {sdgData.map((sdg) => {
            const Icon = iconMap[sdg.id as keyof typeof iconMap];
            const metric = sdgMetrics[sdg.id as keyof typeof sdgMetrics];
            return (
              <div key={sdg.id} className="group flex flex-col items-center justify-start text-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Icon className="h-16 w-16 rounded-md transition-transform group-hover:scale-105" />
                <p className="mt-2 text-xs font-semibold text-muted-foreground">SDG {sdg.id}</p>
                <div className="mt-2">
                  <p className="font-bold text-primary text-lg leading-tight">{formatNumber(metric.value)}<span className="text-xs text-muted-foreground ml-1">{metric.unit}</span></p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
