import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Home.css';

const Home = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`home ${theme}`}>
      <h1>{t('welcomeTitle')}</h1>
      <p>{t('welcomeDescription')}</p>
    </div>
  );
};

export default Home;