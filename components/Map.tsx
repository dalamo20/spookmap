"use client"

import React, { useEffect, useState } from "react";
import { Library, Loader } from '@googlemaps/js-api-loader';
import { useSession } from 'next-auth/react';
import { useJsApiLoader } from '@react-google-maps/api'

const Map = () => {
    const { data: session } = useSession();
    const libs: Library[] = ["core", "maps", "places", "marker"];

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [autoComplete, setAutoComplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [place, setPlace] = useState<string | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: libs
    })

    const buildMapInfoCardContent = (title: string, body: string) => {
        return `
            <div class='map_infocard_content'>
                <div class='map_infocard_title'>
                    ${title}
                </div>
                <div class='map_infocard_body'>
                    ${body}
                </div>
            </div>
        `;
    }

    const mapRef = React.useRef<HTMLDivElement>(null);
    const placeAutoCompRef = React.useRef<HTMLInputElement>(null);

    useEffect( () => {
        if (!session) return; // if not authorized, do not show map
        if(isLoaded){
            const mapOptions = {
                center: {
                    lat: 41.8781, 
                    lng: -87.6298
                },
                zoom: 17, 
                mapId: "NEXTJS_MAPID"
            }
            // sets the map
            const googleMap = new google.maps.Map(mapRef.current as HTMLDivElement, mapOptions);
            // creates a boundary
            const usBoundary = new google.maps.LatLngBounds(
                new google.maps.LatLng({ 
                    lat: 24.541466, // Southwest corner
                    lng: -124.838851  // Southwest corner
                }),
                new google.maps.LatLng({ 
                    lat: 49.188608,  // Northeast corner
                    lng: -66.941772   // Northeast corner
                })
            );
            // autocomplete feature
            const googleAutoComplete = new google.maps.places.Autocomplete(placeAutoCompRef.current as HTMLInputElement, {
                bounds: usBoundary,
                fields: ['formatted_address', 'geometry', 'name'],
                componentRestrictions: {
                    country: ['us']
                }
            });
            setAutoComplete(googleAutoComplete);
            setMap(googleMap);
        }
    }, [session, isLoaded]);

    useEffect(() => {
        if(autoComplete){
            autoComplete.addListener('place_changed', () => {
                const place = autoComplete.getPlace();
                console.log(place);
                setPlace(place.formatted_address as string);
                const position = place.geometry?.location;

                if (position){
                    setMarker(position, place.name!);
                }
            })
        }
    }, [autoComplete])

    // sets marker to searched location
    function setMarker(location: google.maps.LatLng, name: string){
        if (!map) return;
        map.setCenter(location);
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: location,
            title: "Marker"
        })

        const infoCard = new google.maps.InfoWindow({
            position: location,
            content: buildMapInfoCardContent(name, name),
            maxWidth: 200
        })

        infoCard.open({
            map: map,
            anchor: marker
        });
    }

    return session ? (
        <>
        <input ref={placeAutoCompRef}/>
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
