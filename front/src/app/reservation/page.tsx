'use client';

import BackHeader from '@/components/molecules/BackHeader';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { useReservationStore } from '@/features/reservation/store';
import { Step1_Dates, Step3_Dummy, Step2_SmartKey } from '@/features/reservation';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { StepFlowProvider } from '@/features/common/step-flow/StepFlowContext';
import type { ReservationStep } from '@/features/reservation/store';
import { useCallback, useMemo } from 'react';

export default function ReservationPage() {
  const { step, setStep } = useReservationStore();
  const { lang } = useLanguage();
  const t = reservationMessages[lang];

  const renderStep = () => {
    switch (step) {
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

  const goPrevStep = useCallback(() => {
    const prev: ReservationStep = step === 3 ? 2 : 1;
    setStep(prev);
  }, [step, setStep]);

  const stepFlowValue = useMemo(
    () => ({ currentStep: step, canGoPrev: step >= 2, goPrevStep }),
    [step, goPrevStep]
  );

  return (
    <StepFlowProvider value={stepFlowValue}>
      <main className="flex flex-col flex-1 bg-white">
        <BackHeader title={t.header.title} />
        <div className="fixed left-1/2 -translate-x-1/2 top-[calc(env(safe-area-inset-top)+56px)] w-full max-w-[480px] z-[60] bg-white">
          <ProgressBar totalSteps={3} currentStep={step} className="max-w-md mx-auto p-4" />
        </div>
        <div className="flex flex-col flex-grow pt-[120px] px-2 sm:px-4">{renderStep()}</div>
      </main>
    </StepFlowProvider>
  );
}
