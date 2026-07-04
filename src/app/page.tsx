'use client';

import dynamicImport from 'next/dynamic';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const App = dynamicImport(() => import('@/components/App'), {
  ssr: false,
});

export default function Home() {
  return <App />;
}
