import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [lang, setLang] = useState('ko');

  useEffect(() => {
    const storedLang = localStorage.getItem('app_lang');
    if (storedLang) setLang(storedLang);
  }, []);

  const placeholders: Record<string, string> = {
    kor: '검색을 시작해보세요!',
    eng: 'Start searching!',
  };

  return (
    <div className="flex items-center w-full max-w-md rounded-full bg-gray-100 px-4 py-2 shadow-sm">
      <Search className="w-4 h-8 text-gray-500" />
      <input
        type="text"
        placeholder={placeholders[lang] || placeholders['en']}
        className="ml-4 w-full bg-transparent outline-none text-sm text-gray-600 placeholder-gray-500"
      />
    </div>
  );
}
