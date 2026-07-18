import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './i18n';
import { base44 } from '@/api/base44Client';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lejju_lang') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('lejju_lang', lang);
  }, [lang]);

  const t = (path) => {
    const keys = path.split('.');
    let val = translations[lang];
    for (const k of keys) {
      val = val?.[k];
    }
    return val ?? path;
  };

  const toggleLang = () => setLang((p) => (p === 'es' ? 'en' : 'es'));

  const persistLang = async (newLang) => {
    setLang(newLang);
    try {
      const user = await base44.auth.me();
      if (user) {
        await base44.auth.updateMe({ language: newLang });
      }
    } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: persistLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) return { lang: 'es', t: (p) => p, toggleLang: () => {}, setLang: () => {} };
  return ctx;
}