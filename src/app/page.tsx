'use client';

import dynamicImport from 'next/dynamic';
import App from '@/components/App';

const ClientAppWrapper = dynamicImport(() => import('@/components/ClientAppWrapper'), {
  ssr: false,
});

export default function Home() {
  return <App />;
}
