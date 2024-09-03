import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>HEJ</h1>
      <Link href={"/map"}>Map</Link>
    </main>
  );
}
