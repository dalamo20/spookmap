"use client"
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

const Dashboard = () => {
    const { data: session } = useSession();
  return (
    <>
    {session ? (
        <>
            <img src={session.user?.image as string} />
            <h1>Bienvenue, {session.user?.name} </h1>
            {JSON.stringify(session)}
            <button onClick={() => signOut()}>Sign Out</button>

        </>
    ) : (
        <>
            <h1>You are not logged in!</h1>
            <button onClick={() => signIn("google")}>Sign in with Google</button>
        </>
    ) }
    </>
  )
}

export default Dashboard