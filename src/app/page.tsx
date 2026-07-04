'use client';

import { Suspense } from 'react';
import dynamicImport from 'next/dynamic';

const ClientAppWrapper = dynamicImport(() => import('@/components/ClientAppWrapper'), {
  ssr: false,
  loading: () => <div>Loading Grindly...</div>,
});

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientAppWrapper />
    </Suspense>
  );
}
