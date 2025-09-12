'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import CalendarSheet from '@/components/organisms/CalendarSheet';
import CalenderIcon from '@/assets/icons/calender.png';
import type { DateRange } from 'react-day-picker';
import { useCreateStayStore } from '@/features/create-stay/store';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

export function Step4_Availability() {
  const [open, setOpen] = useState(false);
  const { setFormData, setStep, currentStep, formData } = useCreateStayStore();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];
  const savedRanges = formData?.unavailableRanges;
  const [ranges, setRanges] = useState<DateRange[]>(savedRanges || []);
  const hasPicked = (ranges?.length || 0) > 0;

  const readOnlyInputClassName =
    'flex h-12 w-full cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base placeholder:text-sm placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div>
        <h1 className="text-xl font-bold mb-1">{t.step4.title}</h1>
        <p className="text-gray-400 text-sm">{t.step4.subtitle}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">{t.step4.unavailLabel}</label>
        <div
          role="button"
          tabIndex={0}
          aria-label={t.step4.openCalendarAria}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className={`${readOnlyInputClassName} text-sm relative ${
            hasPicked ? 'text-gray-900' : 'text-gray-300'
          }`}
        >
          {hasPicked ? t.step4.placeholderSelected : t.step4.placeholder}
          <Image
            src={CalenderIcon}
            alt="calendar"
            width={18}
            height={18}
            className="absolute right-3"
          />
        </div>
      </div>

      <CalendarSheet
        mode="multiRanges"
        open={open}
        onClose={() => setOpen(false)}
        initialRanges={ranges}
        onNext={(picked) => {
          setRanges(picked);
          setFormData({ unavailableRanges: picked });
          setOpen(false);
        }}
      />

      <div className="mt-auto pt-4">
        <Button
          type="button"
          onClick={() => setStep(currentStep + 1)}
          variant="blue"
          className="w-full font-bold mb-10"
        >
          {t.common.next}
        </Button>
      </div>
    </div>
  );
}
