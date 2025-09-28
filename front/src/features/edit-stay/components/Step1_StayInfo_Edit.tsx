'use client';

import { useEffect } from 'react';
import { useStayStores } from '@/stores/useStayEditStores';
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

  // 언어별로 Store 필드 매핑
  const getLocalizedKey = (baseKey: string): string => {
    if (['title', 'description', 'address', 'addressDetail'].includes(baseKey)) {
      return lang === 'eng' ? `${baseKey}Eng` : baseKey;
    }
    return baseKey;
  };

  // step 이동 시 언어별로 분리 저장
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
        // 언어 구분하여 store에 저장
        const localizedKey = getLocalizedKey(key);
        store.setField(localizedKey as ValidKey, value as any);
      }
    });

    store.setStep(2);
  };

  // 폼 기본값도 언어별로 세팅
  const defaultValues: ExtendedCreateStayInput = {
    title: lang === 'eng' ? store.titleEng : store.title,
    titleEng: store.titleEng,
    description: lang === 'eng' ? store.descriptionEng : store.description,
    descriptionEng: store.descriptionEng,
    address: lang === 'eng' ? store.addressEng : store.address,
    addressEng: store.addressEng,
    addressDetail: lang === 'eng' ? store.addressDetailEng : store.addressDetail,
    addressDetailEng: store.addressDetailEng,
    postalCode: store.postalCode,
    subRegionId: store.subRegionId,
    price: store.price,
    maxGuest: store.maxGuest,
    imageRequestList: store.imageRequestList ?? [],
  };

  const { form, handleSubmit } = useCreateStayForm({
    onFormSubmit: handleNextStep,
    defaultValues,
  });

  const { setValue, reset } = form;

  // store 데이터 변경 시 폼 리셋 (언어별 반영)
  useEffect(() => {
    if (!store.stayId) return;
    console.log(store);
    reset({
      title: lang === 'eng' ? store.titleEng : store.title,
      titleEng: store.titleEng,
      description: lang === 'eng' ? store.descriptionEng : store.description,
      descriptionEng: store.descriptionEng,
      address: lang === 'eng' ? store.addressEng : store.address,
      addressEng: store.addressEng,
      addressDetail: lang === 'eng' ? store.addressDetailEng : store.addressDetail,
      addressDetailEng: store.addressDetailEng,
      postalCode: store.postalCode,
      subRegionId: store.subRegionId,
      price: store.price,
      maxGuest: store.maxGuest,
      imageRequestList: store.imageRequestList ?? [],
    });
  }, [store, reset, lang]);

  // 주소 동기화 (다국어 포함)
  useEffect(() => {
    if (store.address) {
      setValue('address', lang === 'eng' ? store.addressEng : store.address, {
        shouldValidate: true,
      });
    }
    if (store.addressDetail) {
      setValue('addressDetail', lang === 'eng' ? store.addressDetailEng : store.addressDetail, {
        shouldValidate: true,
      });
    }
    if (store.postalCode) {
      setValue('postalCode', store.postalCode, { shouldValidate: true });
    }
  }, [
    store.address,
    store.addressDetail,
    store.postalCode,
    store.addressEng,
    store.addressDetailEng,
    lang,
    setValue,
  ]);

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
