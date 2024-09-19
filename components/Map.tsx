"use client"

import React, { useEffect } from "react";
import { Loader } from '@googlemaps/js-api-loader';

const Map = () => {
    const mapRef = React.useRef<HTMLDivElement>(null);
    useEffect( () => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
                version: "weekly",
                // libraries: ["places"]
              });

              const { Map } = await loader.importLibrary('maps');

              const position = {
                lat: 41.8781,
                lng: -87.6298
              }

              // map options
              const mapOptions: google.maps.MapOptions = {
                center: position,
                zoom: 17, 
                mapId: "NEXTJS_MAPID"
              }

              // map setup
              const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

        }
        initMap();
    }, [])
    return (
        <>
         <div style={{ height: '600px' }} ref={mapRef}></div>
        </>
    )
}

export default Map