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
  onReorder?: (newOrder: string[]) => void;
}

export function StayForm({
  form,
  handleSubmit,
  openAddressModal,
  isSubmitting,
  imagePreviews,
  onRemoveImage,
  onReorder,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormField
        label={t.form.titleLabel}
        registration={register('title', {
          required: '숙소 이름을 입력해주세요.',
        })}
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
        error={errors.price}
      />

      <ImageUploader
        registration={register('images', {
          validate: (value) => (value && value.length > 0) || '최소 1장의 이미지를 업로드해주세요.',
        })}
        error={errors.images}
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        imagePreviews={imagePreviews}
        onRemoveImage={onRemoveImage}
        onReorder={(newOrder) => form.setValue('images', newOrder)}
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
