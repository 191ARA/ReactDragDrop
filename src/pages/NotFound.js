import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './NotFound.css';

const NotFound = () => {
  const { theme } = useTheme();

  return (
    <div className={`not-found-container ${theme}`}>
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p className="error-message">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-return-btn">
          <span className="btn-text">Return to Home</span>
          <span className="btn-icon">⌂</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;