import { db } from "../../../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { collectionId } = await request.json();

    if (!collectionId) {
      return new Response(JSON.stringify({ error: "Missing collectionId" }), { status: 400 });
    }

    // Delete the collection document from Firestore
    const collectionDocRef = doc(db, "userCollections", collectionId);
    await deleteDoc(collectionDocRef);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
