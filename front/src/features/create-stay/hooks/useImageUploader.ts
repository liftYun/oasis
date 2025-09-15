import { useState, useEffect } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { CreateStayInput } from '@/features/create-stay/schema';

interface UseImageUploaderProps {
  watch: UseFormWatch<CreateStayInput>;
  setValue: UseFormSetValue<CreateStayInput>;
}

export function useImageUploader({ watch, setValue }: UseImageUploaderProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const images = watch('images') as FileList | null | undefined;

  useEffect(() => {
    if (images && images.length > 0) {
      const newPreviews = Array.from(images).map((file) => URL.createObjectURL(file));
      setImagePreviews(newPreviews);

      // Clean up object URLs on component unmount or when images change
      return () => {
        newPreviews.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setImagePreviews([]);
    }
  }, [images]);

  const handleRemoveImage = (indexToRemove: number) => {
    const currentFiles = watch('images') as FileList | null | undefined;
    if (!currentFiles) return;

    const updatedFiles = Array.from(currentFiles).filter((_, index) => index !== indexToRemove);

    // FileList를 다시 생성하기 위한 DataTransfer 객체 활용
    const dataTransfer = new DataTransfer();
    updatedFiles.forEach((file) => dataTransfer.items.add(file));

    setValue('images', dataTransfer.files, { shouldValidate: true });
  };

  return {
    imagePreviews,
    handleRemoveImage,
  };
}
