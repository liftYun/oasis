import { useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import type { CreateStayInput } from '@/features/create-stay/schema';

// 임시 주소 데이터 타입 (실제 API 응답에 맞춰 수정 필요)
interface Address {
  main: string;
  detail: string;
  zipCode: string;
}

interface UseAddressSearchProps {
  setValue: UseFormSetValue<CreateStayInput>;
}

export function useAddressSearch({ setValue }: UseAddressSearchProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelectAddress = (address: Address) => {
    // react-hook-form의 상태를 업데이트
    setValue('address', address.main, { shouldValidate: true });
    // 상세 주소 필드는 비워두거나 필요에 따라 다른 값으로 설정
    setValue('addressDetail', address.detail || '');
    closeModal();
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleSelectAddress,
  };
}
