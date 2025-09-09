'use client';

import { useCreateStayStore } from '@/features/create-stay/store';
import { StayForm } from '@/components/organisms/StayForm';
import { useCreateStayForm } from '@/features/create-stay/hooks/useCreateStayForm';
import { useImageUploader } from '@/features/create-stay/hooks/useImageUploader';
import { useAddressSearch } from '@/features/create-stay/hooks/useAddressSearch';
import { AddressSearchModal } from './AddressSearchModal';
import type { CreateStayInput } from '@/features/create-stay/schema';

export function Step1_StayInfo() {
  const { setStep, setFormData, formData } = useCreateStayStore();

  const handleNextStep = (data: CreateStayInput) => {
    setFormData(data);
    setStep(2);
  };

  const { form, handleSubmit } = useCreateStayForm({
    onFormSubmit: handleNextStep,
    defaultValues: formData,
  });
  const { watch, setValue } = form;

  const { imagePreviews, handleRemoveImage } = useImageUploader({ watch, setValue });
  const { isModalOpen, openModal, closeModal } = useAddressSearch();

  const handleSelectAddress = (address: { address: string; postalCode: string }) => {
    setValue('address', address.address, { shouldValidate: true });
    setValue('postalCode', address.postalCode, { shouldValidate: true });
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-6">숙소 정보를 작성해주세요.</h1>
      <StayForm
        form={form}
        handleSubmit={handleSubmit}
        openAddressModal={openModal}
        imagePreviews={imagePreviews}
        onRemoveImage={handleRemoveImage}
        isSubmitting={form.formState.isSubmitting}
      />
      {isModalOpen && <AddressSearchModal onClose={closeModal} onSelect={handleSelectAddress} />}
    </>
  );
}
