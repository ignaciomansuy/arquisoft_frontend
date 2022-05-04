import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';

function LocationMarker() {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    dblclick() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      console.log("position");
      console.log(position);
      navigate('/map/add_ubication');
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        {' '}
        Podría servir para ver el nombre de usuario marcador <br />{' '}
        Customizable.
      </Popup>
    </Marker>
  );
}

export default function Map() {
  const initialPosition = [-33.4369, -70.6343];

  return (
    <MapContainer
      center={initialPosition}
      zoom={15}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
