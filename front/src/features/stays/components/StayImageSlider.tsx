'use client';

import Image from 'next/image';

export function StayImageSlider({ images }: { images: string[] }) {
  return (
    <div className="relative w-full h-64 overflow-hidden rounded-xl">
      {images?.length > 0 ? (
        <Image src={images[0]} alt="Stay Image" fill className="object-cover" priority />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
    </div>
  );
}
