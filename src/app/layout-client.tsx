'use client';

import { TooltipProvider } from '@/components/ui/tooltip';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
    </TooltipProvider>
  );
}
