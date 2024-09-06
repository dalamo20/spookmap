// import Link from "next/link";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <main>
      <Dashboard/>
      {/* <h1>Welcome to Spookmap!</h1>
      {session ? (
        <>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <>
          <button onClick={() => signIn('google')}>Sign in with Google</button>
          <button onClick={() => signIn('credentials', { redirect: false, username: 'admin', password: 'password' })}>
            Sign in with Credentials
          </button>
        </>
      )}
      <Link href={"/map"}>Map</Link> */}
    </main>
  );
}
