'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Label } from '@/components/atoms/label';
import { Button } from '@/components/atoms/Button';
import { X } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cameraIcon from '@/assets/icons/camera.png';
import { getPresignedUrls } from '@/services/stay.api';
import type { PresignedRequest, PresignedResponse } from '@/services/stay.types';

type ExistingImage = {
  key: string;
  sortOrder: number;
  publicUrl: string;
  isNew: false;
};

type NewImage = PresignedResponse & { isNew: true };

type ImageItem = ExistingImage | NewImage;

interface ImageUploaderProps {
  defaultImages?: { key: string; sortOrder: number; url?: string }[];
  onChange: (images: { key: string; sortOrder: number }[]) => void;
}

export function ImageUploader_Edit({ defaultImages = [], onChange }: ImageUploaderProps) {
  const { lang } = useLanguage();
  const t = createStayMessages[lang];
  const sensors = useSensors(useSensor(PointerSensor));

  const [images, setImages] = useState<ImageItem[]>([]);
  const didInitRef = useRef(false);

  const resolvePublicUrl = (key: string, url?: string) => {
    // 서버가 url을 주면 그걸 반드시 사용
    if (url && /^https?:\/\//.test(url)) return url;
    // key가 이미 풀 URL이면 그대로
    if (/^https?:\/\//.test(key)) return key;
    // 절대 key만으로 미리보기 만들지 마세요(브라우저에서 못 엽니다).
    // 필요시 NEXT_PUBLIC_CDN_BASE를 이용해 조합:
    const CDN = process.env.NEXT_PUBLIC_CDN_BASE; // 예: https://cdn.stay-oasis.kr/
    return CDN ? `${CDN.replace(/\/$/, '')}/${key}` : key;
  };

  // 👉 초기 로딩 시에만 defaultImages → state
  useEffect(() => {
    if (didInitRef.current) return;
    if (!defaultImages?.length) return;

    // const resolvePublicUrl = (key: string, url?: string) => {
    //   if (url && /^https?:\/\//.test(url)) return url;
    //   if (/^https?:\/\//.test(key)) return key;
    //   return key; // 필요하면 CDN prefix 붙여도 됨
    // };

    const mapped: ExistingImage[] = [...defaultImages]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((img) => ({
        key: img.key,
        sortOrder: img.sortOrder ?? 0,
        publicUrl: resolvePublicUrl(img.key, img.url),
        isNew: false,
      }));

    setImages(mapped);
    didInitRef.current = true;
  }, [defaultImages]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((p) => p.key === active.id);
    const newIndex = images.findIndex((p) => p.key === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const newOrder = arrayMove(images, oldIndex, newIndex).map((img, i) => ({
      ...img,
      sortOrder: i + 1,
    }));
    setImages(newOrder);
    onChange(newOrder.map(({ key, sortOrder }) => ({ key, sortOrder })));
  };

  const handleFileSelect = async (files: File[]) => {
    if (!files.length) return;

    try {
      const presignReq: PresignedRequest[] = files.map((f, i) => ({
        sortOrder: images.length + i + 1,
        contentType: f.type,
      }));
      const res = await getPresignedUrls(presignReq);

      await Promise.all(
        res.result.map(async (p, i) => {
          await fetch(p.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': files[i].type },
            body: files[i],
          });
        })
      );

      const newImages: NewImage[] = res.result.map((p, i) => ({
        ...p,
        sortOrder: images.length + i + 1,
        isNew: true,
      }));

      const merged = [...images, ...newImages].map((img, i) => ({
        ...img,
        sortOrder: i + 1,
      }));
      setImages(merged);
      onChange(merged.map(({ key, sortOrder }) => ({ key, sortOrder })));
    } catch (err) {
      console.error(err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  const removeImage = (index: number) => {
    const filtered = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, sortOrder: i + 1 }));
    setImages(filtered);
    onChange(filtered.map(({ key, sortOrder }) => ({ key, sortOrder })));
  };

  return (
    <div className="flex flex-col items-start gap-2 overflow-x-auto scrollbar-hide">
      <Label>{t.form.imagesLabel}</Label>
      <div className="bg-primary/10 text-primary text-xs p-2 rounded-md">
        <span className="text-primary font-bold">{t.form.imagesTipTitle}</span>{' '}
        {t.form.imagesTipText}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={images.map((img) => img.key)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-4 overflow-x-auto flex-nowrap w-full">
            {images.map((img, index) => (
              <SortableItem
                key={img.key}
                id={img.key}
                index={index}
                preview={img.publicUrl}
                onRemove={() => removeImage(index)}
                alt={`${t.form.imagesPreviewAlt} ${index + 1}`}
              />
            ))}

            {images.length < 10 && (
              <label
                htmlFor="stay-photo-input"
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
              </label>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <input
        id="stay-photo-input"
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          handleFileSelect(files);
        }}
      />
    </div>
  );
}

function SortableItem({
  id,
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
