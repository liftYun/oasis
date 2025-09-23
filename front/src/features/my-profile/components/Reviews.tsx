'use client';

import Image from 'next/image';
import { Star, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMyReviews } from '@/services/user.api';
import type { ReviewResponseVo } from '@/services/user.types';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { ReviewDetailBottomSheet } from '@/features/my-profile/components/ReviewDetailBottomSheet';
import { Lottie } from '@/components/atoms/Lottie';

export function Reviews() {
  const [reviews, setReviews] = useState<ReviewResponseVo[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewResponseVo | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getMyReviews();
        console.log(res);
        setReviews(res.result ?? []);
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center p-4 pb-56">
          <Lottie src="/lotties/spinner.json" className="w-40 h-40" />
          <p className="mt-2 text-center text-gray-500">{t.loading}</p>
        </div>
      </>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col min-h-screen max-w-md mx-auto">
        <div className="p-4">
          <BackHeader title={t.myReview} />s
        </div>
        <div className="flex flex-col flex-1 items-center justify-center p-4 pb-56">
          <Lottie src="/lotties/empty.json" className="w-100 h-40" />
          <p className="mt-4 text-center text-gray-500">{t.noReviews}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <BackHeader title={t.myReview} />
      <div className="space-y-4 mt-14 mb-20">
        {reviews.map((item) => (
          <div
            key={item.reviewId}
            className="flex items-center gap-4 rounded-xl shadow-sm bg-gray-100 p-3"
          >
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={item.thumbnail}
                alt={`리뷰 ${item.reviewId}`}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col flex-1">
              <h2 className="text-gray-600 font-medium">
                {item.reservationId ?? '예약 정보 없음'}
              </h2>

              <div className="flex items-center mt-1 mb-1">
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="half">
                      <stop offset="50%" stopColor="#FBE264" />
                      <stop offset="50%" stopColor="white" />
                    </linearGradient>
                  </defs>
                </svg>

                {Array.from({ length: 5 }).map((_, i) => {
                  const full = i + 1;
                  const half = i + 0.5;
                  const current = item.rating;
                  let fill = 'white';

                  if (current >= full) fill = '#FBE264';
                  else if (current >= half) fill = 'url(#half)';

                  return (
                    <Star
                      key={i}
                      size={16}
                      strokeWidth={1.5}
                      stroke="#FBE264"
                      fill={fill}
                      className="pointer-events-none"
                    />
                  );
                })}

                <span className="ml-2 text-sm text-gray-600">{item.rating.toFixed(1)}</span>
              </div>

              <button
                className="flex items-center gap-1 text-xs text-gray-500 hover:underline"
                onClick={() => {
                  setSelectedReview(item);
                  setOpen(true);
                }}
              >
                <Search size={14} />
                <span>{t.reviewDetail}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ReviewDetailBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        reservationId={selectedReview?.reservationId ?? ''}
      />
    </div>
  );
}
