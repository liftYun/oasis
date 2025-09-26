'use client';

import { Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  label?: string;
};

export default function LanguageToggle({ label }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const current = (sp.get('lang') === 'en' ? 'en' : 'ko') as 'ko' | 'en';
  const [lang, setLang] = useState<'ko' | 'en'>(current);

  useEffect(() => {
    setLang(current);
  }, [current]);

  const handleClick = () => {
    const next = lang === 'ko' ? 'en' : 'ko';
    setLang(next);
    router.push(`?lang=${next}`);
  };

  return (
    <div className="absolute top-5 right-6">
      <button
        type="button"
        onClick={handleClick}
        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 shadow-[0_0_10px_rgba(0,0,0,0.25)]
          ${lang === 'en' ? 'bg-gray-500' : 'bg-white'}
        `}
      >
        <span
          className={`absolute left-1 flex h-6 w-6 items-center justify-center rounded-full shadow transition-transform duration-300
            ${lang === 'en' ? 'translate-x-8 bg-white' : 'translate-x-0 bg-gray-500'}
          `}
        >
          <Globe
            className={`w-4 h-4 transition-colors duration-300
              ${lang === 'en' ? 'text-gray-500' : 'text-white'}
            `}
          />
        </span>
      </button>

      {label && (
        <div className="absolute right-0 mt-2 animate-bounce">
          <div className="relative w-max rounded-md bg-gray-600 text-white text-xs font-light px-3 py-1 shadow">
            {label}
            <div
              className="absolute -top-1 right-3 
         w-0 h-0
         border-l-4 border-r-4 border-b-4
         border-l-transparent border-r-transparent border-b-gray-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
