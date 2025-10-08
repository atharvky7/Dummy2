'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, LifeBuoy, LogOut, Moon, Settings, Sun, Wifi, WifiOff } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/data-context';
import placeholderImages from '@/lib/placeholder-images.json';
import { useTheme } from 'next-themes';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard Overview',
  '/dashboard/map': '3D Sensor Map',
  '/dashboard/circularity': 'Circularity Advisor',
  '/dashboard/simulation': 'What-if Simulation',
};

export default function Header() {
  const pathname = usePathname();
  const { isOffline, setIsOffline } = useData();
  const { setTheme } = useTheme();

  const userAvatar = placeholderImages.placeholderImages.find(img => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="hidden md:block">
        <h1 className="font-headline text-xl font-semibold">
          {pageTitles[pathname] ?? 'EcoConstruct'}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2" title={isOffline ? 'Offline Mode' : 'Online Mode'}>
           <Label htmlFor="offline-mode" className="text-sm font-medium hidden sm:block">
            Simulate Offline
          </Label>
          <Switch
            id="offline-mode"
            checked={isOffline}
            onCheckedChange={setIsOffline}
            aria-label="Toggle offline mode simulation"
          />
           {isOffline ? <WifiOff className="h-5 w-5 text-destructive" /> : <Wifi className="h-5 w-5 text-primary" />}
        </div>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Demo User" data-ai-hint={userAvatar.imageHint} />}
                <AvatarFallback>DU</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Demo User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                   <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
