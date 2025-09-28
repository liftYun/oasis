'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, use } from 'react';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { useStayStores } from '@/stores/useStayEditStores';
import { useStayTranslateSSE } from '@/features/create-stay/hooks/useStayTranslateSSE';
import {
  Step1_StayInfo_Edit,
  Step2_Description_Edit,
  Step3_Amenities_Edit,
  Step4_Availability_Edit,
} from '@/features/edit-stay';
import { fetchStayDetail } from '@/services/stay.api';

export default function EditStayPage({ params }: { params: Promise<{ stayId: string }> }) {
  const { stayId } = use(params);
  const router = useRouter();
  const store = useStayStores();
  const didInitRef = useRef(false);

  const { disconnect } = useStayTranslateSSE();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didInitRef.current) return;
    didInitRef.current = true;

    store.reset();
    store.setStep(1);

    const load = async () => {
      try {
        const detail = await fetchStayDetail(Number(stayId));
        // console.log('숙소 불러오기 성공:', detail);
        store.setStayData(detail.result);
        // console.log(store);
      } catch (err) {
        console.error('숙소 불러오기 실패:', err);
        router.replace('/my-profile/manage-stay');
      }
    };
    load();

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('step') !== '1') {
      searchParams.set('step', '1');
      router.replace(`/edit-stay/${stayId}?${searchParams.toString()}`, { scroll: false });
    }
  }, [stayId, router, store]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!stayId) return;

    const searchParams = new URLSearchParams(window.location.search);
    const currentStep = String(store.currentStep);

    if (searchParams.get('step') !== currentStep) {
      searchParams.set('step', currentStep);
      router.replace(`/edit-stay/${stayId}?${searchParams.toString()}`, { scroll: false });
    }
  }, [store.currentStep, stayId, router]);

  const handleComplete = async () => {
    const success = await store.submit();
    if (success) {
      disconnect();
      router.replace('/my-profile/manage-stay');
    }
  };

  const renderStep = () => {
    switch (store.currentStep) {
      case 1:
        return <Step1_StayInfo_Edit />;
      case 2:
        return <Step2_Description_Edit />;
      case 3:
        return <Step3_Amenities_Edit />;
      case 4:
        return <Step4_Availability_Edit onComplete={handleComplete} />;
      default:
        return <Step1_StayInfo_Edit />;
    }
  };

  return (
    <>
      <ProgressBar
        totalSteps={4}
        currentStep={store.currentStep}
        className="pt-20 max-w-md mx-auto p-4"
      />
      <div className="flex items-center justify-center w-full">{renderStep()}</div>
    </>
  );
}
