"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="sign-in-container">
      <h1 className="signInH1">Sign in</h1>

      <form onSubmit={handleCredentialsSignIn} className="custom-sign-in-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="sign-in-form">Sign in</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      <p className="continueP"> Or continue with </p>

      <button className="sign-in-google" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
      <Image src="/images/Google.svg" alt="Google" width={20} height={20} />
        <span>Sign in with Google</span>
      </button>

      <p className="createLinkP">
        Don't have an account yet? <a href="/auth/register" className="createLink">Create an account</a>
      </p>
    </div>
  );
};

export default SignIn;