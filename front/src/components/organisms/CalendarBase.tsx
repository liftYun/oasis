'use client';

import { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ko } from 'date-fns/locale';
import {
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  startOfToday,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { useLanguage } from '@/features/language';

type Theme = 'blue' | 'red';

type CommonProps = {
  theme?: Theme;
  disablePast?: boolean;
  className?: string;
};

type SingleRangeProps = CommonProps & {
  mode: 'singleRange';
  selected?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
};

type MultiRangesProps = CommonProps & {
  mode: 'multiRanges';
  selected?: DateRange[];
  onChange?: (value: DateRange[]) => void;
  allowSingleDay?: boolean;
  maxRangeDays?: number; // inclusive, default 30
};

export type CalendarBaseProps = SingleRangeProps | MultiRangesProps;

function normalizeRange(range: DateRange): DateRange {
  if (!range.from) return range;
  if (!range.to) return { from: range.from, to: range.from };
  const from = isAfter(range.from, range.to) ? range.to : range.from;
  const to = isAfter(range.from, range.to) ? range.from : range.to;
  return { from, to };
}

export function mergeDateRanges(ranges: DateRange[]): DateRange[] {
  if (!ranges.length) return [];
  const sorted = [...ranges]
    .map((r) => normalizeRange(r))
    .sort((a, b) => (a.from && b.from ? a.from.getTime() - b.from.getTime() : 0));

  const merged: DateRange[] = [];
  for (const current of sorted) {
    if (!current.from || !current.to) continue;
    const last = merged[merged.length - 1];
    if (!last) {
      merged.push({ from: current.from, to: current.to });
      continue;
    }
    if (!last.from || !last.to) {
      merged[merged.length - 1] = normalizeRange({ from: last.from!, to: last.to ?? last.from! });
      continue;
    }
    // overlap or adjacent: (current.from <= last.to + 1d)
    const isOverlapOrAdjacent = !isAfter(
      current.from,
      new Date(last.to.getFullYear(), last.to.getMonth(), last.to.getDate() + 1)
    );
    if (isOverlapOrAdjacent) {
      const newTo = isAfter(current.to, last.to) ? current.to : last.to;
      merged[merged.length - 1] = { from: last.from, to: newTo };
    } else {
      merged.push({ from: current.from, to: current.to });
    }
  }
  return merged;
}

export default function CalendarBase(props: CalendarBaseProps) {
  const { lang } = useLanguage();

  const theme = props.theme ?? 'blue';
  const disablePast = props.disablePast !== false; // default true

  const disabled = useMemo(() => {
    const common = disablePast ? { before: startOfToday() } : undefined;
    return common as any;
  }, [disablePast]);

  const themeClass = useMemo(() => {
    if (theme === 'red') {
      return {
        range_middle: 'bg-red-100 text-gray-600',
        range_start: 'bg-red-500 text-white rounded-full',
        range_end: 'bg-red-500 text-white rounded-full',
        selected: 'bg-red-500 text-white',
        unavail_middle: 'bg-red-100 text-gray-600',
        unavail_start: 'bg-red-500 text-white rounded-full',
        unavail_end: 'bg-red-500 text-white rounded-full',
      };
    }
    return {
      range_middle: 'bg-blue-100 text-gray-600',
      range_start: 'bg-primary text-white rounded-full',
      range_end: 'bg-primary text-white rounded-full',
      selected: 'bg-primary text-white',
      unavail_middle: 'bg-blue-100 text-gray-600',
      unavail_start: 'bg-primary text-white rounded-full',
      unavail_end: 'bg-primary text-white rounded-full',
    };
  }, [theme]);

  const themeStyle = useMemo(() => {
    if (theme === 'red') {
      return {
        baseBg: '#ef4444', // red-500
        midBg: '#fee2e2', // red-100 slightly lighter for middle fill
        textOnBase: '#ffffff',
        textOnMid: '#4b5563', // gray-600
      } as const;
    }
    return {
      baseBg: '#2563eb', // blue-600 approx for primary
      midBg: '#dbeafe', // blue-100
      textOnBase: '#ffffff',
      textOnMid: '#4b5563',
    } as const;
  }, [theme]);

  if (props.mode === 'singleRange') {
    const { selected, onChange } = props;
    return (
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={onChange}
        locale={lang === 'kor' ? ko : undefined}
        showOutsideDays
        fixedWeeks
        disabled={disabled}
        classNames={{
          day: 'text-gray-600',
          today: 'text-primary font-bold',
          chevron: 'fill-primary',
        }}
        modifiersClassNames={{
          range_middle: themeClass.range_middle,
          range_start: themeClass.range_start,
          range_end: themeClass.range_end,
          selected: themeClass.selected,
        }}
        modifiersStyles={{
          range_middle: { borderRadius: 0 },
        }}
        styles={{ day: { margin: 0, width: '36px', height: '36px' }, cell: { padding: 0 } }}
        navLayout="around"
        className={`mx-auto flex justify-center ${props.className ?? ''}`}
      />
    );
  }

  // multiRanges
  const { selected: selectedRanges = [], onChange, allowSingleDay = true } = props;
  const maxRangeDays = props.maxRangeDays ?? 30;

  const [draft, setDraft] = useState<DateRange | undefined>(undefined);
  const [ignoreNext, setIgnoreNext] = useState(false);

  // Modifiers to highlight existing ranges
  const modifiers = useMemo(() => {
    return {
      unavail_start: (date: Date) => selectedRanges.some((r) => r.from && isSameDay(r.from, date)),
      unavail_end: (date: Date) => selectedRanges.some((r) => r.to && isSameDay(r.to, date)),
      unavail_middle: (date: Date) =>
        selectedRanges.some((r) => {
          if (!r.from || !r.to) return false;
          const afterFrom = isAfter(date, r.from) && !isSameDay(date, r.from);
          const beforeTo = isBefore(date, r.to) && !isSameDay(date, r.to);
          return afterFrom && beforeTo;
        }),
    } as const;
  }, [selectedRanges]);

  return (
    <DayPicker
      mode="range"
      selected={draft}
      // In multi-ranges, `selected` shows the drafting range only while picking;
      // finalized ranges are highlighted via custom modifiers above.
      onSelect={(d) => {
        if (!onChange) return;
        if (ignoreNext) {
          setIgnoreNext(false);
          return;
        }
        setDraft(d);
        if (!d?.from || !d?.to) return; // wait until end picked
        const rawComplete: DateRange = d.to ? d : { from: d.from, to: d.from };
        const complete = normalizeRange(rawComplete);
        // clamp to maxRangeDays (inclusive)
        const from = complete.from!;
        const to = complete.to!;
        const days = Math.floor((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        const clampedTo =
          days > maxRangeDays
            ? new Date(from.getFullYear(), from.getMonth(), from.getDate() + (maxRangeDays - 1))
            : to;
        const finalRange: DateRange = { from, to: clampedTo };
        const next = mergeDateRanges([...(selectedRanges || []), finalRange]);
        onChange(next);
        // clear draft after finalizing
        setDraft(undefined);
      }}
      onDayClick={(date) => {
        if (!onChange) return;
        // if clicked within an existing range, remove that range (toggle off)
        const idx = selectedRanges.findIndex((r) =>
          r.from && r.to
            ? isWithinInterval(date, { start: startOfDay(r.from), end: endOfDay(r.to) })
            : false
        );
        if (idx !== -1) {
          const next = [...selectedRanges.slice(0, idx), ...selectedRanges.slice(idx + 1)];
          onChange(next);
          // prevent the following onSelect from starting a new draft
          setIgnoreNext(true);
          setDraft(undefined);
        }
      }}
      locale={lang === 'kor' ? ko : undefined}
      showOutsideDays
      fixedWeeks
      disabled={disabled}
      classNames={{
        day: 'text-gray-600',
        today: 'text-primary font-bold',
        chevron: 'fill-primary',
      }}
      modifiers={{ ...modifiers }}
      modifiersClassNames={{
        unavail_middle: themeClass.unavail_middle,
        unavail_start: themeClass.unavail_start,
        unavail_end: themeClass.unavail_end,
        range_middle: themeClass.range_middle,
        range_start: themeClass.range_start,
        range_end: themeClass.range_end,
        selected: themeClass.selected,
      }}
      modifiersStyles={{
        selected: { backgroundColor: themeStyle.baseBg, color: themeStyle.textOnBase },
        range_start: { backgroundColor: themeStyle.baseBg, color: themeStyle.textOnBase },
        range_end: { backgroundColor: themeStyle.baseBg, color: themeStyle.textOnBase },
        range_middle: {
          backgroundColor: themeStyle.midBg,
          color: themeStyle.textOnMid,
          borderRadius: 0,
        },
        unavail_start: { backgroundColor: themeStyle.baseBg, color: themeStyle.textOnBase },
        unavail_end: { backgroundColor: themeStyle.baseBg, color: themeStyle.textOnBase },
        unavail_middle: {
          backgroundColor: themeStyle.midBg,
          color: themeStyle.textOnMid,
          borderRadius: 0,
        },
      }}
      styles={{ day: { margin: 0, width: '36px', height: '36px' }, cell: { padding: 0 } }}
      navLayout="around"
      className={`mx-auto flex justify-center ${props.className ?? ''}`}
    />
  );
}
