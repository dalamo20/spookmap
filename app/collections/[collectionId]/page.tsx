"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from 'next/image';

const CollectionPage = () => {
  const { data: session } = useSession();
  const { collectionId } = useParams(); 
  const [places, setPlaces] = useState<{id: number, name: string, description: string, city: string, state_abbrev: string}[]>([]);
  const [collectionName, setCollectionName] = useState<string>("");

  useEffect(() => {
    if (session && collectionId) {
      console.log("Fetching places for collectionId:", collectionId);
      fetch(`/api/collections/${collectionId}/places`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched places:", data);
          setPlaces(data.places);
          setCollectionName(data.collection.name);
        })
        .catch((error) => console.error("Error fetching places:", error));
    } else {
      console.log("No session or collectionId found:", { session, collectionId });
    }
  }, [session, collectionId]);

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
            <div className="haunts">
              <Image className="location-img" src="/images/Location.png" alt="location icon" width={20} height={20} />
              <li key={place.id}>
                <h3>{place.name}</h3>
                <p>{place.description}</p>
                <p>{place.city}, {place.state_abbrev}</p>
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
