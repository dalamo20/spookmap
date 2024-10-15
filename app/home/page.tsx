"use client";
import { signOut, useSession } from "next-auth/react";
import Map from "@/components/Map";
import React from "react";
import Image from 'next/image';

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      {session ? (
        <>
        <div className="home-container">
          <div className="nav-div">
            <div className="home-content">
              <Image
                src="/images/ghost.png"
                alt="Spooky background image"
                width={44}
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
          
          <div className="user-cont">
          <img
              src={session.user?.image || '/images/profile-placeholder.svg'}
              alt="User Image"
              className="user-img"
            />
            <p style={{ paddingLeft: '20px' }}>Hello, {session.user?.username ? session.user.username : session.user.email}
</p>
          </div>
          <Map /> 
        </div>
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

export default Home;