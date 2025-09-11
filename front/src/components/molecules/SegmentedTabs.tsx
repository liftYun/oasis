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
    <div className={`overflow-x-auto no-scrollbar ${className ?? ''}`}>
      <div className="inline-flex gap-2 min-w-full">
        {tabs.map((t) => (
          <Chip
            key={t.key}
            selected={t.key === value}
            onClick={() => onChange(t.key)}
            className="h-9 px-3 max-w-[140px] whitespace-nowrap truncate"
            variant="category"
          >
            {t.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
