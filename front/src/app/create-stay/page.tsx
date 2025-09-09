'use client';

import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { ChevronLeft } from 'lucide-react';
import { useCreateStayStore } from '@/features/create-stay/store';
import { Step1_StayInfo } from '@/features/create-stay/components/Step1_StayInfo';
import { Step2_Amenities } from '@/features/create-stay/components/Step2_Amenities';
import { Step3_Description } from '@/features/create-stay/components/Step3_Description';

export default function CreateStayPage() {
  const router = useRouter();
  const { currentStep, setStep } = useCreateStayStore();

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_StayInfo />;
      case 2:
        return <Step2_Amenities />;
      case 3:
        return <Step3_Description />;
      default:
        return <Step1_StayInfo />;
    }
  };

  return (
    <main className="flex flex-col flex-1 bg-white my-5">
      <header className="relative flex items-center justify-center h-12 mb-8">
        <div className="flex flex-col w-full">
          <div className="mb-4 ms-0">
            <button type="button" onClick={handleBack}>
              <ChevronLeft />
            </button>
          </div>
          <div>
            <ProgressBar totalSteps={4} currentStep={currentStep} />
          </div>
        </div>
      </header>
      <div className="flex flex-col flex-grow">{renderStep()}</div>
    </main>
  );
}
