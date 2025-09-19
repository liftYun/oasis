'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { useStayStores } from '@/stores/useStayStores';
import {
  AddressSearch,
  Step1_StayInfo,
  Step2_Description,
  Step3_Amenities,
  Step4_Availability,
} from '@/features/create-stay';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

export default function CreateStayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStep, setStep, view, setView, reset, submit } = useStayStores();
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

  // 📝 상태 변화 로깅
  useEffect(() => {
    const unsub = useStayStores.subscribe((state) => {
      console.log('📌 현재 스토어 상태', state);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    console.log(`✅ Step ${currentStep} 진입`);
  }, [currentStep]);

  const handleBack = () => {
    if (view === 'searchAddress') {
      setView('form');
    } else if (currentStep > 1) {
      setStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

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

  return (
    <>
      {view === 'form' && (
        <ProgressBar
          totalSteps={4}
          currentStep={currentStep}
          className="pt-20 max-w-md mx-auto p-4"
        />
      )}
      {view === 'form' ? renderStep() : <AddressSearch />}
    </>
  );
}
