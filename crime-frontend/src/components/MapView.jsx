import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../context/ThemeContext';

const MapView = () => {
  const { theme } = useTheme();
  const position = [51.505, -0.09]; // London

  const lightUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const darkUrl = "https://api.maptiler.com/maps/streets-dark/{z}/{x}/{y}.png?key=2TSbovEWsrLQVKABFfa3";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  const darkAttribution = '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%' }} key={theme}>
      <TileLayer
        url={theme === 'light' ? lightUrl : darkUrl}
        attribution={theme === 'light' ? attribution : darkAttribution}
      />
    </MapContainer>
  );
};

export default MapView; 