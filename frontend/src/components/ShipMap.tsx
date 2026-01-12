import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShipPosition } from '../types';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface ShipMapProps {
  position: ShipPosition;
  shipName?: string;
}

const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const ShipMap: React.FC<ShipMapProps> = ({ position, shipName }) => {
  const center: [number, number] = [position.latitude, position.longitude];

  return (
    <Box sx={{ height: 400, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        <Marker position={center}>
          <Popup>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {shipName || 'Ferry Ship'}
              </Typography>
              <Typography variant="body2">
                Status: {position.status}
              </Typography>
              <Typography variant="body2">
                Speed: {position.speed} knots
              </Typography>
              <Typography variant="caption" display="block">
                Lat: {position.latitude.toFixed(4)}, Lon: {position.longitude.toFixed(4)}
              </Typography>
            </Box>
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default ShipMap;
