import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  variant?: 'category' | 'option';
}

export function Chip({ className, selected, variant = 'option', ...props }: ChipProps) {
  const base =
    'h-9 px-3 border text-sm transition-colors whitespace-nowrap select-none ' +
    (variant === 'category' ? 'rounded-full' : 'rounded-md');
  const styles = selected
    ? variant === 'category'
      ? 'bg-blue-500 border-blue-500 text-white'
      : 'bg-blue-50 border-blue-400 text-blue-600'
    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50';
  return <button type="button" className={twMerge(base, styles, className)} {...props} />;
}
