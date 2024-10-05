"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const CollectionPage = () => {
  const { data: session } = useSession();
  const { collectionId } = useParams(); 
  const [places, setPlaces] = useState<{id: number, name: string, description: string, latitude: number, longitude: number}[]>([]);

  useEffect(() => {
    if (session && collectionId) {
      console.log("Fetching places for collectionId:", collectionId);
      fetch(`/api/collections/${collectionId}/places`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched places:", data);
          setPlaces(data.places);
        })
        .catch((error) => console.error("Error fetching places:", error));
    } else {
      console.log("No session or collectionId found:", { session, collectionId });
    }
  }, [session, collectionId]);

  return session ? (
    <div>
      <h1>Places in Collection</h1>
      <button onClick={() => window.location.href = '/collections'}>Collections</button>
      {places.length > 0 ? (
        <ul>
          {places.map((place) => (
            <li key={place.id}>
              <h3>{place.name}</h3>
              <p>{place.description}</p>
              <p>Latitude: {place.latitude}, Longitude: {place.longitude}</p>
            </li>
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
