"use client";
import { signOut, useSession } from "next-auth/react";
import Map from "@/components/Map";
import React from "react";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      {session ? (
        <>
          <img src={session.user?.image as string} alt="User Image" />
          <h1>Bienvenue, {session.user?.name}</h1>
          <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
          <Map /> 
        </>
      ) : (
        <>
          <h1>You are not logged in!</h1>
          <button onClick={() => window.location.href = "/"}>Go to Home</button>
        </>
      )}
    </>
  );
};

export default Dashboard;
