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
  initialRange?: DateRange | undefined;
  onNext?: (range: DateRange | undefined) => void;
}

interface CalendarSheetMultiProps extends CalendarSheetPropsBase {
  mode: 'multiRanges';
  initialRanges?: DateRange[] | undefined;
  onNext?: (ranges: DateRange[]) => void;
}

type CalendarSheetProps = CalendarSheetSingleProps | CalendarSheetMultiProps;

export default function CalendarSheet(props: CalendarSheetProps) {
  const { open, onClose } = props;
  const { lang } = useLanguage();
  const t = createStayMessages[lang];
  const [range, setRange] = useState<DateRange | undefined>(
    'initialRange' in props ? props.initialRange : undefined
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
    if ('initialRange' in props) setRange(props.initialRange);
    if (props.mode === 'multiRanges') setRanges(mergeDateRanges(props.initialRanges || []));
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
              {props.mode === 'multiRanges' ? (
                <CalendarBase
                  mode="multiRanges"
                  theme="red"
                  selected={ranges}
                  onChange={setRanges}
                  maxRangeDays={30}
                  className="mx-auto flex justify-center"
                />
              ) : (
                <CalendarBase
                  mode="singleRange"
                  theme="blue"
                  selected={range}
                  onChange={setRange}
                  className="mx-auto flex justify-center"
                />
              )}
            </div>
            <div className="p-5">
              {props.mode === 'multiRanges' ? (
                <Button
                  type="button"
                  onClick={() => props.onNext?.(ranges)}
                  disabled={ranges.length === 0}
                  variant={ranges.length === 0 ? 'google' : 'blue'}
                >
                  {props.nextLabel || t.common.next}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => ('onNext' in props ? props.onNext?.(range) : undefined)}
                  disabled={!range?.from || !range?.to}
                  variant={!range?.from || !range?.to ? 'google' : 'blue'}
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
