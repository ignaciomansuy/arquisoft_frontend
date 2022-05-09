import React, { useState, useEffect } from 'react';
import { Deserializer } from 'jsonapi-serializer';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import config from '../config';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function UserLocationMarker(userId) {
  console.log(userId.value);
  const [ubications, setUbications] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`${config.API_URL}/map/show_ubications/${userId.value}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return [];
        }
        return response.json();
      })
      .then((data) => {
        new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(
          data,
          (_error, ubications) => setUbications(ubications)
        );
      })
      .catch((error) => console.log(error));
  }, []);
  console.log(ubications);
  return ubications.map((ubi) => (
      <Marker key={ubi.id} position={ubi.latLng.coordinates}>
        <Popup>
          {ubi.name} <br /> De usuario: {ubi.userId}
        </Popup>
      </Marker>
  ))
}

export default function UserMap(userId) {
  const initialPosition = [-33.4369, -70.6343];
  return (
    <MapContainer
      center={initialPosition}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '100vh', width: '100wh' }}
      doubleClickZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserLocationMarker value={userId.value} />
    </MapContainer>
  );
}
