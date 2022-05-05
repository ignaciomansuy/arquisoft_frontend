import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
// import config from '../config';

function LocationMarker() {
  const navigate = useNavigate();

  const map = useMapEvents({
    dblclick(e) {
      navigate('/map/add_ubication', { state: { lat: e.latlng.lat, lng: e.latlng.lng } });
      map.locate();
    },
  });
}

export default function Map() {
  const initialPosition = [-33.4369, -70.6343];
  return (
    <MapContainer
      center={initialPosition}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '100vh', width: '100wh' }}
      doubleClickZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
