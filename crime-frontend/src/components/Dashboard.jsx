import React, { useState } from 'react';
import StatCard from './StatCard';
import CrimeMap from './CrimeMap';
import RecentIncidents from './RecentIncidents';
import TimeSlider from './TimeSlider';
import './Dashboard.css';

const Dashboard = () => {
    // Set a default date and hour so the map always loads
    const [dateTime, setDateTime] = useState({ date: '2024-07-24', hour: 12 });
    const [mapError, setMapError] = useState(false);

    const stats = [
        { title: 'Total Incidents', value: '1,248', change: '8.2% from last month', changeType: 'negative', icon: '🚨' },
        { title: 'Response Time', value: '8.4 min', change: '1.3 min improvement', changeType: 'positive', icon: '⏱️' },
        { title: 'Cases Solved', value: '487', change: '12.4% increase', changeType: 'positive', icon: '✅' },
        { title: 'Officers Deployed', value: '342', change: '4.1% decrease', changeType: 'negative', icon: '👮' }
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="main-title">RiskMap Dashboard</h1>
                <p className="subtitle">Interactive visualization of risk data</p>
            </div>
            
            <div className="map-container">
                {/* Show error if map fails to load data */}
                {mapError && (
                  <div style={{color: 'red', padding: '1rem', background: '#fff3f3', borderRadius: '8px', marginBottom: '1rem'}}>
                    Unable to load risk data. Please ensure the backend is running and CORS is enabled.
                  </div>
                )}
                <CrimeMap dateTime={dateTime} setMapError={setMapError} />
            </div>

            <TimeSlider onDateTimeChange={setDateTime} />

            <div className="top-row-grid">
                <div className="stats-grid">
                    {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
                </div>
                <RecentIncidents />
            </div>
        </div>
    );
}

export default Dashboard; 