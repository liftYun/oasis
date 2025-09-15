'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { ChevronLeft } from 'lucide-react';
import { useCreateStayStore } from '@/features/create-stay/store';
import { Step1_StayInfo } from '@/features/create-stay/components/Step1_StayInfo';
import { Step2_Description } from '@/features/create-stay/components/Step2_Description';
import { Step3_Amenities } from '@/features/create-stay/components/Step3_Amenities';
import { Step4_Availability } from '@/features/create-stay/components/Step4_Availability';
import { AddressSearch } from '@/features/create-stay/components/AddressSearch';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

export default function CreateStayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStep, setStep, view, setView, reset } = useCreateStayStore();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];

  // 현재 URL의 step 파라미터만 안정적으로 추출 (메모이제이션 불필요)
  const stepParam = searchParams.get('step');

  // 새로고침 여부 저장용 ref
  const isReloadRef = useRef(false);
  // 초기 마운트 시 딥링크 금지 처리 여부
  const didInitRef = useRef(false);

  // 초기 진입 시: 딥링크(step 파라미터) 무시하고 항상 step=1로 고정
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

  // 새로고침 감지 시: 상태 초기화 및 첫 단계로 강제 이동
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload =
      entries?.[0]?.type === 'reload' ||
      // Legacy fallback (deprecated API)
      (performance.navigation && performance.navigation.type === 1);
    if (isReload) {
      isReloadRef.current = true;
      reset();
      router.replace('/create-stay?step=1', { scroll: false });
    }
  }, [reset, router]);

  // 딥링크 금지: URL 변화로 스텝을 동기화하지 않음

  // store -> URL: 첫 렌더는 건너뛰고, 이후 currentStep이 바뀔 때만 동기화
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

  const handleBack = () => {
    if (view === 'searchAddress') {
      setView('form');
    } else if (currentStep > 1) {
      setStep(currentStep - 1);
    } else {
      router.push('/'); // Or your desired fallback route
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
    <main className="flex flex-col flex-1 bg-white my-5">
      <header className="mb-8">
        {view === 'form' ? (
          <div>
            <div className="flex h-12 items-center">
              <button type="button" onClick={handleBack}>
                <ChevronLeft />
              </button>
            </div>
            <ProgressBar totalSteps={4} currentStep={currentStep} className="mt-2" />
          </div>
        ) : (
          <div className="relative flex h-12 items-center justify-center">
            <button type="button" onClick={handleBack} className="absolute left-0">
              <ChevronLeft />
            </button>
            <h1 className="text-lg font-bold">{t.header.searchTitle}</h1>
          </div>
        )}
      </header>
      <div className="flex flex-col flex-grow">
        {view === 'form' ? renderStep() : <AddressSearch />}
      </div>
    </main>
  );
}
