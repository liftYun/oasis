import { z } from 'zod';
import { createStayMessages } from '@/features/create-stay/locale';
import type { Lang } from '@/types/lang';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const buildCreateStayInputSchema = (lang: Lang) => {
  const e = createStayMessages[lang].errors;

  // 문자열/숫자 입력 모두 처리 + 옵션 기반 검증
  const toNumber = (opts: {
    typeMsg: string;
    positiveMsg?: string;
    intMsg?: string;
    maxDecimals?: number;
    decimalMsg?: string;
  }) =>
    z
      .preprocess((val) => {
        if (typeof val === 'string' && val.trim() !== '') return Number(val);
        return val;
      }, z.any())
      .pipe(
        z.number().superRefine((v, ctx) => {
          if (!Number.isFinite(v)) {
            ctx.addIssue({ code: 'custom', message: opts.typeMsg });
            return;
          }
          if (opts.positiveMsg && v <= 0) {
            ctx.addIssue({ code: 'custom', message: opts.positiveMsg });
          }
          if (opts.intMsg && !Number.isInteger(v)) {
            ctx.addIssue({ code: 'custom', message: opts.intMsg });
          }
          if (opts.maxDecimals !== undefined) {
            const dec = (v.toString().split('.')[1] || '').length;
            if (dec > opts.maxDecimals) {
              ctx.addIssue({
                code: 'custom',
                message: opts.decimalMsg || '소수점 자리수가 초과되었습니다.',
              });
            }
          }
        })
      );

  const nonEmpty = (msg: string) => z.string().min(1, msg);

  return z.object({
    subRegionId: toNumber({ typeMsg: e.subRegionRequired }),

    title: nonEmpty(e.titleRequired).max(20, e.titleMax),
    titleEng: nonEmpty(e.titleEngRequired).max(50, e.titleEngMax),

    description: nonEmpty(e.descriptionRequired),
    descriptionEng: nonEmpty(e.descriptionEngRequired),

    price: toNumber({
      typeMsg: e.priceType,
      positiveMsg: e.pricePositive,
      maxDecimals: 2,
      decimalMsg: e.priceDecimal,
    }),

    address: nonEmpty(e.addressRequired),
    addressEng: nonEmpty(e.addressEngRequired),
    addressDetail: nonEmpty(e.addressDetailRequired),
    addressDetailEng: nonEmpty(e.addressDetailEngRequired),
    postalCode: nonEmpty(e.postalCodeRequired),

    maxGuest: toNumber({
      typeMsg: e.maxGuestType,
      positiveMsg: e.maxGuestPositive,
      intMsg: e.maxGuestInt,
    }),

    facilities: z.array(z.number()).optional(),

    blockRangeList: z
      .array(
        z.object({
          start: z.string(), // YYYY-MM-DD
          end: z.string(),
        })
      )
      .optional(),

    images: z.any().superRefine((files, ctx) => {
      if (typeof window === 'undefined') return;

      if (!files || !(files instanceof FileList) || files.length === 0) {
        ctx.addIssue({ code: 'custom', message: e.imagesMin });
        return;
      }
      if (files.length > 10) {
        ctx.addIssue({ code: 'custom', message: e.imagesMax });
      }

      const fileList = Array.from(files) as File[];

      if (!fileList.every((file) => file.size <= MAX_FILE_SIZE)) {
        ctx.addIssue({ code: 'custom', message: e.fileSizeMax });
      }

      if (!fileList.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type))) {
        ctx.addIssue({ code: 'custom', message: e.fileType });
      }
    }),
  });
};

export type CreateStayInput = z.infer<ReturnType<typeof buildCreateStayInputSchema>>;
