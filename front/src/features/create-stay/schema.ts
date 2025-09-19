import { z } from 'zod';
import { createStayMessages } from '@/features/create-stay/locale';
import type { Lang } from '@/types/lang';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const buildCreateStayInputSchema = (lang: Lang) => {
  const e = createStayMessages[lang].errors;

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
    // Step1에서 사용하는 필드만 필수
    title: nonEmpty(e.titleRequired).max(20, e.titleMax),
    address: nonEmpty(e.addressRequired),
    price: toNumber({
      typeMsg: e.priceType,
      positiveMsg: e.pricePositive,
      maxDecimals: 2,
      decimalMsg: e.priceDecimal,
    }).optional(),
    imageRequestList: z
      .array(
        z.object({
          key: z.string(),
          sortOrder: z.number(),
        })
      )
      .min(1, e.imagesMin),

    // Step2 이후에 받을 필드들은 optional 처리
    subRegionId: toNumber({ typeMsg: e.subRegionRequired }).optional(),
    titleEng: z.string().max(50, e.titleEngMax).optional(),
    description: z.string().optional(),
    descriptionEng: z.string().optional(),
    addressEng: z.string().optional(),
    addressDetail: z.string().optional(),
    addressDetailEng: z.string().optional(),
    postalCode: z.string().optional(),
    maxGuest: toNumber({
      typeMsg: e.maxGuestType,
      positiveMsg: e.maxGuestPositive,
      intMsg: e.maxGuestInt,
    }).optional(),
    facilities: z.array(z.number()).optional(),
    blockRangeList: z
      .array(
        z.object({
          start: z.string(), // YYYY-MM-DD
          end: z.string(),
        })
      )
      .optional(),
    images: z.any().optional(),
  });
};

export type CreateStayInput = z.infer<ReturnType<typeof buildCreateStayInputSchema>>;
export type CreateStayOutput = CreateStayInput & { address_line: string };
