'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import placeholderImages from '@/lib/placeholder-images.json';
import { ArrowRight, Building } from 'lucide-react';

export default function LoginPage() {
  const bgImage = placeholderImages.placeholderImages.find(img => img.id === 'login-background');

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          data-ai-hint={bgImage.imageHint}
          fill
          className="absolute inset-0 z-0 object-cover opacity-20"
        />
      )}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/30 via-background/80 to-background" />

      <main className="z-20 flex w-full max-w-md flex-col items-center justify-center p-4">
        <Card className="w-full animate-fade-in-up backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Welcome to EcoConstruct</CardTitle>
            <CardDescription>
              Smart Operations & Sustainability for Modern Construction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-center text-sm text-muted-foreground">
              This is a demo application. Choose an option below to enter the dashboard.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                Sign in as Demo User
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/dashboard">
                Sign up as Guest
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          A platform for smarter, greener, and community-aware digital operations.
        </p>
      </main>
    </div>
  );
}
