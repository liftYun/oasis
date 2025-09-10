'use client';

import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { CreateStayInput } from '@/features/create-stay/schema';
import { Label } from '@/components/atoms/label';
import { Input } from '@/components/atoms/input';

interface AddressFieldProps {
  register: UseFormRegister<CreateStayInput>;
  errors: FieldErrors<CreateStayInput>;
  watch: UseFormWatch<CreateStayInput>;
  onSearchClick: () => void;
}

export function AddressField({ register, errors, watch, onSearchClick }: AddressFieldProps) {
  const postalCodeValue = watch('postalCode');
  const addressValue = watch('address');

  const readOnlyInputClassName =
    'flex h-12 w-full cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base placeholder:text-sm placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50';
  const editableInputClassName =
    'flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base placeholder:text-sm placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="flex flex-col gap-2">
      <Label>숙소 위치</Label>
      <div className="flex flex-col gap-2">
        {postalCodeValue && addressValue ? (
          <>
            <Input
              {...register('postalCode')}
              placeholder="우편번호"
              readOnly
              onClick={onSearchClick}
              className={`${readOnlyInputClassName} bg-gray-200`}
            />
            <Input
              {...register('address')}
              placeholder="주소"
              readOnly
              onClick={onSearchClick}
              className={`${readOnlyInputClassName} bg-gray-200`}
            />
          </>
        ) : (
          <>
            {/* 초기 UI */}
            <div
              onClick={onSearchClick}
              className={`${readOnlyInputClassName} text-gray-300 text-sm`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSearchClick();
                }
              }}
              aria-label="주소 검색하기"
            >
              주소 검색하기
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
          placeholder="상세 주소"
          className={editableInputClassName}
        />
        {errors.addressDetail && (
          <p className="text-sm text-red-500">{errors.addressDetail.message}</p>
        )}
      </div>
    </div>
  );
}
