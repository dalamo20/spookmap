import { db } from "../../../../firebaseConfig"; 
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export async function GET(request: Request, { params }: { params: { collectionId: string } }) {
  try {
    const { collectionId } = params;
    // console.log("Fetching places for collectionId:", collectionId);

    // Get collection details for folder name
    const collectionDocRef = doc(db, "userCollections", collectionId);
    const collectionDoc = await getDoc(collectionDocRef);

    if (!collectionDoc.exists()) {
      return new Response(JSON.stringify({ error: "Collection not found" }), { status: 404 });
    }

    // Select places in collection
    const placesCollectionRef = collection(collectionDocRef, "places");
    const placesSnapshot = await getDocs(placesCollectionRef);
    const places = placesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // console.log("Fetched places and collectionDetails:", places, collectionDoc.data());

    return new Response(JSON.stringify({ places, collection: collectionDoc.data() }), { status: 200 });
  } catch (error: any) {
    console.error("Error fetching places:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
