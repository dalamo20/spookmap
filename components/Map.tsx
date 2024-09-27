"use client"

import React, { useEffect, useState } from "react";
import { Library, Loader } from '@googlemaps/js-api-loader';
import { useSession } from 'next-auth/react';
import { useJsApiLoader } from '@react-google-maps/api';
import hauntedPlaces from '../public/haunted_places.json';

const Map = () => {
    const { data: session } = useSession();
    const libs: Library[] = ["core", "maps", "places", "marker", "geometry"];

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [autoComplete, setAutoComplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [place, setPlace] = useState<string | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: libs
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
                mapId: "NEXTJS_MAPID"
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
                </div>
            `,
        });

        google.maps.event.addListener(infoWindow, 'domready', () => {
            document.getElementById('savePlaceBtn').addEventListener('click', () => {
                // this saves place to collection
                fetch('/api/places/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: session?.user?.email, 
                        placeId: title,
                        placeName: title,
                        placeDescription: description
                    })
                }).then(response => response.json())
                .then(data => console.log(data));
            });
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    };

    return session ? (
        <>
        <input ref={placeAutoCompRef} placeholder="Enter a location" />
        <label>{place}</label>
        {isLoaded ?
            <div style={{ height: '600px' }} ref={mapRef}></div> :
            <p>Loading ...</p>
        }
        </>
    ) : (
        <p>Please log in to view the map.</p>
    );
}

export default Map;
