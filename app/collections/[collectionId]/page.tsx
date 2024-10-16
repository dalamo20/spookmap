"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from 'next/image';

const CollectionPage = () => {
  const { data: session } = useSession();
  const { collectionId } = useParams(); 
  const [places, setPlaces] = useState<{id: number, name: string, description: string, city: string, state_abbrev: string}[]>([]);
  const [collectionName, setCollectionName] = useState<string>("");

  const capitalizeFirstLetter = (str: any) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  

  useEffect(() => {
    if (session && collectionId) {
      console.log("Fetching places for collectionId:", collectionId);
      fetch(`/api/collections/${collectionId}/places`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched places:", data);
          // Capitalizes first letter in description. Some desc need it
          const updatedPlaces = data.places.map((place: any) => ({
            ...place,
            description: capitalizeFirstLetter(place.description)
          }));
          setPlaces(updatedPlaces);
          setCollectionName(data.collection.name);
        })
        .catch((error) => console.error("Error fetching places:", error));
    } else {
      console.log("No session or collectionId found:", { session, collectionId });
    }
  }, [session, collectionId]);

  // Remove a place from collection
  const removePlaceFromCollection = async (placeId: number) => {
    try {
      const res = await fetch('/api/collections/removePlace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionId, placeId }),
      });

      if (res.ok) {
        // Removes location from state
        setPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== placeId));
        console.log('Place removed successfully.');
      } else {
        const data = await res.json();
        console.error('Error removing place:', data.error);
      }
    } catch (error) {
      console.error('Error removing place:', error);
    }
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
                  {place.city && place.state_abbrev ? `${place.city}, ${place.state_abbrev}` : "City, State"}
                </i></p>
                <Image onClick={() => removePlaceFromCollection(place.id)} className="remove-btn" src="/images/delete.png" alt="trash icon" width={20} height={20} />
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
