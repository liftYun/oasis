'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import CalendarSheet from '@/components/organisms/CalendarSheet';
import CalenderIcon from '@/assets/icons/calender.png';
import type { DateRange } from 'react-day-picker';
import { useCreateStayStore } from '@/features/create-stay/store';
import { useStayStores } from '@/stores/useStayStores';
import { format } from 'date-fns';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStayTranslateSSE } from '@/features/create-stay/hooks/useStayTranslateSSE';

type Step4Props = {
  onComplete?: () => void;
};

export function Step4_Availability({ onComplete }: Step4Props) {
  const [open, setOpen] = useState(false);

  const createStore = useCreateStayStore();
  const stayStore = useStayStores();
  const { disconnect } = useStayTranslateSSE();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];
  const router = useRouter();

  const savedRanges = createStore.formData?.unavailableRanges;
  const [ranges, setRanges] = useState<DateRange[]>(savedRanges || []);
  const hasPicked = ranges.length > 0;

  const handleBack = () => {
    if (createStore.currentStep > 1) {
      createStore.setStep(createStore.currentStep - 1);
    }
  };

  const handleSave = async () => {
    const success = await stayStore.submit();

    if (success) {
      disconnect();
      onComplete?.();
      router.replace(`/my-profile/manage-stay`);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto flex flex-1 flex-col min-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="fixed left-1/2 -translate-x-1/2 top-[env(safe-area-inset-top)] w-full max-w-[480px] z-[70]">
        <header className="relative h-14 bg-white px-2 flex items-center justify-between border-x border-gray-100">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            aria-label="back"
          >
            <ChevronLeft className="w-7 h-7 text-gray-500" />
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-600">
            {t.createStay}
          </h1>

          <div className="w-7" />
        </header>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2 pt-2">{t.step4.title}</h1>
          <p className="text-gray-400 text-base">{t.step4.subtitle}</p>
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
            className="flex w-full cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 relative min-h-[3rem] py-2 text-sm"
          >
            {hasPicked ? (
              <div className="flex flex-col justify-center gap-1 flex-1">
                {ranges.map((r, idx) => {
                  const from = format(r.from!, 'yyyy-MM-dd');
                  const to = r.to ? format(r.to, 'yyyy-MM-dd') : from;
                  return (
                    <span key={idx} className="block text-gray-700">
                      {from === to ? from : `${from} ~ ${to}`}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="text-gray-300 flex-1">{t.step4.placeholder}</span>
            )}

            <Image
              src={CalenderIcon}
              alt="calendar"
              width={18}
              height={18}
              className="absolute right-3 top-1/2 -translate-y-1/2"
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
            createStore.setFormData({ unavailableRanges: picked });

            const blockRangeList = picked.map((r) => ({
              start: format(r.from!, 'yyyy-MM-dd'),
              end: format((r.to ?? r.from)!, 'yyyy-MM-dd'),
            }));
            stayStore.setField('blockRangeList', blockRangeList);

            setOpen(false);
          }}
        />

        <div className="mt-auto pt-4">
          <Button type="button" onClick={handleSave} variant="blue" className="w-full font-bold">
            {t.common.next}
          </Button>
        </div>
      </div>
    </div>
  );
}
