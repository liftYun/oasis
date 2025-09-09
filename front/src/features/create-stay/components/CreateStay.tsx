'use client';

import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { ChevronLeft } from 'lucide-react';
import { StayForm } from '@/components/organisms/StayForm';
import { useCreateStayForm } from '@/features/create-stay/hooks/useCreateStayForm';
import { useImageUploader } from '@/features/create-stay/hooks/useImageUploader';
import { useAddressSearch } from '@/features/create-stay/hooks/useAddressSearch';
import { useCreateStayMutation } from '@/features/create-stay/hooks/useCreateStayMutation';
import type { CreateStayOutput } from '@/features/create-stay/schema';

interface CreateStayProps {
  currentStep: number;
}

export function CreateStay({ currentStep }: CreateStayProps) {
  const router = useRouter();
  const createStayMutation = useCreateStayMutation();

  const handleCreateStay = async (data: CreateStayOutput) => {
    createStayMutation.mutate(data);
  };

  const { form, handleSubmit } = useCreateStayForm({ onFormSubmit: handleCreateStay });
  const { watch, setValue } = form;

  const { imagePreviews, handleRemoveImage } = useImageUploader({ watch, setValue });
  const { openModal: openAddressModal } = useAddressSearch({ setValue });

  return (
    <main className="flex flex-col flex-1 bg-white my-5">
      <header className="relative flex items-center justify-center h-12 mb-8">
        <div className="flex flex-col w-full">
          <div className="mb-4 ms-0">
            <button type="button" onClick={() => router.back()}>
              <ChevronLeft />
            </button>
          </div>
          <div>
            <ProgressBar totalSteps={4} currentStep={currentStep} />
          </div>
        </div>
      </header>
      <div className="flex flex-col flex-grow">
        <h1 className="text-xl font-bold mb-6">숙소 정보를 작성해주세요.</h1>
        <StayForm
          form={form}
          handleSubmit={handleSubmit}
          openAddressModal={openAddressModal}
          isSubmitting={createStayMutation.isPending} // useMutation의 로딩 상태 사용
          imagePreviews={imagePreviews}
          onRemoveImage={handleRemoveImage}
        />
      </div>
      {/* 주소 검색 모달 */}
      {/* {isModalOpen && <AddressModal onClose={closeModal} onSelect={handleSelectAddress} />} */}
    </main>
  );
}
