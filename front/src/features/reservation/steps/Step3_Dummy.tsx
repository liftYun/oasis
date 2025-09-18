'use client';

import { Button } from '@/components/atoms/Button';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useReservationStore } from '@/features/reservation/store';

export function Step3_Dummy() {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];
  const { reset } = useReservationStore();

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">{t.step3.title}</h2>
      <div className="mt-8">
        <Button variant="blue" onClick={() => reset()}>
          {t.step3.submit}
        </Button>
      </div>
    </section>
  );
}
