"use client"

import React, { useEffect, useState } from "react";
import { Library, Loader } from '@googlemaps/js-api-loader';
import { useSession } from 'next-auth/react';
import { useJsApiLoader } from '@react-google-maps/api';
import hauntedPlaces from '../public/haunted_places.json';
import Image from 'next/image';
import { db } from '@/app/firebaseConfig';
import { collection, addDoc, Timestamp } from "firebase/firestore";

interface Place {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    city: string;
    state_abbrev: string;
  }
  

  const savePlaceToFirestore = async (place: Place) => {
    try {
      const docRef = await addDoc(collection(db, "locations"), {
        name: place.name,
        description: place.description,
        latitude: place.latitude,
        longitude: place.longitude,
        city: place.city,
        stateAbbrev: place.state_abbrev,
        createdAt: Timestamp.now(),
      });
      //console.log("Location added with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving place:", error);
    }
  };  

const libraries: Library[] = ["core", "maps", "places", "marker", "geometry"];

const Map = () => {
    const { data: session } = useSession();
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [autoComplete, setAutoComplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [place, setPlace] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [collections, setCollections] = useState<any[]>([]);
    const [newCollectionName, setNewCollectionName] = useState(''); 
    const [selectedCollectionId, setSelectedCollectionId] = useState('');
    const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries
    });

    const mapRef = React.useRef<HTMLDivElement>(null);
    const placeAutoCompRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!session) return; // if not authorized, do not show map
        if (isLoaded) {
            const mapOptions = {
                center: {
                    lat: 41.8781, 
                    lng: -87.6298
                },
                zoom: 17, 
                mapId: "6f36effab0d22861",
                mapTypeControl: false, 
            };

            // Initialize map
            const googleMap = new google.maps.Map(mapRef.current as HTMLDivElement, mapOptions);
            setMap(googleMap);

            // Restrict search to US only
            const usBoundary = new google.maps.LatLngBounds(
                new google.maps.LatLng({ lat: 24.541466, lng: -124.838851 }),
                new google.maps.LatLng({ lat: 49.188608, lng: -66.941772 })
            );

            // Setup autocomplete
            const googleAutoComplete = new google.maps.places.Autocomplete(placeAutoCompRef.current as HTMLInputElement, {
                bounds: usBoundary,
                fields: ['formatted_address', 'geometry', 'name'],
                componentRestrictions: { country: ['us'] }
            });

            googleAutoComplete.addListener('place_changed', () => {
                const place = googleAutoComplete.getPlace();
                const location = place.geometry?.location;
                if (location) {
                    googleMap.setCenter(location);
                    displayHauntedPlaces(googleMap, location);
                }
            });

            setAutoComplete(googleAutoComplete);
        }
    }, [session, isLoaded]);

    const displayHauntedPlaces = (map: google.maps.Map, userLocation: google.maps.LatLng) => {
        if (!hauntedPlaces) return;

        hauntedPlaces.forEach((place: any) => {
            const placeLocation = new google.maps.LatLng(place.latitude, place.longitude);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, placeLocation);

            // Radius distance is meters
            if (distance < 20000) {
                createMarker(map, placeLocation, place.location, place.description);
            }
        });
    };

    const createMarker = (map: google.maps.Map, position: google.maps.LatLng, title: string, description: string) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position,
            map,
            title,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <button id="savePlaceBtn">Save to Collection</button>
                    <div id="dropdownContainer"></div>
                </div>
            `,
        });

        google.maps.event.addListener(infoWindow, 'domready', async () => {
            const savePlaceBtn = document.getElementById('savePlaceBtn');
            if (savePlaceBtn) {  
                savePlaceBtn.addEventListener('click', async () => {
                    const placeData = hauntedPlaces.find(p => p.location === title);
                    // Save place to the location table
                    const response = await fetch('/api/places/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userEmail: session?.user?.email,
                            placeName: title,
                            placeDescription: description,
                            latitude: position.lat(),
                            longitude: position.lng(),
                            city: placeData?.city,
                            state_abbrev: placeData?.state_abbrev,
                        }),
                    });
        
                    const savedPlace = await response.json();
                    if (savedPlace && savedPlace.id) {
                        setSelectedPlace(savedPlace);
                        setShowModal(true);
                        fetchCollections();
                    } else {
                        console.error('Error saving place:', savedPlace);
                    }
                });
            }
        });
        

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    };

    // Fetch user's collections from the API
    const fetchCollections = async () => {
        const response = await fetch(`/api/collections?userId=${session?.user?.email}`);
        const data = await response.json();
        setCollections(data.collections);
    };

    // Handle saving the place to a selected or new collection
    const savePlaceToCollection = async () => {
        let collectionId = selectedCollectionId;

        if (!collectionId && newCollectionName) {
            try {
                // console.log('Creating a new collection with name:', newCollectionName, 'and userEmail:', session?.user?.email);
                
                const newCollectionRes = await fetch('/api/collections/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newCollectionName, userEmail: session?.user?.email }),
                });
                
                const newCollectionData = await newCollectionRes.json();
                // console.log('New Collection Created:', newCollectionData);
                
                if (newCollectionData.success) {
                    collectionId = newCollectionData.collectionId;
                    setCollections([...collections, { id: collectionId, name: newCollectionName }]);
                    setNewCollectionName(''); 
                    setShowModal(false);       
                } else {
                    console.error('Failed to create collection:', newCollectionData);
                }
            } catch (error) {
                console.error('Error creating collection:', error);
            }
        }

        if (!collectionId) {
            console.error('No collection selected or created.');
            return;
        }
    
        if (!selectedPlace || !selectedPlace.id) {
            console.error('No place selected to save.');
            return;
        }

        try {
            const response = await fetch('/api/collections/addPlace', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collectionId, placeId: selectedPlace.id }),
            });
    
            if (response.ok) {
                console.log('Place successfully saved to collection.');
                setShowModal(false); 
            } else {
                console.error('Error saving place to collection:', await response.json());
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return session ? (
        <>
        <div className="srch-container">
            <input ref={placeAutoCompRef} placeholder="Enter a location" />
        </div>
        <label>{place}</label>
        {isLoaded ?
            <div style={{ height: '600px' }} ref={mapRef}></div> :
            <p>Loading ...</p>
        }
        {/* Modal for creating/selecting collection */}
        {showModal && (
            <div className="modal">
                <div className="modal-content">
                    <h2>Save to Collection</h2>
                    <select
                        value={selectedCollectionId}
                        onChange={(e) => setSelectedCollectionId(e.target.value)}
                    >
                        <option value="">Add to Existing Collection</option>
                        {collections && collections.length > 0 ? (
                            collections.map(collection => (
                            <option key={collection.id} value={collection.id}>{collection.name}</option>
                            ))
                        ) : (
                        <option disabled> No collections available</option>
                    )}
                    </select>
                    {!selectedCollectionId && (
                        <input
                            type="text"
                            placeholder="New Collection Name"
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                        />
                    )}
                    <button onClick={savePlaceToCollection} disabled={!newCollectionName && !selectedCollectionId}>Save</button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                </div>
            </div>
        )}
        </>
    ) 
    : (
        <p>Please log in to view the map.</p>
    );
}

export default Map;
