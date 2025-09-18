import { z } from 'zod';
import { differenceInDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

export type ReservationInput = {
  dateRange?: DateRange;
};

export function buildReservationSchema(lang: 'kor' | 'eng') {
  const messages = {
    kor: {
      required: '날짜를 선택해주세요.',
      min: '최소 1박 이상 선택해주세요.',
      max: '최대 29박까지 선택 가능합니다.',
      invalid: '올바른 날짜 범위를 선택해주세요.',
    },
    eng: {
      required: 'Please select a date range.',
      min: 'Please select at least 1 night.',
      max: 'You can select up to 29 nights.',
      invalid: 'Please select a valid date range.',
    },
  } as const;

  // DateRange를 안전하게 검증
  const dateRangeSchema = z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .refine((v) => v.from !== undefined && v.to !== undefined, {
      message: messages[lang].required,
    })
    .refine((v) => v.from! <= v.to!, { message: messages[lang].invalid })
    .refine((v) => differenceInDays(v.to!, v.from!) >= 1, { message: messages[lang].min })
    .refine((v) => differenceInDays(v.to!, v.from!) <= 29, { message: messages[lang].max });

  return z.object({
    dateRange: dateRangeSchema.optional(),
  });
}

export type ReservationValidated = z.infer<ReturnType<typeof buildReservationSchema>>;
