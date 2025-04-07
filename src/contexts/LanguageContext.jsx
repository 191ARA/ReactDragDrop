import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    // Общие переводы
    home: 'Home',
    about: 'About',
    users: 'Users',
    login: 'Login',
    logout: 'Logout',
    welcome: 'Welcome',
    role: 'Role',
    location: 'Location',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    userNotFound: 'User Not Found',
    authFailed: 'Authentication Failed',
    notFound: 'Page Not Found',
    projects: 'Projects',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    noAccount: "Don't have an account?",
    emailPlaceholder: 'Enter your email',
    
    // About page
    aboutTitle: 'About React Router',
    aboutDescription: 'This project is dedicated to learning React Router, navigation, and state management using hooks. We are building a multi-page application that includes a home page, an about page, a user list, user details, and a contact form.',
    projectFeatures: 'Project Features',
    feature1Title: 'Page Creation',
    feature1Desc: 'Home, About, Users, User Details, Contact, 404.',
    feature2Title: 'Using React Router',
    feature2Desc: 'Navigation between pages using React Router.',
    feature3Title: 'Working with API',
    feature3Desc: 'Fetching user data through an API.',
    feature4Title: 'State Management',
    feature4Desc: 'Using `useState`, `useEffect`, and `useReducer` hooks.',
    feature5Title: 'Error Handling',
    feature5Desc: 'Creating a 404 page to handle non-existent routes.',
    feature6Title: 'Styling and Responsive Design',
    feature6Desc: 'Applying styles and responsive design to enhance user experience.',
    
    // Home page
    welcomeTitle: 'Welcome to React Router',
    welcomeDescription: 'The routes project is a small web application developed using the React library and routing via React Router. The main goal of the project is to demonstrate skills in navigating between pages, managing application status, and interacting with the API.',
    
    // Login page
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Sign in to your account to continue',
    backToLogin: 'Back to Login',
    
    // Dashboard
    yourProjects: 'Your Projects',
    returnToHome: 'Return to Home',
    status: 'Status',
    planned: 'Planned',
    inProgress: 'In Progress',
    completed: 'Completed',
    active: 'Active',
    ongoing: 'Ongoing',
    
    // User details
    contactInfo: 'Contact Information',
    phone: 'Phone',
    address: 'Address'
  },
  ru: {
    // Общие переводы
    home: 'Главная',
    about: 'О нас',
    users: 'Пользователи',
    login: 'Вход',
    logout: 'Выход',
    welcome: 'Добро пожаловать',
    role: 'Роль',
    location: 'Местоположение',
    darkMode: 'Тёмная тема',
    lightMode: 'Светлая тема',
    userNotFound: 'Пользователь не найден',
    authFailed: 'Ошибка аутентификации',
    notFound: 'Страница не найдена',
    projects: 'Проекты',
    signIn: 'Войти',
    signUp: 'Зарегистрироваться',
    noAccount: 'Нет аккаунта?',
    emailPlaceholder: 'Введите ваш email',
    backToLogin: 'Вернуться к входу',
    
    // About page
    aboutTitle: 'О React Router',
    aboutDescription: 'Этот проект посвящен изучению React Router, навигации и управлению состоянием с использованием хуков. Мы создаем многостраничное приложение, которое включает главную страницу, страницу "О нас", список пользователей, детали пользователя и контактную форму.',
    projectFeatures: 'Особенности проекта',
    feature1Title: 'Создание страниц',
    feature1Desc: 'Главная, О нас, Пользователи, Детали пользователя, Контакты, 404.',
    feature2Title: 'Использование React Router',
    feature2Desc: 'Навигация между страницами с помощью React Router.',
    feature3Title: 'Работа с API',
    feature3Desc: 'Получение данных пользователей через API.',
    feature4Title: 'Управление состоянием',
    feature4Desc: 'Использование хуков `useState`, `useEffect` и `useReducer`.',
    feature5Title: 'Обработка ошибок',
    feature5Desc: 'Создание страницы 404 для обработки несуществующих маршрутов.',
    feature6Title: 'Стили и адаптивный дизайн',
    feature6Desc: 'Применение стилей и адаптивного дизайна для улучшения пользовательского опыта.',
    
    // Home page
    welcomeTitle: 'Добро пожаловать в React Router',
    welcomeDescription: 'Проект Routes - это небольшое веб-приложение, разработанное с использованием библиотеки React и маршрутизации через React Router. Основная цель проекта - продемонстрировать навыки навигации между страницами, управления состоянием приложения и взаимодействия с API.',
    
    // Login page
    loginTitle: 'С возвращением',
    loginSubtitle: 'Войдите в свой аккаунт, чтобы продолжить',
    
    // Dashboard
    yourProjects: 'Ваши проекты',
    returnToHome: 'Вернуться на главную',
    status: 'Статус',
    planned: 'Запланировано',
    inProgress: 'В процессе',
    completed: 'Завершено',
    active: 'Активно',
    ongoing: 'В работе',
    
    // User details
    contactInfo: 'Контактная информация',
    phone: 'Телефон',
    address: 'Адрес'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language; // Устанавливаем язык HTML
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ru' : 'en');
  };

  const t = (key, params = {}) => {
    let translation = translations[language][key] || key;
    
    // Замена параметров в строке (если есть)
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);