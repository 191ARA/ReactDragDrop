import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import usersData from '../data/users.json';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    
    
    const user = usersData.find(user => user.email === email);
    
    if (!user) {
      navigate('/user-not-found');
      return;
    }
    
    if (!user.authenticated) {
      navigate('/authentication-failed');
      return;
    }
    
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/dashboard');
  };

  return (
    <div className={`login-container ${theme}`}>
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span>⚛️</span>
          </div>
          <h1>{t('loginTitle')}</h1>
          <p>{t('loginSubtitle')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input email-input"
              
              
            />
            <span className="input-icon">✉️</span>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>{t('signIn')}</span>
                <span className="arrow">→</span>
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>{t('noAccount')} <a href="/register">{t('signUp')}</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;