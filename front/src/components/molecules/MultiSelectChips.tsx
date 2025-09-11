import * as React from 'react';
import { Chip } from '@/components/atoms/chip';

interface OptionItem {
  key: string;
  label: string;
}

interface MultiSelectChipsProps {
  options: OptionItem[];
  values: string[]; // 선택된 option key 들
  onChange: (values: string[]) => void;
  className?: string;
}

export function MultiSelectChips({ options, values, onChange, className }: MultiSelectChipsProps) {
  const toggle = (key: string) => {
    const exists = values.includes(key);
    onChange(exists ? values.filter((v) => v !== key) : [...values, key]);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      {options.map((opt) => (
        <Chip
          key={opt.key}
          selected={values.includes(opt.key)}
          onClick={() => toggle(opt.key)}
          className="h-9 px-3"
          variant="option"
        >
          {opt.label}
        </Chip>
      ))}
    </div>
  );
}
