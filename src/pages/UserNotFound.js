import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './UserNotFound.css';

const UserNotFound = () => {
  const { theme } = useTheme();

  return (
    <div className={`error-container ${theme}`}>
      <div className="error-content">
        <h2>User Not Found ❌</h2>
        <p>The user with this email does not exist.</p>
        <Link to="/login" className="back-to-login-btn">
          <span className="btn-text">Back to Login</span>
          <span className="btn-icon">→</span>
        </Link>
      </div>
    </div>
  );
};

export default UserNotFound;