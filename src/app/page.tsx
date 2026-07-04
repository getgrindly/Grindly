'use client';

import dynamicImport from 'next/dynamic';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const ClientAppWrapper = dynamicImport(() => import('@/components/ClientAppWrapper'), {
  ssr: false,
});

export default function Home() {
  return <App />;
}
