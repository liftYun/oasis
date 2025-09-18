'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Star } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image';
import TestRoom from '@/assets/images/test-room.jpeg';
import ZoomIn from '@/assets/icons/zoom-in.png';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';

type ReviewBottomSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function ReviewBottomSheet({ open, onClose }: ReviewBottomSheetProps) {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');

  return (
    <BottomSheet open={open} onClose={onClose} title={t.writeReview}>
      <div className="flex items-center gap-4 rounded-md bg-gray-50 pr-5 shadow-sm overflow-hidden">
        <div className="w-28 h-28 overflow-hidden shrink-0">
          <Image
            src={TestRoom}
            alt="장소 사진"
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        <div className="flex flex-col flex-1 py-5 pl-3">
          <h4 className="font-semibold text-gray-800 leading-tight">광안 바이브</h4>
          <p className="mt-1 text-sm text-gray-500 leading-snug">
            부산 수영구 민락수변로 7 6층 601호
          </p>

          <button className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition w-fit">
            <Image
              src={ZoomIn}
              alt="zoom in"
              width={12}
              height={12}
              className="opacity-60 group-hover:opacity-100 transition"
            />
            자세히 보기
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-md bg-gray-50 p-4">
        <svg className="absolute w-0 h-0">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#FBE264" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex space-x-1">
          <svg className="absolute w-0 h-0">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#FBE264" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>

          {[0, 1, 2, 3, 4].map((i) => {
            const fullValue = i + 1;
            const halfValue = i + 0.5;
            const current = hover || rating;

            let fill = 'none';
            if (current >= fullValue) fill = '#FBE264';
            else if (current >= halfValue) fill = 'url(#half)';

            return (
              <div key={i} className="relative">
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 w-1/2"
                  onClick={() => setRating(halfValue)}
                  onMouseEnter={() => setHover(halfValue)}
                  onMouseLeave={() => setHover(0)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 w-1/2"
                  onClick={() => setRating(fullValue)}
                  onMouseEnter={() => setHover(fullValue)}
                  onMouseLeave={() => setHover(0)}
                />
                <Star
                  size={20}
                  strokeWidth={1.5}
                  className="pointer-events-none"
                  color="#FBE264"
                  fill={fill}
                />
              </div>
            );
          })}
        </div>
        <span className="ml-2 text-sm font-medium text-gray-600 bg-yellow/60 py-1 px-3 rounded-full">
          {rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-4">
        <textarea
          className="w-full rounded-md border border-gray-200 p-3 text-sm resize-none
             focus:outline-none focus:border-yellow placeholder-gray-300"
          rows={10}
          maxLength={1000}
          placeholder={t.writeReviewDescription}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          <span className="text-yellow">{text.length}</span> / 1000
        </div>
      </div>

      <Button variant="default" className="mt-3" onClick={onClose}>
        {t.uploadReview}
      </Button>
    </BottomSheet>
  );
}
