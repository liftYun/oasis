'use client';

import { useWatch, type Control } from 'react-hook-form';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { FormField } from '@/components/molecules/FormField';

interface PriceFieldProps {
  control: Control<any>;
  name: string; // e.g. 'price'
  registration: UseFormRegisterReturn;
  error?: FieldError;
  id?: string;
  placeholder?: string;
}

export function PriceField({
  control,
  name,
  registration,
  error,
  id = 'price',
  placeholder = '$ 가격을 적어주세요.',
}: PriceFieldProps) {
  const value = useWatch({ control, name });
  const showCurrency = value !== undefined && value !== null && value !== ('' as any);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;
    // 허용 키: 편집/이동/제어 조합
    const controlKeys = [
      'Backspace',
      'Tab',
      'Enter',
      'Escape',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'Delete',
    ];
    if (controlKeys.includes(e.key)) return;
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;

    // 소수점은 1개만 허용
    if (e.key === '.') {
      if (target.value.includes('.')) {
        e.preventDefault();
      }
      return;
    }

    // 숫자 외 입력 차단
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const sanitize = (raw: string) => {
    const filtered = raw.replace(/[^\d.]/g, '');
    const parts = filtered.split('.');
    const intPart = parts[0];
    if (!intPart) return '';
    const fracPart = parts.slice(1).join('').slice(0, 2);
    return parts.length > 1 ? `${intPart}.${fracPart}` : intPart;
  };

  const handleInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget;
    const next = sanitize(target.value);
    if (next !== target.value) {
      target.value = next;
    }
  };

  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const target = e.currentTarget;
    const next = sanitize(text);
    document.execCommand('insertText', false, next);
  };

  return (
    <FormField
      label="가격"
      registration={registration}
      id={id}
      placeholder={placeholder}
      error={error}
      inputMode="decimal"
      type="text"
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      className={showCurrency ? 'pl-8' : undefined}
    >
      {showCurrency && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          $
        </span>
      )}
    </FormField>
  );
}
