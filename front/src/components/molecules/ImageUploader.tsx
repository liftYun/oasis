// components/molecules/ImageUploader.tsx
'use client';

import Image from 'next/image';
import { Label } from '@/components/atoms/label';
import cameraIcon from '@/assets/icons/camera.png';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { X } from 'lucide-react';

interface ImageUploaderProps {
  registration: UseFormRegisterReturn;
  error?: { message?: string };
  accept?: string;
  imagePreviews: string[];
  onRemoveImage: (index: number) => void;
}

export function ImageUploader({
  registration,
  error,
  accept = 'image/*',
  imagePreviews,
  onRemoveImage,
}: ImageUploaderProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label>숙소 사진</Label>
      <div className="bg-primary/10 text-primary text-xs p-2 rounded-md">
        <span className="text-primary font-bold">TIP</span> 첫 사진은 숙소가 잘 보이게
        업로드해주세요.
      </div>

      <div className="flex flex-wrap gap-4">
        {imagePreviews.map((preview, index) => (
          <div key={preview} className="relative w-40 h-40">
            <Image
              src={preview}
              alt={`숙소 이미지 미리보기 ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <Button
              type="button"
              onClick={() => onRemoveImage(index)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 p-1 flex items-center justify-center hover:bg-black/70"
              aria-label="이미지 삭제"
            >
              <X size={16} />
            </Button>
          </div>
        ))}

        <Label
          htmlFor={registration.name}
          className="flex flex-col items-center justify-center w-40 h-40 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Image src={cameraIcon} alt="카메라 아이콘" width={30} height={30} className="mb-1" />
          <p className="text-[11px] text-gray-300 mt-3">사진 업로드</p>
        </Label>
      </div>

      <input
        type="file"
        id={registration.name}
        {...registration}
        multiple
        className="hidden"
        accept={accept}
      />
      {error?.message && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
