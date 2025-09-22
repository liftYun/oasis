'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { useReservationStore } from '@/stores/useResversionStores';
import { Step1_Dates, Step3_Dummy, Step2_SmartKey } from '@/features/reservation';

export default function ReservationPage() {
  const router = useRouter();
  const { currentStep, setStep, reset } = useReservationStore();
  const isReloadRef = useRef(false);
  const didInitRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didInitRef.current) return;
    didInitRef.current = true;
    if (currentStep !== 1) {
      setStep(1);
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('step') !== '1') {
      params.set('step', '1');
      router.replace(`/reservation?${params.toString()}`, { scroll: false });
    }
  }, [currentStep, router, setStep]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload =
      entries?.[0]?.type === 'reload' ||
      (performance.navigation && performance.navigation.type === 1);

    if (isReload && !isReloadRef.current) {
      isReloadRef.current = true;
      // reset();
      router.replace('/reservation?step=1', { scroll: false });
    }
  }, [reset, router]);

  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const currentUrlStep = params.get('step');
    if (currentUrlStep !== currentStep.toString()) {
      params.set('step', currentStep.toString());
      router.replace(`/reservation?${params.toString()}`, { scroll: false });
    }
  }, [currentStep, router]);

  useEffect(() => {
    const unsub = useReservationStore.subscribe((state) => {
      console.log('📌 ReservationStore 변경됨:', state);
    });
    return () => unsub();
  }, []);

  const renderStep = () => {
    const state = useReservationStore.getState();
    console.log(state);
    switch (currentStep) {
      case 1:
        return <Step1_Dates />;
      case 2:
        return <Step2_SmartKey />;
      case 3:
        return <Step3_Dummy />;
      default:
        return <Step1_Dates />;
    }
  };

  return (
    <>
      <ProgressBar
        totalSteps={3}
        currentStep={currentStep}
        className="pt-20 max-w-md mx-auto p-4"
      />
      <div className="flex flex-1 w-full items-center justify-center px-8 py-4">{renderStep()}</div>
    </>
  );
}
