import React from 'react';
import './Card.css';
import './RecentIncidents.css';

const RecentIncidents = () => {
    const incidents = [
        { type: 'Assault', title: 'Downtown Altercation', time: '2 hrs ago', details: 'Verbal dispute escalated to physical altercation...' },
        { type: 'Theft', title: 'Vehicle Break-in', time: '5 hrs ago', details: 'Multiple vehicles targeted in parking structure...' },
        { type: 'Vandalism', title: 'Property Damage', time: 'Yesterday', details: 'Graffiti reported on public facilities...' },
        { type: 'Theft', title: 'Retail Shoplifting', time: 'Yesterday', details: 'Suspect detained by security...' },
    ];

    return (
        <div className="card">
            <h2 className="card-title">Recent Incidents</h2>
            <ul className="incidents-list">
                {incidents.map((incident, index) => (
                    <li key={index} className="incident-item">
                        <div className={`incident-type ${incident.type.toLowerCase()}`}>{incident.type}</div>
                        <h3 className="incident-title">{incident.title}</h3>
                        <p className="incident-details">{incident.details}</p>
                        <span className="incident-time">{incident.time}</span>
                    </li>
                ))}
            </ul>
            <button className="view-all-btn">View All Incidents</button>
        </div>
    );
};

export default RecentIncidents; 