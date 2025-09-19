'use client';

import { useEffect } from 'react';
import { useStayStores } from '@/stores/useStayStores';
import { StayForm } from '@/components/organisms/StayForm';
import { useCreateStayForm } from '@/features/create-stay/hooks/useCreateStayForm';
import { useImageUploader } from '@/features/create-stay/hooks/useImageUploader';
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

  // 다음 스텝 이동 시 Zustand에 모든 필드 저장
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

    console.log('Step1 저장 완료:', data);
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
    } as ExtendedCreateStayInput,
  });

  const { watch, setValue } = form;

  useEffect(() => {
    if (store.address) {
      setValue('address', store.address, { shouldValidate: true });
    }
    if (store.postalCode) {
      setValue('postalCode', store.postalCode, { shouldValidate: true });
    }
  }, [store.address, store.postalCode, setValue]);

  const { imagePreviews, handleRemoveImage, handleReorder } = useImageUploader({ watch, setValue });

  const handleSearchAddress = () => {
    const currentData = watch();

    store.setField('address', currentData.address);
    store.setField('postalCode', currentData.postalCode);
    store.setField('addressDetail', currentData.addressDetail);

    console.log('주소 검색 전 데이터 저장', currentData);
    store.setView('searchAddress');
  };

  return (
    <div className="max-w-md flex flex-col w-full min-h-screen p-4">
      <BackHeader title={t.createStay} />
      <h1 className="text-xl font-bold mb-6 pt-2">{t.step1.title}</h1>
      <StayForm
        form={form}
        handleSubmit={handleSubmit}
        openAddressModal={handleSearchAddress}
        imagePreviews={imagePreviews}
        onRemoveImage={handleRemoveImage}
        isSubmitting={form.formState.isSubmitting}
        onReorder={handleReorder}
      />
    </div>
  );
}
