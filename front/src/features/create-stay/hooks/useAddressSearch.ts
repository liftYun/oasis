'use client';

import { useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import type { CreateStayInput } from '@/features/create-stay/schema';

// 임시 주소 데이터 타입 (실제 API 응답에 맞춰 수정 필요)
interface Address {
  postalCode: string;
  main: string;
  detail: string;
}

interface UseAddressSearchProps {
  setValue: UseFormSetValue<CreateStayInput>;
}

export const useAddressSearch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return { isModalOpen, openModal, closeModal };
};
