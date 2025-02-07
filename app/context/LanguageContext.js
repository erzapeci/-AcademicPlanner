import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'shqip' ? 'english' : 'shqip'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
