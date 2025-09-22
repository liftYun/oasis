'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, use } from 'react';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { useStayStores } from '@/stores/useStayStores';
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
  const { currentStep, setStep, reset, setMode, setStayData } = useStayStores();
  const didInitRef = useRef(false);
  useStayTranslateSSE();

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    reset();
    setMode('edit', Number(stayId));

    const load = async () => {
      try {
        const detail = await fetchStayDetail(Number(stayId));
        console.log(detail);
        setStayData(detail.result);
      } catch (err) {
        console.error('숙소 불러오기 실패:', err);
        router.replace('/my-profile/manage-stay');
      }
    };
    load();

    if (currentStep !== 1) setStep(1);

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('step') !== '1') {
      searchParams.set('step', '1');
      router.replace(`/edit-stay/${stayId}?${searchParams.toString()}`, { scroll: false });
    }
  }, [currentStep, router, setStep, reset, setMode, stayId, setStayData]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_StayInfo_Edit />;
      case 2:
        return <Step2_Description_Edit />;
      case 3:
        return <Step3_Amenities_Edit />;
      case 4:
        return <Step4_Availability_Edit />;
      default:
        return <Step1_StayInfo_Edit />;
    }
  };

  return (
    <>
      <ProgressBar
        totalSteps={4}
        currentStep={currentStep}
        className="pt-20 max-w-md mx-auto p-4"
      />
      <div className="flex items-center justify-center">{renderStep()}</div>
    </>
  );
}
