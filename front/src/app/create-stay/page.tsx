'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { ChevronLeft } from 'lucide-react';
import { useCreateStayStore } from '@/features/create-stay/store';
import { Step1_StayInfo } from '@/features/create-stay/components/Step1_StayInfo';
import { Step2_Description } from '@/features/create-stay/components/Step2_Description';
import { Step3_Amenities } from '@/features/create-stay/components/Step3_Amenities';
import { Step4_Availability } from '@/features/create-stay/components/Step4_Availability';
import { AddressSearch } from '@/features/create-stay/components/AddressSearch';

export default function CreateStayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStep, setStep, view, setView } = useCreateStayStore();

  // Sync URL -> store
  useEffect(() => {
    const urlStep = searchParams.get('step');
    if (urlStep && !isNaN(Number(urlStep))) {
      const step = Number(urlStep);
      if (step >= 1 && step <= 4) {
        setStep(step);
      }
    }
  }, [searchParams, setStep]);
  // Sync store -> URL
  useEffect(() => {
    const currentUrlStep = searchParams.get('step');
    if (currentUrlStep !== currentStep.toString()) {
      const params = new URLSearchParams(searchParams);
      params.set('step', currentStep.toString());
      router.replace(`/create-stay?${params.toString()}`, { scroll: false });
    }
  }, [currentStep, router, searchParams]);

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
            <h1 className="text-lg font-bold">주소 찾기</h1>
          </div>
        )}
      </header>
      <div className="flex flex-col flex-grow">
        {view === 'form' ? renderStep() : <AddressSearch />}
      </div>
    </main>
  );
}
