import DataCards from '@/components/dashboard/data-cards';
import SdgMetrics from '@/components/dashboard/sdg-metrics';
import SensorCharts from '@/components/dashboard/sensor-charts';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <DataCards />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SensorCharts />
        </div>
        <div className="lg:col-span-1">
          <SdgMetrics />
        </div>
      </div>
    </div>
  );
}
