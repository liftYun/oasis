import { type ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'blue' | 'google';
  fullWidth?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-md ' +
  'h-[50px] text-sm transition-colors duration-200' +
  'disabled:opacity-30 disabled:pointer-events-none select-none';

const variants = {
  default: 'bg-gray-500 text-white hover:bg-gray-600',
  blue: 'bg-primary text-white hover:bg-blue-500',
  google: 'bg-gray-100 text-gray-600 hover:bg-gray-200 h-[55px]',
};

export function Button({
  className,
  variant = 'default',
  fullWidth = true,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(baseStyles, variants[variant], fullWidth && 'w-full', className)}
      {...props}
    />
  );
}
