"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
            // Redirects to Dashboard if successful
            router.push("/dashboard");
        }
    };

    return (
        <div>
            <h1>Sign in</h1>

            <button onClick={() => signIn("google")}>Sign in with Google</button>

            <h2>OR sign in with other email</h2>
            <form onSubmit={handleCredentialsSignIn}>
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
                <button type="submit">Sign in</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>
                Don't have an account?{" "}
                <a href="/auth/register">Create an account</a>
            </p>
        </div>
    );
};

export default SignIn;
