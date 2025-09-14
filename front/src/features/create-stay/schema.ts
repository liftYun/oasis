import { z } from 'zod';
import { createStayMessages } from '@/features/create-stay/locale';
import type { Lang } from '@/types/lang';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const buildCreateStayInputSchema = (lang: Lang) => {
  const e = createStayMessages[lang].errors;
  return z.object({
    title: z.string().min(1, e.titleRequired).max(20, e.titleMax),
    postalCode: z.string().min(1, e.postalCodeRequired),
    address: z.string().min(1, e.addressRequired),
    addressDetail: z.string().min(1, e.addressDetailRequired),
    price: z
      .number({ error: e.priceType })
      .positive(e.pricePositive)
      .refine((val) => Number.isFinite(val), {
        message: e.priceInvalid,
      })
      .refine(
        (val) => {
          const decimalPlaces = (val.toString().split('.')[1] || '').length;
          return decimalPlaces <= 2;
        },
        { message: e.priceDecimal }
      ),
    images: z.any().superRefine((files, ctx) => {
      if (typeof window === 'undefined') {
        return;
      }

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

export type CreateStayOutput = CreateStayInput & {
  address_line: string;
};
