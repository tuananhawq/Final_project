import { createContext, useContext, useState, useEffect } from "react";
import viTranslations from "../locales/vi.json";
import enTranslations from "../locales/en.json";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const translations = {
  vi: viTranslations,
  en: enTranslations,
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved || "vi";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "vi" ? "en" : "vi"));
  };

  const t = (key, params = {}) => {
    const keys = key.split(".");
    let text = translations[language];
    
    for (const k of keys) {
      text = text?.[k];
    }
    
    if (!text) {
      return key; // Return key if translation not found
    }

    // Replace parameters
    Object.keys(params).forEach((param) => {
      text = text.replace(`{{${param}}}`, params[param]);
    });

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
