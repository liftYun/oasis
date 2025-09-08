'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lang } from '@/features/language';
const STORAGE_KEY = 'app_lang';

export function useLanguage(defaultLang: Lang = 'ko') {
  const [lang, setLang] = useState<Lang>(defaultLang);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored) {
      setLang(stored);
    }
  }, []);

  const changeLang = useCallback((next: Lang) => {
    setLang(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { lang, changeLang };
}
