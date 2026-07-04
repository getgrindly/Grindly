'use client';

import dynamicImport from 'next/dynamic';

const ClientAppWrapper = dynamicImport(() => import('@/components/ClientAppWrapper'), {
  ssr: false,
});

export default function Home() {
  return <ClientAppWrapper />;
}
