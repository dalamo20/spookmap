import { db } from "@/app/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { name, userEmail } = await request.json();
    // console.log('Creating new collection:', { name, userEmail });

    if (!name || !userEmail) {
      console.error('Missing name or userEmail');
      return new Response(JSON.stringify({ error: 'Missing name or userEmail' }), { status: 400 });
    }

    // Add collection to Firestore
    const collectionsRef = collection(db, "userCollections");
    const result = await addDoc(collectionsRef, {
      name,
      userEmail,
      createdAt: serverTimestamp(),
    });

    return new Response(JSON.stringify({ success: true, collectionId: result.id }), { status: 201 });
  } catch (error: any) {
    console.error('Error creating collection:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
