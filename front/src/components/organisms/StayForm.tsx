'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { ACCEPTED_IMAGE_TYPES, type CreateStayInput } from '@/features/create-stay/schema';
import { FormField } from '@/components/molecules/FormField';
import { ImageUploader } from '@/components/molecules/ImageUploader';
import { Button } from '@/components/atoms/Button';
import { AddressField } from '@/components/molecules/AddressField';
import { PriceField } from '@/components/molecules/PriceField';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

interface StayFormProps {
  form: UseFormReturn<CreateStayInput>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  openAddressModal: () => void;
  isSubmitting?: boolean;
  imagePreviews: string[];
  onRemoveImage: (index: number) => void;
}

export function StayForm({
  form,
  handleSubmit,
  openAddressModal,
  isSubmitting,
  imagePreviews,
  onRemoveImage,
}: StayFormProps) {
  const { lang } = useLanguage();
  const t = createStayMessages[lang];
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = form;

  const titleValue = useWatch({ control: form.control, name: 'title' }) ?? '';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-grow gap-6">
      <FormField
        label={t.form.titleLabel}
        registration={register('title')}
        id="title"
        placeholder={t.form.titlePlaceholder}
        maxLength={20}
        error={errors.title}
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
        onSearchClick={openAddressModal}
      />

      <PriceField
        control={form.control}
        name="price"
        registration={register('price', {
          setValueAs: (raw) => {
            if (raw === '' || raw == null) return undefined;
            const str: string = String(raw);
            // 09.00 -> 9 또는 9.00: 숫자 이외 제거 후 앞자리 0 제거, 소수점 2자리 보존
            const match = str.match(/^(\d+)(?:\.(\d{1,2}))?$/);
            if (!match) return Number(str); // 폴백
            const intPart = match[1].replace(/^0+(\d)/, '$1');
            const frac = match[2] ?? '';
            const normalized = frac ? `${intPart}.${frac}` : intPart;
            const num = Number(normalized);
            return num;
          },
        })}
        error={errors.price}
      />

      {/* ImageUploader는 hook과 연결될 예정 */}
      <ImageUploader
        registration={register('images')}
        error={errors.images}
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        imagePreviews={imagePreviews}
        onRemoveImage={onRemoveImage}
      />

      <div className="mt-auto pt-4">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full font-bold mb-10 ${
            isValid && !isSubmitting
              ? 'bg-black text-white hover:bg-black active:bg-black'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300 active:bg-gray-300 disabled:opacity-100'
          }`}
        >
          {isSubmitting ? t.common.processing : t.common.next}
        </Button>
      </div>
    </form>
  );
}
