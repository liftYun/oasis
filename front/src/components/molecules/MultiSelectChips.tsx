import * as React from 'react';
import { Chip } from '@/components/atoms/chip';

interface MultiSelectChipsProps {
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function MultiSelectChips({ options, values, onChange, className }: MultiSelectChipsProps) {
  const toggle = (opt: string) => {
    const exists = values.includes(opt);
    onChange(exists ? values.filter((v) => v !== opt) : [...values, opt]);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      {options.map((opt) => (
        <Chip
          key={opt}
          selected={values.includes(opt)}
          onClick={() => toggle(opt)}
          className="h-9 px-3"
          variant="option"
        >
          {opt}
        </Chip>
      ))}
    </div>
  );
}
