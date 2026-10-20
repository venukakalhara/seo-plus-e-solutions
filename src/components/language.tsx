'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'si';
const LanguageContext = createContext({ language: 'en' as Language, setLanguage: (_: Language) => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, updateLanguage] = useState<Language>('en');
  useEffect(() => {
    try {
      const stored = localStorage.getItem('seo-plus-language');
      if (stored === 'si' || stored === 'en') updateLanguage(stored);
    } catch { /* The switch still works when browser storage is unavailable. */ }
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  function setLanguage(value: Language) {
    updateLanguage(value);
    try { localStorage.setItem('seo-plus-language', value); } catch {}
  }
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return { ...context, t: (en: string, si: string) => context.language === 'si' ? si : en };
}

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return <div className="language-switch" role="group" aria-label="Language / භාෂාව">
    <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
    <button type="button" lang="si" aria-pressed={language === 'si'} onClick={() => setLanguage('si')}>සිංහල</button>
  </div>;
}
