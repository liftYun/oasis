import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  variant?: 'category' | 'option';
}

export function Chip({ className, selected, variant = 'option', ...props }: ChipProps) {
  const base =
    'h-8 px-4 border text-sm transition-colors whitespace-nowrap select-none ' +
    (variant === 'category' ? 'rounded-full' : 'rounded-md');
  const styles = selected
    ? variant === 'category'
      ? 'bg-primary border-primary text-white'
      : 'bg-primary/20 border-primary text-blue-500'
    : 'bg-white border-gray-200 text-gray-600 hover:bg-primary/20';
  return <button type="button" className={twMerge(base, styles, className)} {...props} />;
}
