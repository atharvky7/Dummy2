'use client';

import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Alert } from '@/lib/types';
import { generateCommunityBrief } from '@/ai/flows/generate-community-brief';
import { Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunityBriefDialogProps {
  alert: Alert;
  children: ReactNode;
}

export function CommunityBriefDialog({ alert, children }: CommunityBriefDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [brief, setBrief] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateBrief = async () => {
    setIsLoading(true);
    setBrief('');
    try {
      const result = await generateCommunityBrief({
        alertType: alert.title,
        alertDetails: alert.description,
        mitigationPlan: alert.mitigationPlan,
        communityImpact: alert.communityImpact,
        siteName: 'EcoConstruct Site A',
        date: new Date(alert.timestamp).toLocaleDateString(),
      });
      setBrief(result.communityBrief);
    } catch (error) {
      console.error('Failed to generate community brief:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate community brief. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([brief], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `community-brief-${alert.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Community Brief Generator</DialogTitle>
          <DialogDescription>
            Generate a downloadable brief for the community regarding the alert.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!brief && !isLoading && (
            <div className="text-center p-4">
              <p className="mb-4">Click the button below to generate a brief for this alert:</p>
              <p className="text-sm text-muted-foreground font-semibold">{alert.title}</p>
            </div>
          )}
          {isLoading && (
            <div className="flex min-h-[150px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {brief && (
            <Textarea
              readOnly
              value={brief}
              className="min-h-[200px] bg-secondary font-mono text-sm"
              aria-label="Generated Community Brief"
            />
          )}
        </div>
        <DialogFooter>
          {brief ? (
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2" /> Download Brief
            </Button>
          ) : (
            <Button onClick={handleGenerateBrief} disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 animate-spin" />}
              Generate Brief
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
