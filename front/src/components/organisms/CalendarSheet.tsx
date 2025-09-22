'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import { Button } from '@/components/atoms/Button';
import CalendarBase, { mergeDateRanges } from '@/components/organisms/CalendarBase';

type SheetMode = 'singleRange' | 'multiRanges';

interface CalendarSheetPropsBase {
  open: boolean;
  onClose: () => void;
  nextLabel?: string;
}

interface CalendarSheetSingleProps extends CalendarSheetPropsBase {
  mode?: 'singleRange';
  initialRange?: DateRange;
  onNext?: (range: DateRange | undefined) => void;
}

interface CalendarSheetMultiProps extends CalendarSheetPropsBase {
  mode: 'multiRanges';
  initialRanges?: DateRange[];
  onNext?: (ranges: DateRange[]) => void;
}

type CalendarSheetProps = CalendarSheetSingleProps | CalendarSheetMultiProps;

export default function CalendarSheet(props: CalendarSheetProps) {
  const { open, onClose } = props;
  const { lang } = useLanguage();
  const t = createStayMessages[lang];

  // 선택 상태 관리
  const [range, setRange] = useState<DateRange | undefined>(
    props.mode !== 'multiRanges' ? props.initialRange : undefined
  );
  const [ranges, setRanges] = useState<DateRange[]>(
    props.mode === 'multiRanges' && props.initialRanges ? mergeDateRanges(props.initialRanges) : []
  );

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (props.mode === 'multiRanges') {
      setRanges(mergeDateRanges(props.initialRanges || []));
    } else {
      setRange(props.initialRange);
    }
  }, [open, props]);

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
            className="absolute inset-x-0 bottom-0 rounded-t-2xl mx-auto w-full max-w-[480px] bg-white shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
          >
            <div className="h-1.5 w-12 rounded-full bg-gray-200 mx-auto absolute left-1/2 -translate-x-1/2 -top-2" />
            <div className="flex items-center justify-end p-5">
              <button
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div className="px-5 w-full">
              {props.mode === 'multiRanges' ? (
                <CalendarBase
                  mode="multiRanges"
                  theme="red"
                  selected={ranges}
                  onChange={setRanges}
                  maxRangeDays={30}
                  className="w-full"
                />
              ) : (
                <CalendarBase
                  mode="singleRange"
                  theme="blue"
                  selected={range}
                  onChange={setRange}
                  className="w-full"
                />
              )}
            </div>

            <div className="mt-auto p-5">
              {props.mode === 'multiRanges' ? (
                <Button
                  type="button"
                  onClick={() => props.onNext?.(ranges)}
                  disabled={ranges.length === 0}
                  variant={ranges.length === 0 ? 'blueLight' : 'blue'}
                >
                  {props.nextLabel || t.common.next}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => ('onNext' in props ? props.onNext?.(range) : undefined)}
                  disabled={!range?.from || !range?.to}
                  variant={!range?.from || !range?.to ? 'blueLight' : 'blue'}
                >
                  {props.nextLabel || t.common.next}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
