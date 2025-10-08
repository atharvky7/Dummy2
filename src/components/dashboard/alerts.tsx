'use client';

import { useData } from '@/contexts/data-context';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  AlertCircle,
  CheckCircle,
  TriangleAlert,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CommunityBriefDialog } from './community-brief-dialog';

const severityIcons = {
  High: <TriangleAlert className="h-4 w-4 text-destructive" />,
  Medium: <AlertCircle className="h-4 w-4 text-accent" />,
  Low: <CheckCircle className="h-4 w-4 text-primary" />,
};

const severityVariants = {
    High: 'destructive',
    Medium: 'default',
    Low: 'secondary',
} as const;

export default function Alerts() {
  const { alerts, clearAlerts } = useData();

  return (
    <SidebarGroup className="flex-1">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Alerts</SidebarGroupLabel>
        {alerts.length > 0 && (
          <Button variant="ghost" size="sm" className="px-2" onClick={clearAlerts}>
            Clear All
          </Button>
        )}
      </div>
      <ScrollArea className="h-full">
        {alerts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center text-sm text-muted-foreground">
            <CheckCircle className="mb-2 h-8 w-8 text-primary" />
            <p>No active alerts.</p>
            <p>All systems are nominal.</p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {alerts.map((alert) => (
              <Card key={alert.id} className="group/alert relative text-sm">
                 <CardHeader className="flex flex-row items-center gap-2 space-y-0 p-3">
                    {severityIcons[alert.severity]}
                    <CardTitle className="text-sm font-semibold">{alert.title}</CardTitle>
                    <Badge variant={severityVariants[alert.severity]} className="ml-auto">{alert.severity}</Badge>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                    <CardDescription>{alert.description}</CardDescription>
                    <p className="mt-2 text-xs text-muted-foreground">
                        {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </p>
                    <CommunityBriefDialog alert={alert}>
                        <Button size="sm" variant="secondary" className="mt-3 w-full">
                            Generate Community Brief
                        </Button>
                    </CommunityBriefDialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </SidebarGroup>
  );
}
