"use client";

import { useSearchParams } from "next/navigation";

const ErrorPageContentComponent = () => {
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

      <a style={{ "color": "white" }} href="/auth/signin">Back to Sign In</a>
    </div>
  );
};

export default ErrorPageContentComponent;
