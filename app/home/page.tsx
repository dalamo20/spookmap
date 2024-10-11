"use client";
import { signOut, useSession } from "next-auth/react";
import Map from "@/components/Map";
import React from "react";
import Image from 'next/image';

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      {session ? (
        <>
        <div className="home-container">
          <div className="home-content">
            <Image
              src="/images/ghost.png"
              alt="Spooky background image"
              width={27}
              height={44}
              className="ghost-image"
            />
            <p className="spookmap-text">SPOOKMAP</p>
          </div>

          <div className="btn-cont">
            <button className="collections-btn" onClick={() => window.location.href = '/collections'}>
              <span>Collections</span>
              <Image src="/images/Save.png" alt="save ribbon" width={20} height={20} />
            </button>
            <a className="signOutBtn" onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</a>
          </div>
        </div>
        <img src={session.user?.image as string} alt="User Image" />
        <p>Hello, {session.user?.name}</p>
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