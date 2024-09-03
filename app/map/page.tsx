'use client'
import Link from 'next/link';
import React from 'react';
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const mapStyles = {
    width: '100%',
    height: '50%'
};

const GoogleMaps = () => {
  return (
    <main>
        <Link href={"/"}>Home</Link>
        <div>GoogleMaps</div>
        <Map
            google={window.google}
            zoom={17}
            style={mapStyles}
            initialCenter={
                {
                    lat: 19.020145856138136, 
                    lng: -98.24006775697993
                }
            }
        >
            <Marker
              position={
                  {
                      lat: 19.020145856138136, 
                      lng: -98.24006775697993
                  }
              }
           />
        </Map>
    </main>
  )
}

export default GoogleApiWrapper({
    apiKey: ""
})(GoogleMaps);