'use client';

import { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ko } from 'date-fns/locale';
import {
  isAfter,
  isBefore,
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
  maxRangeDays?: number;
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
    if (!last.to || !last.from) {
      merged.push({ from: current.from, to: current.to });
      continue;
    }

    const nextDay = new Date(last.to.getFullYear(), last.to.getMonth(), last.to.getDate() + 1);
    const isOverlapOrAdjacent = !isAfter(current.from, nextDay);

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
  const disablePast = props.disablePast !== false;

  const disabled = useMemo(() => {
    return disablePast ? ({ before: startOfToday() } as any) : undefined;
  }, [disablePast]);

  const themeClass = useMemo(() => {
    if (theme === 'red') {
      return {
        range_middle: 'bg-red/20 text-gray-600 font-normal rounded-none',
        range_start: 'bg-red text-white rounded-full font-normal',
        range_end: 'bg-red text-white rounded-full font-normal',
        selected: 'bg-red text-gray-600 rounded-full font-normal',
      };
    }
    return {
      range_middle: 'bg-primary/20 text-gray-600 font-normal rounded-none',
      range_start: 'bg-primary text-white rounded-full font-normal',
      range_end: 'bg-primary text-white rounded-full font-normal',
      selected: 'bg-primary text-gray-600 rounded-full font-normal',
    };
  }, [theme]);

  const commonStyles = {
    root: {
      width: '100%',
      display: 'block',
      ['--rdp-accent-color' as any]: themeClass.selected,
      ['--rdp-accent-background-color' as any]: themeClass.range_middle,
      ['--rdp-outside-opacity' as any]: 0.5,
    },
    month_grid: {
      width: '100%',
      tableLayout: 'fixed',
    },
    day: { aspectRatio: '1/1', position: 'relative' },
    cell: { padding: 0 },
  } as const;

  const baseClassNames = {
    day: 'text-gray-600 font-normal',
    day_button: 'rounded-full w-full aspect-square',
    today: 'text-primary font-semibold',
    chevron: 'fill-primary',
  };

  const modifiersClassNames = {
    range_middle: themeClass.range_middle,
    range_start: themeClass.range_start,
    range_end: themeClass.range_end,
    selected: themeClass.selected,
  };

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
        classNames={baseClassNames}
        modifiersClassNames={modifiersClassNames}
        styles={commonStyles}
        navLayout="around"
        className={`w-full block ${props.className ?? ''}`}
      />
    );
  }

  const { selected: selectedRanges = [], onChange, allowSingleDay = true } = props;
  const maxRangeDays = props.maxRangeDays ?? 30;

  const [draft, setDraft] = useState<DateRange | undefined>(undefined);
  const [ignoreNext, setIgnoreNext] = useState(false);

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
      onSelect={(d) => {
        if (!onChange) return;
        if (ignoreNext) {
          setIgnoreNext(false);
          return;
        }
        setDraft(d);
        if (!d?.from || !d?.to) return;

        const rawComplete: DateRange = d.to ? d : { from: d.from, to: d.from };
        const complete = normalizeRange(rawComplete);
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
        setDraft(undefined);
      }}
      onDayClick={(date) => {
        if (!onChange) return;
        const idx = selectedRanges.findIndex((r) =>
          r.from && r.to
            ? isWithinInterval(date, { start: startOfDay(r.from), end: endOfDay(r.to) })
            : false
        );
        if (idx !== -1) {
          const next = [...selectedRanges.slice(0, idx), ...selectedRanges.slice(idx + 1)];
          onChange(next);
          setIgnoreNext(true);
          setDraft(undefined);
        }
      }}
      locale={lang === 'kor' ? ko : undefined}
      showOutsideDays
      fixedWeeks
      disabled={disabled}
      classNames={baseClassNames}
      modifiers={modifiers}
      modifiersClassNames={{
        ...modifiersClassNames,
        unavail_middle: themeClass.range_middle,
        unavail_start: themeClass.range_start,
        unavail_end: themeClass.range_end,
      }}
      styles={commonStyles}
      navLayout="around"
      className={`w-full block ${props.className ?? ''}`}
    />
  );
}
