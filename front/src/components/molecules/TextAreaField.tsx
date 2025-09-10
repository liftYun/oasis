'use client';

import { Label } from '@/components/atoms/label';
import { Textarea } from '@/components/atoms/textarea';

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id?: string;
  length: number;
  maxLength: number;
}

export function TextAreaField({
  label,
  id,
  length,
  maxLength,
  className,
  ...props
}: TextAreaFieldProps) {
  const inputId = id ?? (props.name as string | undefined);
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative">
        <Textarea id={inputId} className={className} autoResize maxHeightPx={400} {...props} />
      </div>
      <div className="-mt-1 text-right text-xs text-gray-300">
        <span className={`${length === 0 ? '' : 'text-primary'}`}>{length}</span>/{maxLength}
      </div>
    </div>
  );
}
