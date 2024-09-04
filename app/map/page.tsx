'use client'
import Link from 'next/link';
import React, { useState } from 'react';
// import { MapContainer, TileLayer, Marker } from 'react-leaflet';
// import { useLoadScript, GoogleMap as GoogleMapGL } from '@googlemaps/react-map-gl';

const mapStyles = {
    width: '100%',
    height: '50%'
};

const GoogleMaps = () => {
//     const [map, setMap] = useState(null);
//     const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//     libraries: ["places"]
//   });
  return (
    <main>
        <Link href={"/"}>Home</Link>
        <div>GoogleMaps</div>
        {/* {isLoaded && (
          <GoogleMapGL
            mapContainerClassName="map-container"
            center={[19.020145856138136, -98.24006775697993]}
            zoom={17}
            onLoad={setMap}
          >
            <Marker
              position={[19.020145856138136, -98.24006775697993]}
            />
          </GoogleMapGL>
        )} */}
    </main>
  )
}

export default GoogleMaps;