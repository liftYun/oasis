'use client';

import BackHeader from '@/components/molecules/BackHeader';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import { useReservationStore } from '@/features/reservation/store';
import { Step1_Dates, Step3_Dummy, Step2_SmartKey } from '@/features/reservation';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';

export default function ReservationPage() {
  const { step } = useReservationStore();
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

  return (
    <main className="flex flex-col flex-1 bg-white my-5 pt-14">
      <BackHeader title={t.header.title} />
      <div className="px-2 mt-4">
        <ProgressBar totalSteps={3} currentStep={step} />
      </div>
      <div className="flex flex-col flex-grow mt-6">{renderStep()}</div>
    </main>
  );
}
