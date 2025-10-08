import type { ReactNode } from 'react';
import { DataProvider } from '@/contexts/data-context';
import DashboardLayout from '@/components/dashboard/dashboard-layout';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </DataProvider>
  );
}
