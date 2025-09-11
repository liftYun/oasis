'use client';

import { useEffect } from 'react';
import { useCreateStayStore } from '@/features/create-stay/store';
import { StayForm } from '@/components/organisms/StayForm';
import { useCreateStayForm } from '@/features/create-stay/hooks/useCreateStayForm';
import { useImageUploader } from '@/features/create-stay/hooks/useImageUploader';
import type { CreateStayInput } from '@/features/create-stay/schema';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

export function Step1_StayInfo() {
  const { setStep, setFormData, formData, setView } = useCreateStayStore();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];

  const handleNextStep = async (data: CreateStayInput) => {
    setFormData(data);
    setStep(2);
  };

  const { form, handleSubmit } = useCreateStayForm({
    onFormSubmit: handleNextStep,
    defaultValues: formData,
  });
  const { watch, setValue } = form;

  useEffect(() => {
    // 주소 검색 페이지에서 돌아왔을 때, 스토어의 최신 주소 정보를 폼에 반영
    if (formData.address) {
      setValue('address', formData.address, { shouldValidate: true });
    }
    if (formData.postalCode) {
      setValue('postalCode', formData.postalCode, { shouldValidate: true });
    }
  }, [formData.address, formData.postalCode, setValue]);

  const { imagePreviews, handleRemoveImage } = useImageUploader({ watch, setValue });

  const handleSearchAddress = () => {
    // 현재 폼 데이터를 스토어에 저장하고 뷰 전환
    setFormData(watch());
    setView('searchAddress');
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-6">{t.step1.title}</h1>
      <StayForm
        form={form}
        handleSubmit={handleSubmit}
        openAddressModal={handleSearchAddress}
        imagePreviews={imagePreviews}
        onRemoveImage={handleRemoveImage}
        isSubmitting={form.formState.isSubmitting}
      />
    </>
  );
}
