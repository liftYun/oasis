'use client';

import { useEffect } from 'react';
import { useStayStores } from '@/stores/useStayStores';
import { StayForm } from '@/components/organisms/StayForm';
import { useCreateStayForm } from '@/features/create-stay/hooks/useCreateStayForm';
import type { CreateStayInput } from '@/features/create-stay/schema';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import BackHeader from '@/components/molecules/BackHeader';

type ExtendedCreateStayInput = CreateStayInput & {
  imageRequestList: { key: string; sortOrder: number }[];
};

export function Step1_StayInfo() {
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
      address: store.address,
      addressEng: store.addressEng,
      addressDetail: store.addressDetail,
      addressDetailEng: store.addressDetailEng,
      postalCode: store.postalCode,
      subRegionId: store.subRegionId,
      price: store.price,
      maxGuest: store.maxGuest,
      imageRequestList: store.imageRequestList ?? [],
      mode: 'onChange',
    } as ExtendedCreateStayInput,
  });

  const { setValue } = form;

  useEffect(() => {
    if (store.address) {
      setValue('address', store.address, { shouldValidate: true });
    }
    if (store.postalCode) {
      setValue('postalCode', store.postalCode, { shouldValidate: true });
    }
  }, [store.address, store.postalCode, setValue]);

  return (
    <div className="max-w-md min-h-[calc(100vh-100px)] flex flex-col w-full p-4 pb-10">
      <BackHeader title={t.createStay} />
      <h1 className="text-xl font-bold mb-6 pt-2 w-full">{t.step1.title}</h1>
      <StayForm
        form={form}
        handleSubmit={handleSubmit}
        isSubmitting={form.formState.isSubmitting}
      />
    </div>
  );
}
