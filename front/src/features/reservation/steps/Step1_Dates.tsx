'use client';

import Image from 'next/image';
import type { DateRange } from 'react-day-picker';
import { addDays, differenceInDays, format } from 'date-fns';
import CalenderIcon from '@/assets/icons/calender.png';
import { Button } from '@/components/atoms/Button';
import CalendarBase from '@/components/organisms/CalendarBase';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useReservationStore } from '@/features/reservation/store';

export function Step1_Dates() {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];
  const { dateRange, setDateRange, setStep } = useReservationStore();

  const nights =
    dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;

  const handleDateRangeChange = (r: DateRange | undefined) => {
    if (!r?.from || !r?.to) {
      setDateRange(r);
      return;
    }
    // 박수 기준 제약: 최소 1박, 최대 29박 (= 최대 30일)
    const nightsCount = differenceInDays(r.to, r.from);
    let final = r;
    if (nightsCount < 1) {
      final = { from: r.from, to: addDays(r.from, 1) };
    } else if (nightsCount > 29) {
      final = { from: r.from, to: addDays(r.from, 29) };
    }
    setDateRange(final);
  };

  const canNext = Boolean(dateRange?.from && dateRange?.to && nights >= 1);

  return (
    <section className="flex flex-col flex-1 gap-4">
      <div className="px-4 py-4 rounded-full bg-gray-50 flex items-center text-sm text-gray-600 gap-3">
        <Image src={CalenderIcon} alt="calendar icon" width={14} height={14} className="mx-2" />
        {dateRange?.from && dateRange?.to ? (
          <>
            {format(dateRange.from, 'yy.MM.dd')} ~ {format(dateRange.to, 'yy.MM.dd')} (
            {t.step1.nights(nights)})
          </>
        ) : (
          t.step1.datePlaceholder
        )}
      </div>

      <CalendarBase
        mode="singleRange"
        selected={dateRange}
        onChange={handleDateRangeChange}
        theme="blue"
        disablePast={true}
      />

      <div className="mt-auto pb-2">
        <Button
          variant={canNext ? 'default' : 'google'}
          onClick={() => setStep(2)}
          disabled={!canNext}
        >
          {t.step1.next}
        </Button>
      </div>
    </section>
  );
}
