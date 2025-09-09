'use client';

import type { UseFormReturn } from 'react-hook-form';
import { ACCEPTED_IMAGE_TYPES, type CreateStayInput } from '@/features/create-stay/schema';
import { FormField } from '@/components/molecules/FormField';
import { ImageUploader } from '@/components/molecules/ImageUploader';
import { Button } from '@/components/atoms/button';

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

  const titleValue = watch('title', '');

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

      <div className="flex flex-col gap-2">
        <label className="text-base font-medium text-sm">숙소 위치</label>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            id="address"
            placeholder="주소 검색하기"
            className="flex h-12 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-base placeholder:text-gray-300 placeholder:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            value={watch('address') || ''}
            readOnly
            onClick={openAddressModal}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}

          <input
            {...register('addressDetail')}
            id="addressDetail"
            placeholder="상세 주소"
            className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base placeholder:text-gray-300 placeholder:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.addressDetail && (
            <p className="text-sm text-red-500">{errors.addressDetail.message}</p>
          )}
        </div>
      </div>
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
          className="w-full bg-gray-200 text-gray-600 font-bold hover:bg-gray-300 active:bg-gray-300 mb-10"
        >
          {isSubmitting ? '처리 중...' : '다음'}
        </Button>
      </div>
    </form>
  );
}
