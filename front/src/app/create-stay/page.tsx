'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import BackHeader from '@/components/molecules/BackHeader';
import { useCreateStayStore } from '@/features/create-stay/store';
import {
  AddressSearch,
  Step1_StayInfo,
  Step2_Description,
  Step3_Amenities,
  Step4_Availability,
} from '@/features/create-stay';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import { StepFlowProvider } from '@/features/common/step-flow/StepFlowContext';

export default function CreateStayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStep, setStep, view, setView, reset } = useCreateStayStore();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];

  const stepParam = searchParams.get('step');
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
      router.replace(`/create-stay?${params.toString()}`, { scroll: false });
    }
  }, [currentStep, router, setStep]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload =
      entries?.[0]?.type === 'reload' ||
      (performance.navigation && performance.navigation.type === 1);
    if (isReload) {
      isReloadRef.current = true;
      reset();
      router.replace('/create-stay?step=1', { scroll: false });
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
      router.replace(`/create-stay?${params.toString()}`, { scroll: false });
    }
  }, [currentStep, router]);

  const canGoPrev = view === 'searchAddress' || currentStep > 1;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_StayInfo />;
      case 2:
        return <Step2_Description />;
      case 3:
        return <Step3_Amenities />;
      case 4:
        return <Step4_Availability />;
      default:
        return <Step1_StayInfo />;
    }
  };

  const goPrevStep = useCallback(() => {
    if (view === 'searchAddress') {
      setView('form');
    } else if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  }, [view, currentStep, setView, setStep]);

  const stepFlowValue = useMemo(
    () => ({ currentStep, canGoPrev, goPrevStep }),
    [currentStep, canGoPrev, goPrevStep]
  );

  return (
    <StepFlowProvider value={stepFlowValue}>
      <main className="flex flex-col flex-1 bg-white">
        <BackHeader title={view === 'searchAddress' ? t.header.searchTitle : t.createStay} />
        {view === 'form' && (
          <div className="fixed left-1/2 -translate-x-1/2 top-[calc(env(safe-area-inset-top)+56px)] w-full max-w-[480px] z-[60] bg-white">
            <ProgressBar
              totalSteps={4}
              currentStep={currentStep}
              className="max-w-md mx-auto p-4"
            />
          </div>
        )}
        <div
          className={`flex flex-col flex-grow ${view === 'form' ? 'pt-[120px]' : ''} px-2 sm:px-4`}
        >
          {view === 'form' ? renderStep() : <AddressSearch />}
        </div>
      </main>
    </StepFlowProvider>
  );
}
