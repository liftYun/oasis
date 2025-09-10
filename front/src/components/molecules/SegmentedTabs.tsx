import * as React from 'react';
import { Chip } from '@/components/atoms/chip';

export interface SegmentedTabsProps<T extends string> {
  tabs: { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div className={`grid grid-cols-5 gap-2 ${className ?? ''}`}>
      {tabs.map((t) => (
        <Chip
          key={t.key}
          selected={t.key === value}
          onClick={() => onChange(t.key)}
          className="w-full h-9"
          variant="category"
        >
          {t.label}
        </Chip>
      ))}
    </div>
  );
}
