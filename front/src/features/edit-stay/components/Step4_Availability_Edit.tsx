'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/Button';
import CalendarSheet from '@/components/organisms/CalendarSheet';
import CalenderIcon from '@/assets/icons/calender.png';
import type { DateRange } from 'react-day-picker';
import { useStayStores } from '@/stores/useStayStores';
import { format } from 'date-fns';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Step4_Availability_Edit() {
  const [open, setOpen] = useState(false);

  const stayStore = useStayStores();
  const { lang } = useLanguage();
  const t = createStayMessages[lang];
  const router = useRouter();

  const [ranges, setRanges] = useState<DateRange[]>([]);
  const hasPicked = ranges.length > 0;

  const readOnlyInputClassName =
    'flex h-12 w-full cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base placeholder:text-sm placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50';

  const handleBack = () => {
    if (stayStore.currentStep > 1) {
      stayStore.setStep(stayStore.currentStep - 1);
    }
  };

  const handleSave = async () => {
    const id = await stayStore.submit();
    if (id) {
      router.replace(`/my-profile/manage-stay`);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto flex flex-1 flex-col min-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="fixed left-1/2 -translate-x-1/2 top-[env(safe-area-inset-top)] w-full max-w-[480px] z-[70]">
        <header className="relative h-14 bg-white px-2 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            aria-label="back"
          >
            <ChevronLeft className="w-7 h-7 text-gray-500" />
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-600">
            {t.editStay ?? '숙소 수정'}
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

            const blockRangeList = picked.map((r) => ({
              start: format(r.from!, 'yyyy-MM-dd'),
              end: format((r.to ?? r.from)!, 'yyyy-MM-dd'),
            }));
            stayStore.setField('blockRangeList', blockRangeList);

            setOpen(false);
          }}
        />

        <div className="mt-auto pt-4">
          <Button
            type="button"
            onClick={handleSave}
            variant="blue"
            className="w-full font-bold"
            disabled={stayStore.loading}
          >
            {stayStore.loading ? t.common.processing : t.common.save}
          </Button>
        </div>
      </div>
    </div>
  );
}
