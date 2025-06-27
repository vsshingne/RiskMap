import React, { useState, useEffect } from 'react';
import './TimeSlider.css';

const TimeSlider = ({ onDateTimeChange }) => {
  const [date, setDate] = useState('2024-07-24');
  // State now tracks total minutes from midnight (0-1439)
  const [totalMinutes, setTotalMinutes] = useState(12 * 60); // Default to noon

  useEffect(() => {
    if (onDateTimeChange) {
        onDateTimeChange({
            date: date,
            hour: Math.floor(totalMinutes / 60)
        });
    }
  }, [date, totalMinutes, onDateTimeChange]);

  // Converts total minutes to a 12-hour format string for display
  const formatDisplayTime = (minutes) => {
    let h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  // Converts total minutes to HH:MM format for the time input
  const minutesToHHMM = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Handles changes from the time input
  const handleTimeInputChange = (e) => {
    const [h, m] = e.target.value.split(':');
    setTotalMinutes(parseInt(h, 10) * 60 + parseInt(m, 10));
  };

  return (
    <div className="time-slider-container">
      <div className="date-picker-wrapper">
        <label htmlFor="date-picker">Date</label>
        <input 
          type="date" 
          id="date-picker"
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="date-picker"
        />
      </div>
      <div className="time-control-wrapper">
        <div className="time-label-group">
            <label htmlFor="hour-slider">Time</label>
            <input 
              type="time" 
              className="time-input"
              value={minutesToHHMM(totalMinutes)}
              onChange={handleTimeInputChange}
            />
        </div>
        <input
          type="range"
          id="hour-slider"
          min="0"
          max="1439" // 24 * 60 - 1
          value={totalMinutes}
          onChange={(e) => setTotalMinutes(parseInt(e.target.value, 10))}
          className="slider"
        />
      </div>
    </div>
  );
};

export default TimeSlider; 