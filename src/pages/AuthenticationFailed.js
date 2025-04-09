import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './AuthenticationFailed.css';

const AuthenticationFailed = () => {
  const { theme } = useTheme();

  return (
    <div className={`error-container ${theme}`}>
      <div className="error-content">
        <h2>Authentication Failed ⚠️</h2>
        <p>Your account is not authenticated.</p>
        <Link to="/login" className="back-to-login-btn">
          <span className="btn-text">Back to Login</span>
          <span className="btn-icon">→</span>
        </Link>
      </div>
    </div>
  );
};

export default AuthenticationFailed;