import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Card.css';

const Card = ({ title, description }) => {
  const { theme } = useTheme();

  return (
    <div className={`card ${theme}`}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Card;