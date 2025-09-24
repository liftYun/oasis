'use client';

import Image from 'next/image';
import type { DateRange } from 'react-day-picker';
import { addDays, differenceInDays, format } from 'date-fns';
import CalenderIcon from '@/assets/icons/calender.png';
import { Button } from '@/components/atoms/Button';
import CalendarBase from '@/components/organisms/CalendarBase';
import { useLanguage } from '@/features/language';
import { reservationMessages } from '@/features/reservation/locale';
import { useReservationStore } from '@/stores/useResversionStores';
import BackHeader from '@/components/molecules/BackHeader';

export function Step1_Dates() {
  const { lang } = useLanguage();
  const t = reservationMessages[lang];

  const { checkinDate, checkoutDate, setField, setStep } = useReservationStore();

  const dateRange: DateRange | undefined =
    checkinDate && checkoutDate
      ? { from: new Date(checkinDate), to: new Date(checkoutDate) }
      : undefined;

  const nights =
    checkinDate && checkoutDate
      ? differenceInDays(new Date(checkoutDate), new Date(checkinDate))
      : 0;

  const handleDateRangeChange = (r: DateRange | undefined) => {
    if (!r?.from || !r?.to) {
      setField('checkinDate', '');
      setField('checkoutDate', '');
      setField('night', 0);
      return;
    }
    const from = r.from as Date;
    const to = r.to as Date;

    // 박수 기준 제약: 최소 1박, 최대 29박 (= 최대 30일)
    const nightsCount = differenceInDays(to, from);
    let finalFrom = from;
    let finalTo = to;

    if (nightsCount < 1) {
      finalTo = addDays(from, 1);
    } else if (nightsCount > 29) {
      finalTo = addDays(from, 29);
    }

    setField('checkinDate', finalFrom.toISOString());
    setField('checkoutDate', finalTo.toISOString());
    setField('night', differenceInDays(finalTo, finalFrom));
  };

  const canNext = Boolean(checkinDate && checkoutDate && nights >= 1);

  return (
    <div className="max-w-md flex flex-1 flex-col w-full min-h-[calc(100vh-135px)] p-4 overflow-y-auto">
      <BackHeader title={t.header.title} />
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2">{t.step1.datePlaceholder}</h1>
        <p className="text-gray-400 text-sm">{t.step1.guide}</p>
      </div>

      <div className="px-4 py-4 rounded-full bg-gray-50 flex items-center text-sm text-gray-600 gap-3 mb-6">
        <Image src={CalenderIcon} alt="calendar icon" width={14} height={14} className="mx-2" />
        {checkinDate && checkoutDate ? (
          <>
            {format(new Date(checkinDate), 'yy.MM.dd')} ~{' '}
            {format(new Date(checkoutDate), 'yy.MM.dd')} ({t.step1.nights(nights)})
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
          variant={canNext ? 'blue' : 'blueLight'}
          onClick={() => setStep(2)}
          disabled={!canNext}
        >
          {t.step1.next}
        </Button>
      </div>
    </div>
  );
}
