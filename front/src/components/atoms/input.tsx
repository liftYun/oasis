import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const baseClasses =
      'flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base placeholder:text-gray-300 placeholder:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50';
    const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

    return <input type={type} className={combinedClasses} ref={ref} {...props} />;
  }
);
Input.displayName = 'Input';

export { Input };
