import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// 숙소 생성 시 입력 받을 데이터에 대한 설정(스키마)
export const createStayInputSchema = z.object({
  title: z
    .string()
    .min(1, '숙소 이름을 입력해주세요.')
    .max(20, '숙소 이름은 20자 이내로 입력해주세요.'),
  postalCode: z.string().min(1, '주소를 검색해주세요.'),
  address: z.string().min(1, '주소를 검색해주세요.'),
  addressDetail: z.string(),
  price: z
    .number({
      error: '가격을 숫자로 입력해주세요.',
    })
    .positive('가격은 0보다 커야 합니다.')
    .refine((val) => Number.isFinite(val), {
      message: '유효한 숫자를 입력해주세요.',
    })
    .refine(
      (val) => {
        const decimalPlaces = (val.toString().split('.')[1] || '').length;
        return decimalPlaces <= 2;
      },
      { message: '가격은 소수점 둘째자리까지만 입력 가능합니다.' }
    ),
  images: z.any().superRefine((files, ctx) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!files || !(files instanceof FileList) || files.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: '사진을 1장 이상 등록해주세요.',
      });
      return;
    }

    if (files.length > 10) {
      ctx.addIssue({
        code: 'custom',
        message: '사진은 최대 10장까지 등록할 수 있습니다.',
      });
    }

    const fileList = Array.from(files) as File[];

    if (!fileList.every((file) => file.size <= MAX_FILE_SIZE)) {
      ctx.addIssue({
        code: 'custom',
        message: `파일 크기는 5MB를 초과할 수 없습니다.`,
      });
    }

    if (!fileList.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type))) {
      ctx.addIssue({
        code: 'custom',
        message: '.jpg, .jpeg, .png, .webp 파일만 지원합니다.',
      });
    }
  }),
});

export type CreateStayInput = z.infer<typeof createStayInputSchema>;

export type CreateStayOutput = CreateStayInput & {
  address_line: string;
};
