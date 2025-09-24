'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { useStayStores } from '@/stores/useStayStores';
import { useStayTranslateSSE } from '@/features/create-stay/hooks/useStayTranslateSSE';
import {
  Step1_StayInfo,
  Step2_Description,
  Step3_Amenities,
  Step4_Availability,
} from '@/features/create-stay';

export default function CreateStayPage() {
  const router = useRouter();
  const store = useStayStores();
  const isReloadRef = useRef(false);
  const didInitRef = useRef(false);
  const { disconnect } = useStayTranslateSSE();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didInitRef.current) return;
    didInitRef.current = true;
    if (store.currentStep !== 1) {
      store.setStep(1);
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('step') !== '1') {
      params.set('step', '1');
      router.replace(`/create-stay?${params.toString()}`, { scroll: false });
    }
  }, [store.currentStep, router, store.setStep]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload =
      entries?.[0]?.type === 'reload' ||
      (performance.navigation && performance.navigation.type === 1);
    if (isReload) {
      isReloadRef.current = true;
      store.reset();
      router.replace('/create-stay?step=1', { scroll: false });
    }
  }, [store.reset, router]);

  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const currentUrlStep = params.get('step');
    if (currentUrlStep !== store.currentStep.toString()) {
      params.set('step', store.currentStep.toString());
      router.replace(`/create-stay?${params.toString()}`, { scroll: false });
    }
  }, [store.currentStep, router]);

  const renderStep = () => {
    switch (store.currentStep) {
      case 1:
        return <Step1_StayInfo />;
      case 2:
        return <Step2_Description />;
      case 3:
        return <Step3_Amenities />;
      case 4:
        return <Step4_Availability onComplete={handleComplete} />;
      default:
        return <Step1_StayInfo />;
    }
  };
  const handleComplete = async () => {
    const success = await store.submit();
    if (success) {
      disconnect();
      router.replace('/my-profile/manage-stay');
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
