'use client';

import DigitalTwinDashboard from '@/components/digital-twin-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="w-screen h-screen m-0 p-0">
      {isClient ? <DigitalTwinDashboard /> : <Skeleton className="w-full h-full" />}
    </main>
  );
}
