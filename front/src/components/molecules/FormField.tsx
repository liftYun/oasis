'use client';

import { Input, type InputProps } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps extends InputProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  children?: React.ReactNode;
}

export function FormField({ label, registration, error, children, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={props.id}>{label}</Label>
      <div className="relative">
        <Input {...registration} {...props} />
        {children}
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
