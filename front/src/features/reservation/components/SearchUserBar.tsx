import { Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
  placeholder: string;
  onSubmit: (keyword: string) => void;
  onChange?: (keyword: string) => void;
}

export default function SearchUserBar({ placeholder, onSubmit, onChange }: Props) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(keyword.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    onChange?.(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full rounded-full bg-gray-100 px-4 py-2 shadow-sm"
    >
      <Search className="w-4 h-8 text-gray-500" />
      <input
        value={keyword}
        onChange={handleChange}
        type="text"
        placeholder={placeholder}
        className="ml-4 w-full bg-transparent outline-none text-sm text-gray-600 placeholder-gray-300 placeholder:text-xs"
      />
      <button type="submit" className="hidden" aria-hidden />
    </form>
  );
}
