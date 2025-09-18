import { useState, useEffect } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { CreateStayInput } from '@/features/create-stay/schema';

interface UseImageUploaderProps {
  watch: UseFormWatch<CreateStayInput>;
  setValue: UseFormSetValue<CreateStayInput>;
}

export function useImageUploader({ watch, setValue }: UseImageUploaderProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const images = watch('images') as FileList | string[] | null | undefined;

  useEffect(() => {
    if (images && (images as any).length > 0) {
      const newPreviews = Array.from(images as any).map((item) =>
        item instanceof File ? URL.createObjectURL(item) : (item as string)
      );
      setImagePreviews(newPreviews);

      return () => {
        newPreviews.forEach((url) => {
          if (url.startsWith('blob:')) URL.revokeObjectURL(url);
        });
      };
    } else {
      setImagePreviews([]);
    }
  }, [images]);

  const handleRemoveImage = (indexToRemove: number) => {
    if (!images) return;

    const arr = Array.from(images as any);
    const updated = arr.filter((_, i) => i !== indexToRemove);

    if (updated.length > 0 && updated[0] instanceof File) {
      const dataTransfer = new DataTransfer();
      (updated as File[]).forEach((file) => dataTransfer.items.add(file));
      setValue('images', dataTransfer.files, { shouldValidate: true });
    } else {
      setValue('images', updated as string[], { shouldValidate: true });
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleReorder = (newOrder: string[]) => {
    if (!images) return;

    const arr = Array.from(images as any);
    const ordered = newOrder
      .map((url) => {
        const idx = imagePreviews.findIndex((prev) => prev === url);
        return arr[idx];
      })
      .filter(Boolean);

    if (ordered.length > 0 && ordered[0] instanceof File) {
      const dataTransfer = new DataTransfer();
      (ordered as File[]).forEach((file) => dataTransfer.items.add(file));
      setValue('images', dataTransfer.files, { shouldValidate: true });
    } else {
      setValue('images', ordered as string[], { shouldValidate: true });
    }

    setImagePreviews(newOrder);
  };

  return {
    imagePreviews,
    handleRemoveImage,
    handleReorder,
  };
}
