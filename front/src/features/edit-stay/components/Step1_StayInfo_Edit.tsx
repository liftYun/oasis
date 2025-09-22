'use client';

import { useEffect } from 'react';
import { useStayStores } from '@/stores/useStayEditStroes';
import { StayForm_Edit } from '@/features/edit-stay/components/StayForm_Edit';
import { useCreateStayForm } from '@/features/create-stay/hooks/useCreateStayForm';
import type { CreateStayInput } from '@/features/create-stay/schema';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import BackHeader from '@/components/molecules/BackHeader';

type ExtendedCreateStayInput = CreateStayInput & {
  imageRequestList: { key: string; sortOrder: number }[];
};

export function Step1_StayInfo_Edit() {
  const store = useStayStores();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];

  const handleNextStep = async (data: ExtendedCreateStayInput) => {
    const validKeys = [
      'subRegionId',
      'title',
      'titleEng',
      'description',
      'descriptionEng',
      'price',
      'address',
      'addressEng',
      'addressDetail',
      'addressDetailEng',
      'postalCode',
      'maxGuest',
      'facilities',
      'blockRangeList',
      'imageRequestList',
    ] as const;

    type ValidKey = (typeof validKeys)[number];

    Object.entries(data).forEach(([key, value]) => {
      if (validKeys.includes(key as ValidKey)) {
        store.setField(key as ValidKey, value as any);
      }
    });

    store.setStep(2);
  };

  const { form, handleSubmit } = useCreateStayForm({
    onFormSubmit: handleNextStep,
    defaultValues: {
      title: store.title,
      titleEng: store.titleEng,
      description: store.description,
      descriptionEng: store.descriptionEng,
      address: store.address,
      addressEng: store.addressEng,
      addressDetail: store.addressDetail,
      addressDetailEng: store.addressDetailEng,
      postalCode: store.postalCode,
      subRegionId: store.subRegionId,
      price: store.price,
      maxGuest: store.maxGuest,
      imageRequestList: store.imageRequestList ?? [],
    } as ExtendedCreateStayInput,
  });

  const { setValue, reset } = form;

  useEffect(() => {
    if (!store.stayId) return;
    reset({
      title: store.title,
      titleEng: store.titleEng,
      description: store.description,
      descriptionEng: store.descriptionEng,
      address: store.address,
      addressEng: store.addressEng,
      addressDetail: store.addressDetail,
      addressDetailEng: store.addressDetailEng,
      postalCode: store.postalCode,
      subRegionId: store.subRegionId,
      price: store.price,
      maxGuest: store.maxGuest,
      imageRequestList: store.imageRequestList ?? [],
    });
  }, [store, reset]);

  useEffect(() => {
    if (store.address) {
      setValue('address', store.address, { shouldValidate: true });
    }
    if (store.postalCode) {
      setValue('postalCode', store.postalCode, { shouldValidate: true });
    }
  }, [store.address, store.postalCode, setValue]);

  return (
    <div className="max-w-md flex flex-1 flex-col w-full min-h-[calc(100vh-100px)] p-4 overflow-y-auto">
      <BackHeader title={t.editStay ?? '숙소 수정'} />
      <h1 className="text-xl font-bold mb-6 pt-2">{t.step1.title}</h1>

      <StayForm_Edit
        form={form}
        handleSubmit={handleSubmit}
        isSubmitting={form.formState.isSubmitting}
      />
    </div>
  );
}
