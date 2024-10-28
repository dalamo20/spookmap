import { db } from '@/app/firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userId');
    if (!userEmail) {
      return new Response(JSON.stringify({ error: "Missing userID" }), { status: 400 });
    }

    // Find Firestore collections where user_email matches
    const q = query(collection(db, "userCollections"), where("userEmail", "==", userEmail));
    const querySnapshot = await getDocs(q);

    const collections = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify({ collections }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
