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

function LocationMarker() {
  const navigate = useNavigate();
  const [ubications, setUbications] = useState([]);

  useEffect(() => {
    fetch(`${config.API_URL}/map/index`)
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
  const map = useMapEvents({
    dblclick(e) {
      navigate('/map/add_ubication', {
        state: { lat: e.latlng.lat, lng: e.latlng.lng },
      });
      map.locate();
    },
  });
  return ubications.map((ubi) => (
      <Marker key={ubi.id} position={ubi.coordinate.coordinates}>
        <Popup>
          {ubi.name} <br /> De usuario: {ubi.userId}
        </Popup>
      </Marker>
  ))
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
