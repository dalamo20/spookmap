"use client";

import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";

const ErrorPageContent = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div>
      <h1>Authentication Error</h1>
      {error ? (
        <p style={{ color: "red" }}>
          {error}
        </p>
      ) : (
        <p>Something went wrong during the authentication process. Please try again.</p>
      )}

      <a href="/auth/signin">Back to Sign In</a>
    </div>
  );
};

const ErrorPage = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <ErrorPageContent />
  </Suspense>
);

export const dynamic = 'force-dynamic';  

export default ErrorPage;
