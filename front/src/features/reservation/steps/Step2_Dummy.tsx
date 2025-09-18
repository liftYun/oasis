'use client';

import { Button } from '@/components/atoms/Button';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useReservationStore } from '@/features/reservation/store';

export function Step2_Dummy() {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];
  const { setStep } = useReservationStore();

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">{t.step2.title}</h2>
      <div className="mt-8">
        <Button variant="blue" onClick={() => setStep(3)}>
          {t.step2.next}
        </Button>
      </div>
    </section>
  );
}
