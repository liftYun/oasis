'use client';

import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import type { CreateStayInput } from '@/features/create-stay/schema';
import { Label } from '@/components/atoms/label';
import { Input } from '@/components/atoms/input';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

interface AddressFieldProps {
  register: UseFormRegister<CreateStayInput>;
  errors: FieldErrors<CreateStayInput>;
  watch: UseFormWatch<CreateStayInput>;
  onSearchClick: () => void;
}

export function AddressField({ register, errors, watch, onSearchClick }: AddressFieldProps) {
  const { lang } = useLanguage();
  const t = createStayMessages[lang];
  const postalCodeValue = watch('postalCode');
  const addressValue = watch('address');

  const variants = {
    readOnly: 'cursor-pointer',
    readOnlyFilled: 'cursor-pointer bg-gray-100 text-gray-400',
    editable: '',
  } as const;

  return (
    <div className="flex flex-col gap-2">
      <Label>{t.form.addressLabel}</Label>
      <div className="flex flex-col gap-2">
        {postalCodeValue && addressValue ? (
          <>
            <Input
              {...register('postalCode')}
              placeholder={t.form.addressPostalCodePlaceholder}
              readOnly
              onClick={onSearchClick}
              className={twMerge(variants.readOnlyFilled)}
            />
            <Input
              {...register('address')}
              placeholder={t.form.addressAddressPlaceholder}
              readOnly
              onClick={onSearchClick}
              className={twMerge(variants.readOnlyFilled)}
            />
          </>
        ) : (
          <>
            <div
              onClick={onSearchClick}
              className={twMerge(
                'flex items-center h-12 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-sm placeholder:text-gray-300 focus-visible:outline-none focus-visible:border-1 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
                variants.readOnly,
                'text-gray-300'
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSearchClick();
                }
              }}
              aria-label={t.form.addressSearchAria}
            >
              {t.form.addressSearchPlaceholder}
            </div>
          </>
        )}

        {(errors.postalCode || errors.address) && (
          <p className="text-sm text-red-500">
            {errors.address?.message || errors.postalCode?.message}
          </p>
        )}
        <Input
          {...register('addressDetail')}
          placeholder={t.form.addressDetailPlaceholder}
          className={twMerge(variants.editable)}
        />
        {errors.addressDetail && (
          <p className="text-sm text-red-500">{errors.addressDetail.message}</p>
        )}
      </div>
    </div>
  );
}
