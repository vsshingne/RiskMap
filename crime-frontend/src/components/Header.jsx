import React from 'react';
import './Header.css';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-wrapper">
        <div className="logo">
          <span role="img" aria-label="shield">🛡️</span> RiskMap
        </div>
        <nav>
          <a href="#dashboard" className="active">Dashboard</a>
          <a href="#reports">Reports</a>
          <a href="#analytics">Analytics</a>
          <a href="#about">About</a>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;
