import { db } from "../../../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { collectionId, placeId } = await request.json();

    if (!collectionId || !placeId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Remove the place from the collection
    const placeDocRef = doc(db, `userCollections/${collectionId}/places`, placeId);
    await deleteDoc(placeDocRef);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
