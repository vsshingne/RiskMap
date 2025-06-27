import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, change, changeType, icon }) => {
  const changeColor = changeType === 'positive' ? 'text-green' : 'text-red';
  const arrow = changeType === 'positive' ? '↑' : '↓';

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-icon">{icon}</div>
        <span className="stat-title">{title}</span>
      </div>
      <p className="stat-value">{value}</p>
      <p className={`stat-change ${changeColor}`}>
        {arrow} {change}
      </p>
    </div>
  );
};

export default StatCard; 