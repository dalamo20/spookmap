'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'

const Login = () => {
    const {data:session} = useSession();
    
    useEffect(() => {
        console.log("This is session "+session);
    }, [session])
  return (
    <div>
        <Image src='/spookIcon.png' alt={'logo'} width={100} height={100}/>
        <button onClick={() => signIn()} type='button'>Sign in to Google</button>
    </div>
  )
}

export default Login