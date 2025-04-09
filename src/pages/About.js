import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import Card from './Card';
import './About.css';

const About = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const features = [
    {
      title: t('feature1Title'),
      description: t('feature1Desc'),
    },
    {
      title: t('feature2Title'),
      description: t('feature2Desc'),
    },
    {
      title: t('feature3Title'),
      description: t('feature3Desc'),
    },
    {
      title: t('feature4Title'),
      description: t('feature4Desc'),
    },
    {
      title: t('feature5Title'),
      description: t('feature5Desc'),
    },
    {
      title: t('feature6Title'),
      description: t('feature6Desc'),
    },
  ];

  return (
    <div className={`about ${theme}`}>
      <div className="text-section">
        <h1>{t('aboutTitle')}</h1>
        <p>{t('aboutDescription')}</p>
      </div>

      <div className="features-section">
        <h2>{t('projectFeatures')}</h2>
        <div className="cards-container">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;