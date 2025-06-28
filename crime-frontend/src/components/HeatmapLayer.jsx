import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ points, options = {} }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    // Convert points to [lat, lng, intensity]
    const heatData = points.map(pt => [pt.lat, pt.lng, pt.intensity || 1]);

    // Create heat layer
    const heatLayer = window.L.heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.25: '#28a745',
        0.5: '#ffc107',
        1.0: '#dc3545'
      },
      ...options
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);

  return null;
};

export default HeatmapLayer; 