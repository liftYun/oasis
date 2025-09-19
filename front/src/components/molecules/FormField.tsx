'use client';

import { useEffect } from 'react';
import { Input, type InputProps } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import type { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface FormFieldProps extends InputProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  children?: React.ReactNode;
}

export function FormField({ label, registration, error, children, ...props }: FormFieldProps) {
  const inputId = props.id ?? registration.name;

  useEffect(() => {
    if (error?.message) {
      toast.error(error.message);
    }
  }, [error?.message]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative">
        <Input id={inputId} {...props} {...registration} />
        {children}
      </div>
    </div>
  );
}
