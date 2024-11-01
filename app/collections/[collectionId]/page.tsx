"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import { db } from "@/app/firebaseConfig";
import { doc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

const CollectionPage = () => {
  const { data: session } = useSession();
  const { collectionId: rawCollectionId } = useParams();
  const collectionId = Array.isArray(rawCollectionId) ? rawCollectionId[0] : rawCollectionId;
  const [places, setPlaces] = useState<{ id: string, name: string, description: string, city: string, stateAbbrev: string }[]>([]);
  const [collectionName, setCollectionName] = useState<string>("");

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (session && collectionId) {
      fetchPlaces();
    }
  }, [session, collectionId]);

  const fetchPlaces = async () => {
    try {
      const collectionDocRef = doc(db, "userCollections", collectionId);
      const collectionDoc = await getDoc(collectionDocRef);
    
      if (collectionDoc.exists() && collectionDoc.data().userEmail === session?.user.email) {
        setCollectionName(collectionDoc.data()?.name);
        const placesCollectionRef = collection(collectionDocRef, "places");
        const placesSnapshot = await getDocs(placesCollectionRef);
    
        const fetchedPlaces = await Promise.all(
          placesSnapshot.docs.map(async (placeDoc) => {
            const placeId = placeDoc.data().placeId;
            const locationDocRef = doc(db, "locations", placeId);
            const locationDoc = await getDoc(locationDocRef);
    
            if (locationDoc.exists()) {
              const placeData = locationDoc.data();
              return {
                id: placeDoc.id,
                name: placeData.name || "",
                description: capitalizeFirstLetter(placeData.description || ""),
                city: placeData.city || "",
                stateAbbrev: placeData.stateAbbrev || "", 
              };
            } else {
              return null;
            }
          })
        );
    
        setPlaces(fetchedPlaces.filter((place) => place !== null));
      } else {
        console.error("Collection not found or not owned by the current user");
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };  

  const removePlaceFromCollection = async (placeId: string) => {
    try {
      // Fetch the document with the placeId in the nested places collection
      const placeDocRef = doc(db, "userCollections", collectionId, "places", placeId);
      const placeDoc = await getDoc(placeDocRef);
      const locationId = placeDoc.data()?.placeId;
      // Delete place document nested in users collection
      await deleteDoc(placeDocRef);
      // Check if location is part of any other collection
      const isLocationReferenced = await checkIfLocationReferenced(locationId);
      if (!isLocationReferenced) {
        await deleteDoc(doc(db, "locations", locationId));
        // console.log(`Location ${locationId} deleted from locations collection.`);
      }
      // Remove location from state
      setPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== placeId));
      console.log('Place removed successfully.');
    } catch (error) {
      console.error('Error removing place:', error);
    }
  };
  
  // Helper function/ checks if location referenced in any collection 
  const checkIfLocationReferenced = async (placeId: string) => {
    const collectionsSnapshot = await getDocs(collection(db, "userCollections"));
    for (const collectionDoc of collectionsSnapshot.docs) {
      const placesCollectionRef = collection(collectionDoc.ref, "places");
      const placesSnapshot = await getDocs(placesCollectionRef);
      if (placesSnapshot.docs.some((placeDoc) => placeDoc.data().placeId === placeId)) {
        return true; // Found a reference to this location
      }
    }
    return false; // No references found
  };

  return session ? (
    <div className="places-container">
      <div className="nav-div">
            <div className="home-content">
            <Image
                src="/images/SpookMap_logo.svg"
                alt="Spooky background image"
                width={300}
                height={200}
                className="ghost-image"
              />
            </div>

            <div className="btn-cont">
            <button className="collections-btn home-btn" onClick={() => window.location.href = '/home'}>
                <span>Home</span>
              </button>
              <button style={{marginLeft: '10px'}} className="collections-btn" onClick={() => window.location.href = '/collections'}>
                <span>Collections</span>
                <Image src="/images/Save.png" alt="save ribbon" width={20} height={20} />
              </button>
              <a className="signOutBtn" onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</a>
            </div>
          </div>
      <p className="page-heading">{collectionName ? `Haunts in ${collectionName}` : 'Haunts in Collection'}</p>
      <div>
        
      </div>
      {places.length > 0 ? (
  <ul>
    {places.map((place) => (
      <div className="haunts" key={place.id}>
        <Image className="location-img" src="/images/Location.png" alt="location icon" width={20} height={20} />
        <li key={place.id}>
          <h3>{place.name}</h3>
          <p>{place.description}</p>
          <p><i>
            {place.city && place.stateAbbrev ? `${place.city}, ${place.stateAbbrev}` : "City, State"}
          </i></p>
          <Image 
            onClick={() => removePlaceFromCollection(place.id)} 
            className="remove-btn" 
            src="/images/delete.png" 
            alt="trash icon" 
            width={20} 
            height={20} 
          />
        </li>
      </div>
    ))}
  </ul>
) : (
  <p>No places found in this collection.</p>
)}
    </div>
  ) : (
    <p>Please log in to view this collection.</p>
  );
};

export default CollectionPage;
