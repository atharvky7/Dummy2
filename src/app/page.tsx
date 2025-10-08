'use client';

import { useEffect, useState } from 'react';
import DigitalTwinDashboard from '@/components/digital-twin-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="w-screen h-screen m-0 p-0">
      {isClient ? <DigitalTwinDashboard /> : <div className="w-full h-full relative"><Skeleton className="w-full h-full" /></div>}
    </main>
  );
}
