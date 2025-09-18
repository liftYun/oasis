import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const baseClasses =
      'flex h-12 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-base placeholder:text-gray-300 placeholder:text-sm focus-visible:outline-none focus-visible:border-1 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50';
    const combinedClasses = twMerge(baseClasses, className);

    return <input type={type} className={combinedClasses} ref={ref} {...props} />;
  }
);
Input.displayName = 'Input';

export { Input };
