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
  const [position, setPosition] = useState(null);
  // useEffect(() => {
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };
  //   fetch(`${config.API_URL}/map/add_ubication/lat_lng`, requestOptions)
  //     .then((response) => {
  //       if (!response.ok) {
  //         return [];
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       setUbications(data);
  //     })
  //     .catch((error) => console.log(error));
  // }, [position]);

  const map = useMapEvents({
    dblclick(e) {
      setPosition(e.latlng);
      navigate('/map/add_ubication', { position });
      map.locate();
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup> Podría servir para ver el nombre de usuario marcador</Popup>
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
