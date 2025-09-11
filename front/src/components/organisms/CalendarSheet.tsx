'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ko } from 'date-fns/locale';
import { useLanguage } from '@/features/language';
import { Button } from '@/components/atoms/Button';

interface CalendarSheetProps {
  open: boolean;
  onClose: () => void;
  nextDisabled?: boolean;
  onNext?: (range: DateRange | undefined) => void;
  nextLabel?: string;
  initialRange?: DateRange | undefined;
}

export default function CalendarSheet({
  open,
  onClose,
  nextDisabled = false,
  onNext,
  nextLabel = '다음',
  initialRange,
}: CalendarSheetProps) {
  const { lang } = useLanguage();
  const [range, setRange] = useState<DateRange | undefined>(initialRange);
  const computedDisabled = nextDisabled || !range?.from || !range?.to;
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setRange(initialRange);
  }, [initialRange, open]);

  return (
    <AnimatePresence>
      {open && (
        <div aria-modal role="dialog" className="fixed inset-0 z-50">
          <motion.button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
          >
            <div className="flex items-center justify-end p-4">
              <button
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <X />
              </button>
            </div>
            <div className="px-5">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                locale={lang === 'kor' ? ko : undefined}
                showOutsideDays
                fixedWeeks
                classNames={{
                  day: 'text-gray-600',
                  today: 'text-primary font-bold',
                  chevron: 'fill-primary',
                }}
                modifiersClassNames={{
                  range_middle: 'bg-blue-100 text-gray-600 rounded-full',
                  range_start: 'bg-primary text-white rounded-full',
                  range_end: 'bg-primary text-white rounded-full',
                  selected: 'bg-primary text-gray-600',
                }}
                styles={{
                  day: { margin: 0, width: '36px', height: '36px' },
                }}
                navLayout="around"
                className="mx-auto flex justify-center"
              />
            </div>
            <div className="p-5">
              <Button
                type="button"
                onClick={() => onNext?.(range)}
                disabled={computedDisabled}
                className={`w-full font-bold mb-2 ${
                  computedDisabled
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-black text-white hover:bg-black active:bg-black'
                }`}
              >
                {nextLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
