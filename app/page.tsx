"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to the dashboard
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // Just a loading screen while checking status
  if (status === "loading") {
    return <p>Loading...</p>; 
  }

  return (
    <main>
      <h1>Welcome! Please sign in to continue.</h1>
      <button onClick={() => signIn()}>Sign In</button>
    </main>
  );
}
