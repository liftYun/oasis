import * as React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  const baseClasses =
    'text-base font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return <label ref={ref} className={combinedClasses} {...props} />;
});
Label.displayName = 'Label';

export { Label };
