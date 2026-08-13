import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Global language context for the Spirit Root site.
// First visit defaults to English ('en'); the choice is persisted in localStorage.
// Switching language only re-renders — it never changes the current route,
// article, or scroll position.

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggle: () => {},
  t: (zh, en) => en,
});

const STORAGE_KEY = 'sr-lang';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'zh' || saved === 'en' ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const setLang = useCallback((l) => {
    if (l === 'zh' || l === 'en') setLangState(l);
  }, []);

  const toggle = useCallback(() => {
    setLangState((cur) => (cur === 'zh' ? 'en' : 'zh'));
  }, []);

  // Pick the string for the current language, falling back to whichever is present.
  const t = useCallback(
    (zh, en) => {
      if (lang === 'zh') return zh !== undefined && zh !== '' ? zh : en;
      return en !== undefined && en !== '' ? en : zh;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
