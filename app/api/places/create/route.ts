import { db } from "@/app/firebaseConfig";
import { doc, collection, getDoc, addDoc, query, where, getDocs, setDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const {
      userEmail,
      placeName,
      placeDescription,
      latitude,
      longitude,
      city,
      state_abbrev,
    } = await request.json();

    if (!userEmail || !placeName || !latitude || !longitude || !city || !state_abbrev) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Needed to trim some descriptions in Marker card
    const trimmedDescription = placeDescription.substring(0, 1000);

    // Checking if email exists in users collection
    const userDocRef = doc(db, "users", userEmail);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 400 });
    }

    // Check if location is already in the locations collection
    const locationsQuery = query(
      collection(db, "locations"),
      where("latitude", "==", latitude),
      where("longitude", "==", longitude)
    );
    const existingLocationSnapshot = await getDocs(locationsQuery);

    let locationId;
    if (!existingLocationSnapshot.empty) {
      // If location exists, get its ID
      locationId = existingLocationSnapshot.docs[0].id;
    } else {
      // Insert new location into Firestore
      const locationDocRef = await addDoc(collection(db, "locations"), {
        name: placeName,
        description: trimmedDescription,
        latitude,
        longitude,
        city,
        stateAbbrev: state_abbrev,
        createdAt: new Date(),
      });
      locationId = locationDocRef.id;
    }

    // console.log("Saving user place:", { userEmail, locationId });

    // Ref to user_places collection within the users document
    const userPlacesCollectionRef = collection(userDocRef, "user_places");
    await addDoc(userPlacesCollectionRef, {
      placeId: locationId,
      addedAt: new Date(),
    });

    return new Response(JSON.stringify({ success: "Place saved successfully", id: locationId }), { status: 201 });
  } catch (error: any) {
    console.error("Error saving place:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
