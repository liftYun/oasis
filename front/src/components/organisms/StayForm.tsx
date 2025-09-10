'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { ACCEPTED_IMAGE_TYPES, type CreateStayInput } from '@/features/create-stay/schema';
import { FormField } from '@/components/molecules/FormField';
import { ImageUploader } from '@/components/molecules/ImageUploader';
import { Button } from '@/components/atoms/Button';
import { AddressField } from '@/components/molecules/AddressField';

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
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = form;

  const titleValue = useWatch({ control: form.control, name: 'title' }) ?? '';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-grow gap-6">
      <FormField
        label="숙소 이름"
        registration={register('title')}
        id="title"
        placeholder="숙소 이름을 적어주세요."
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

      <FormField
        label="가격"
        registration={register('price', {
          setValueAs: (value) => (value === '' ? undefined : Number(value)),
        })}
        id="price"
        placeholder="$ 가격을 적어주세요."
        error={errors.price}
        inputMode="numeric"
        type="number"
        step="0.01"
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
          {isSubmitting ? '처리 중...' : '다음'}
        </Button>
      </div>
    </form>
  );
}
