'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Props {
  photos: { url: string }[];
  title: string;
}

export default function StayImageSlider({ photos, title }: Props) {
  const [current, setCurrent] = useState(1);
  if (!photos || photos.length === 0) return null;

  return (
    <div className="relative w-full mx-auto mb-6">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="w-full"
        onSlideChange={(swiper) => setCurrent(swiper.activeIndex + 1)}
      >
        {photos.map((photo, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full aspect-[12/8] overflow-hidden">
              <Image
                src={photo.url}
                alt={`${title} - ${idx + 1}`}
                fill
                className="object-cover"
                priority={idx === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="z-10 absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
        {current} / {photos.length}
      </div>
    </div>
  );
}
