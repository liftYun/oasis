'use client';

import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { FormField } from '@/components/molecules/FormField';
import { ImageUploader } from '@/components/molecules/ImageUploader';
import { Button } from '@/components/atoms/Button';
import { AddressField } from '@/components/molecules/AddressField';
import { PriceField } from '@/components/molecules/PriceField';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import { useDaumPostcode } from '@/features/create-stay/hooks/useDaumPostCode';

interface StayFormProps {
  form: UseFormReturn<any>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting?: boolean;
}

export function StayForm({ form, handleSubmit, isSubmitting }: StayFormProps) {
  const { lang } = useLanguage();
  const t = createStayMessages[lang];
  const {
    register,
    setValue,
    watch,
    formState: { errors, isValid },
  } = form;

  const titleValue = useWatch({ control: form.control, name: 'title' }) ?? '';
  const openPostcode = useDaumPostcode();

  const handleSearchClick = () => {
    openPostcode((data) => {
      const selected = {
        subRegionId: Number(data.bcode) || 0,
        address: data.roadAddress || data.address,
        addressEng: data.roadAddressEnglish || data.addressEnglish || '',
        addressDetail: '',
        addressDetailEng: '',
        postalCode: data.zonecode,
      };

      setValue('address', selected.address, { shouldValidate: true });
      setValue('addressEng', selected.addressEng, { shouldValidate: true });
      setValue('postalCode', selected.postalCode, { shouldValidate: true });
      setValue('subRegionId', selected.subRegionId, { shouldValidate: true });
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-[calc(100vh-200px)] flex flex-col gap-6 w-full justify-center overflow-y-auto"
    >
      <FormField
        label={t.form.titleLabel}
        registration={register('title', {
          required: '숙소 이름을 입력해주세요.',
        })}
        id="title"
        placeholder={t.form.titlePlaceholder}
        maxLength={20}
        className="pr-12"
      >
        <p className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300">
          <span className="text-xs text-primary">{titleValue.length}</span>/20
        </p>
      </FormField>

      <AddressField
        register={register}
        errors={errors}
        watch={watch}
        onSearchClick={handleSearchClick}
      />

      <PriceField
        control={form.control}
        name="price"
        registration={register('price', {
          required: '가격을 입력해주세요.',
          setValueAs: (raw) => {
            if (raw === '' || raw == null) return undefined;
            const str: string = String(raw);
            const match = str.match(/^(\d+)(?:\.(\d{1,2}))?$/);
            if (!match) return Number(str);
            const intPart = match[1].replace(/^0+(\d)/, '$1');
            const frac = match[2] ?? '';
            const normalized = frac ? `${intPart}.${frac}` : intPart;
            return Number(normalized);
          },
        })}
      />

      <ImageUploader
        onChange={(imageRequestList) => {
          // imageRequestList = [{ key: string, sortOrder: number }]
          form.setValue('imageRequestList', imageRequestList, { shouldValidate: true });
        }}
      />

      <div className="mt-auto mb-6">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          variant={isValid && !isSubmitting ? 'blue' : 'blueLight'}
        >
          {isSubmitting ? t.common.processing : t.common.next}
        </Button>
      </div>
    </form>
  );
}
