'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Label } from '@/components/atoms/label';
import cameraIcon from '@/assets/icons/camera.png';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { X } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import { toast } from 'react-hot-toast';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageUploaderProps {
  registration: UseFormRegisterReturn;
  error?: { message?: string };
  accept?: string;
  imagePreviews: string[];
  onRemoveImage: (index: number) => void;
  onReorder?: (newOrder: string[]) => void;
}

export function ImageUploader({
  registration,
  error,
  accept = 'image/*',
  imagePreviews,
  onRemoveImage,
  onReorder,
}: ImageUploaderProps) {
  const { lang } = useLanguage();
  const t = createStayMessages[lang];

  useEffect(() => {
    if (error?.message) {
      toast.error(error.message);
    }
  }, [error?.message]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = imagePreviews.findIndex((p) => p === active.id);
      const newIndex = imagePreviews.findIndex((p) => p === over.id);
      const newOrder = arrayMove(imagePreviews, oldIndex, newIndex);
      onReorder?.(newOrder);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 overflow-x-auto scrollbar-hide">
      <Label>{t.form.imagesLabel}</Label>
      <div className="bg-primary/10 text-primary text-xs p-2 rounded-md">
        <span className="text-primary font-bold">{t.form.imagesTipTitle}</span>{' '}
        {t.form.imagesTipText}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={imagePreviews} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-4 overflow-x-auto flex-nowrap w-full">
            {imagePreviews.slice(0, 10).map((preview, index) => (
              <SortableItem
                key={preview}
                id={preview}
                index={index}
                preview={preview}
                onRemove={() => onRemoveImage(index)}
                alt={`${t.form.imagesPreviewAlt} ${index + 1}`}
              />
            ))}

            {imagePreviews.length < 10 && (
              <Label
                htmlFor={registration.name}
                className="flex flex-col items-center justify-center w-40 h-40 shrink-0 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Image
                  src={cameraIcon}
                  alt="카메라 아이콘"
                  width={30}
                  height={30}
                  className="mb-1"
                />
                <p className="text-[11px] text-gray-300 mt-3">{t.form.imagesUploadCta}</p>
              </Label>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <input
        type="file"
        id={registration.name}
        multiple
        className="hidden"
        accept={accept}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);

          if (files.length > 0) {
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            registration.onChange(e);
            onReorder?.([...imagePreviews, ...newPreviews]);
          }
        }}
      />
    </div>
  );
}

function SortableItem({
  id,
  index,
  preview,
  onRemove,
  alt,
}: {
  id: string;
  index: number;
  preview: string;
  onRemove: () => void;
  alt: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative w-40 h-40 shrink-0">
      <div {...attributes} {...listeners} className="w-full h-full">
        <Image src={preview} alt={alt} fill className="object-cover rounded-lg" />
      </div>

      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onRemove?.();
        }}
        className="absolute z-50 pointer-events-auto 
                   top-1 right-1 bg-black/50 text-white rounded-full 
                   w-6 h-6 p-1 flex items-center justify-center 
                   hover:bg-black/70"
        aria-label="삭제"
      >
        <X size={16} />
      </Button>
    </div>
  );
}
