"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from "next/navigation";

// Dynamically importing ErrorPageContent without SSR
const ErrorPageContent = dynamic(() => import('./ErrorPageContentComponent'), {
  ssr: false,
});

const ErrorPage = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <ErrorPageContent />
  </Suspense>
);

export const dynamicPage = 'force-dynamic';  

export default ErrorPage;
