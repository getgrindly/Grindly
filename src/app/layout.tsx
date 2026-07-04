import type { Metadata } from 'next';
import React from 'react';
import '@/styles/globals.css';
import { LayoutContent } from './layout-client';

export const metadata: Metadata = {
  title: 'Grindly - Master Your Craft',
  description: 'Learn, practice, and master software engineering skills',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
