'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Star } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ZoomIn from '@/assets/icons/zoom-in.png';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { registReview } from '@/services/reservation.api';
import { toast } from 'react-hot-toast';

type ReviewBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  reservationId: string;
  stayId: number;
  stayTitle: string;
  addressLine: string;
  thumbnail?: string | null;
};

export function ReviewBottomSheet({
  open,
  onClose,
  reservationId,
  stayId,
  stayTitle,
  addressLine,
  thumbnail,
}: ReviewBottomSheetProps) {
  const { lang } = useLanguage();
  const t = profileMessages[lang];

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('별점을 선택해주세요');
      return;
    }
    setLoading(true);
    try {
      await registReview({
        reservationId,
        rating,
        originalContent: text.trim() || undefined,
      });
      toast.success('리뷰가 등록되었어요!');
      onClose();
      setRating(0);
      setText('');
    } catch (err: any) {
      toast.error(err?.message || '리뷰 등록 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={t.writeReview}>
      <div className="flex items-center gap-4 rounded-md bg-gray-50 pr-5 shadow-sm overflow-hidden">
        <div className="w-28 h-28 overflow-hidden shrink-0">
          <Image
            src={thumbnail || '/images/default-room.jpg'}
            alt={stayTitle}
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        <div className="flex flex-col flex-1 py-5 pl-3">
          <h4 className="font-semibold text-gray-800 leading-tight">{stayTitle}</h4>
          <p className="mt-1 text-sm text-gray-500 leading-snug">{addressLine}</p>
          <button
            className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            onClick={() => router.push(`/stays/${stayId}`)}
          >
            <Image src={ZoomIn} alt="zoom" width={12} height={12} />
            자세히 보기
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center rounded-md bg-gray-50 p-4">
        <svg width="0" height="0">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#FBE264" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex space-x-1 flex-grow">
          {[0, 1, 2, 3, 4].map((i) => {
            const full = i + 1;
            const half = i + 0.5;
            const current = hover || rating;
            let fill = 'none';
            if (current >= full) fill = '#FBE264';
            else if (current >= half) fill = 'url(#half)';

            return (
              <div key={i} className="relative w-5 h-5">
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 w-1/2"
                  onClick={() => setRating(half)}
                  onMouseEnter={() => setHover(half)}
                  onMouseLeave={() => setHover(0)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 w-1/2"
                  onClick={() => setRating(full)}
                  onMouseEnter={() => setHover(full)}
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

        {/* 오른쪽: 숫자 */}
        <span className="ml-auto text-sm font-medium text-gray-600 bg-yellow/60 py-1 px-3 rounded-full">
          {rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-4">
        <textarea
          className="w-full rounded-md border border-gray-200 p-3 text-sm resize-none
              focus:outline-none focus:border-yellow placeholder-gray-300"
          rows={8}
          maxLength={1000}
          placeholder={t.writeReviewDescription}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          <span className="text-yellow">{text.length}</span> / 1000
        </div>
      </div>

      <Button variant="default" className="mt-3" onClick={handleSubmit} disabled={loading}>
        {t.uploadReview}
      </Button>
    </BottomSheet>
  );
}
