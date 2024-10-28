import { db } from "@/app/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { collectionId, newName } = await request.json();

    if (!collectionId || !newName) {
      return new Response(JSON.stringify({ error: 'Missing collectionId or newName' }), { status: 400 });
    }

    // Update collection name in Firestore
    const collectionDocRef = doc(db, "userCollections", collectionId);
    await updateDoc(collectionDocRef, { name: newName });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
