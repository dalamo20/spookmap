"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import './globals.css';
import Image from 'next/image';

export default function Welcome() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to the home
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  // Just a loading screen while checking status
  if (status === "loading") {
    return <p>Loading...</p>; 
  }

  return (
    <main style={{
      backgroundImage: "url('/images/Spook-Map-bg-image.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      textAlign: "center"
    }}>
      <Image
        src="/images/ghost.png"
        alt="Spooky background image"
        width={120}
        height={159}
      />
      <h1 className="styled-heading">Welcome to <br/> <span>Spookmap!</span></h1>
      <p className="custom-paragraph">Please sign in to continue.</p>
      <button className="sign-in-button" onClick={() => signIn()}>Sign In</button>
      <a href="/auth/register" className="create-account-button">Create an account</a>
    </main>
  );
}
