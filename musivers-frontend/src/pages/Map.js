import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapPage() {
  const position = [51.505, -0.09]; // Default location (London)
  
  return (
    <div>
      <h2>Map of Events</h2>
      <MapContainer center={position} zoom={13} style={{ height: '500px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={position}>
          <Popup>Musivers Event</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapPage;
