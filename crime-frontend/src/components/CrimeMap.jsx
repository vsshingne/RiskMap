import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../context/ThemeContext';
import './Card.css';

const DEFAULT_POSITION = [51.505, -0.09];
const DEFAULT_ZOOM = 12;

function expandPointCluster(point) {
    let radiusMeters, numPoints, intensity;
    if (point.danger === 2) { // Red, High Danger
        radiusMeters = 400;
        numPoints = 16;
        intensity = 2.0;
    } else if (point.danger === 1) { // Yellow, Medium Danger
        radiusMeters = 200;
        numPoints = 12;
        intensity = 1.0;
    } else { // Green, Low Danger
        radiusMeters = 100;
        numPoints = 8;
        intensity = 0.5;
    }
    const cluster = [];
    for (let i = 0; i < numPoints; i++) {
        const angle = (2 * Math.PI * i) / numPoints;
        const dx = Math.cos(angle) * radiusMeters / 111320;
        const dy = Math.sin(angle) * radiusMeters / 111320;
        cluster.push({
            lat: point.lat + dy,
            lng: point.lng + dx,
            intensity,
            danger: point.danger
        });
    }
    cluster.push({ ...point, intensity }); // include the center point
    return cluster;
}

const HeatmapFetcher = ({ dateTime, setHeatmapPoints, setLoading, setMapError }) => {
    const map = useMap();

    const fetchHeatmapData = useCallback(async () => {
        setLoading(true);
        try {
            const bounds = map.getBounds();
            const { hour, date } = dateTime;
            const dayOfWeek = new Date(date).getDay();

            const params = new URLSearchParams({
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest(),
                hour: hour,
                day: dayOfWeek
            });

            const res = await axios.get(`http://localhost:5000/heatmap?${params.toString()}`);
            const expandedPoints = res.data.flatMap(pt => expandPointCluster(pt));
            setHeatmapPoints(expandedPoints);
            if (setMapError) setMapError(false);
        } catch (err) {
            console.error("Failed to fetch heatmap data:", err);
            if (setMapError) setMapError(true);
        }
        setLoading(false);
    }, [map, dateTime, setLoading, setHeatmapPoints, setMapError]);

    useEffect(() => {
        fetchHeatmapData(); // Initial fetch
    }, [fetchHeatmapData]);

    useMapEvents({
        moveend: () => fetchHeatmapData(),
        zoomend: () => fetchHeatmapData()
    });

    return null; // This component does not render anything
};

const CrimeMap = ({ dateTime, setMapError }) => {
    const { theme } = useTheme();
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [heatmapPoints, setHeatmapPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapKey, setMapKey] = useState(0);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search) return;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`;
        const res = await fetch(url);
        const data = await res.json();
        setSearchResults(data);
    };

    const handleSelectResult = (result) => {
        setSelectedPosition([parseFloat(result.lat), parseFloat(result.lon)]);
        setSearchResults([]);
        setMapKey(prev => prev + 1);
    };

    return (
        <div className="card crime-map-card">
            <div className="card-header">
                <h2 className="card-title">Risk Heatmap</h2>
                {loading && <div className="loader"></div>}
            </div>
            <form onSubmit={handleSearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search for a place..."
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '0.5rem 1rem' }}>Search</button>
            </form>
            {searchResults.length > 0 && (
                <ul style={{ background: '#222', color: '#fff', borderRadius: '4px', padding: '0.5rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
                    {searchResults.map((r, i) => (
                        <li key={i} style={{ cursor: 'pointer', padding: '0.25rem 0' }} onClick={() => handleSelectResult(r)}>
                            {r.display_name}
                        </li>
                    ))}
                </ul>
            )}
            <div className="map-view-container">
                <MapContainer
                    center={selectedPosition || DEFAULT_POSITION}
                    zoom={DEFAULT_ZOOM}
                    style={{ height: '100%', width: '100%' }}
                    key={theme + '-' + mapKey}
                >
                    <TileLayer
                        url={theme === 'light' ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' : `https://api.maptiler.com/maps/streets-dark/{z}/{x}/{y}.png?key=2TSbovEWsrLQVKABFfa3`}
                        attribution={theme === 'light' ? '&copy; CARTO' : '&copy; MapTiler'}
                    />
                    <HeatmapFetcher 
                        dateTime={dateTime}
                        setHeatmapPoints={setHeatmapPoints}
                        setLoading={setLoading}
                        setMapError={setMapError}
                    />
                    {heatmapPoints.length > 0 && (
                        <HeatmapLayer
                            fitBoundsOnLoad={false}
                            fitBoundsOnUpdate={false}
                            points={heatmapPoints}
                            longitudeExtractor={m => m.lng}
                            latitudeExtractor={m => m.lat}
                            intensityExtractor={m => m.intensity}
                            max={2}
                            radius={60}
                            blur={60}
                            gradient={{
                                0.25: '#28a745',
                                0.5: '#ffc107',
                                1.0: '#dc3545'
                            }}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default CrimeMap; 