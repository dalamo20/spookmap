import { db } from "../../../firebaseConfig";
import { doc, collection, addDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { collectionId, placeId, placeData } = await request.json();

    if (!collectionId || !placeId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // console.log(`Adding place ${placeId} to collection ${collectionId}`);

    // Add location to collection
    const collectionDocRef = doc(db, "userCollections", collectionId);
    await addDoc(collection(collectionDocRef, "places"), {
      placeId,
      ...placeData,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error: any) {
    console.error("Error saving place to collection:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
