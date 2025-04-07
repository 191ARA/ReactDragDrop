import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, toggleLanguage, language } = useLanguage();

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-brand">React App</div>
      
      <ul className="navbar-links">
        <li><Link to="/" className="nav-link">{t('home')}</Link></li>
        <li><Link to="/about" className="nav-link">{t('about')}</Link></li>

        <li><Link to="/login" className="nav-link">{t('login')}</Link></li>
      </ul>

      <div className="controls">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <button 
          onClick={toggleLanguage}
          className="language-toggle"
          aria-label={language === 'en' ? 'Switch to Russian' : 'Переключить на английский'}
        >
          {language === 'en' ? 'RU' : 'EN'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;