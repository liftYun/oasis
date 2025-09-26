'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMyReviews } from '@/services/user.api';
import type { ReviewResponseVo } from '@/services/user.types';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { ReviewDetailBottomSheet } from '@/features/my-profile/components/ReviewDetailBottomSheet';
import { Lottie } from '@/components/atoms/Lottie';
import Search from '@/assets/icons/zoom-in.png';
import { useAuthStore } from '@/stores/useAuthStores';
import { useRouter } from 'next/navigation';

export function Reviews() {
  const [reviews, setReviews] = useState<ReviewResponseVo[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewResponseVo | null>(null);

  const { profileUrl, nickname } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getMyReviews();
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
      <div className="flex flex-col min-h-screen items-center justify-center p-4 pb-56">
        <Lottie src="/lotties/spinner.json" className="w-20 h-20" />
        <p className="mt-2 text-center text-gray-500">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-6 py-10 min-h-screen">
      <BackHeader title={t.myReview} />

      {reviews.length === 0 ? (
        <div className="flex flex-col flex-1 items-center justify-center p-4 pb-56">
          <Lottie src="/lotties/empty.json" className="w-100 h-40" />
          <p className="mt-4 text-center text-gray-500">{t.noReviews}</p>
        </div>
      ) : (
        <>
          <div className="mt-6 mb-8 flex items-center gap-4 bg-gradient-to-r from-[#dbeafe] to-[#e0f2f1] p-4 rounded-md">
            <button
              onClick={() => router.push('/my-profile')}
              className="p-[3px] rounded-full bg-gradient-to-r from-primary to-green hover:opacity-90 transition"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white">
                <Image
                  src={profileUrl ?? '/images/default-profile.png'}
                  alt="profile"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
            </button>

            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {nickname
                  ? `${nickname} ${lang === 'kor' ? '님의 리뷰' : `'s Reviews`}`
                  : t.myReview}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {reviews.length} {lang === 'kor' ? '개의 리뷰' : 'reviews'}
              </p>
            </div>
          </div>

          <div className="space-y-8 mb-20">
            {reviews.map((item) => (
              <div
                key={item.reviewId}
                className="relative rounded-md overflow-hidden shadow-sm bg-gray-100 hover:scale-105 transition-transform duration-300 ease-in-out"
                onClick={() => {
                  setSelectedReview(item);
                  setOpen(true);
                }}
              >
                <div className="flex">
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <Image
                      src={item.thumbnail}
                      alt={`리뷰 ${item.reviewId}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex flex-col justify-center px-5 py-3 flex-1 gap-2">
                    <h2 className="font-semibold text-gray-600">
                      {item.title ?? '예약 정보 없음'}
                    </h2>

                    <div className="flex items-center justify-between">
                      <div className="flex text-yellow gap-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const full = i + 1 <= Math.floor(item.rating);
                          const half = i + 1 === Math.ceil(item.rating) && item.rating % 1 >= 0.5;

                          return (
                            <div key={i} className="relative w-4 h-4">
                              <Star className="text-white fill-white" size={18} />
                              {full && (
                                <Star
                                  className="text-yellow fill-yellow absolute top-0 left-0"
                                  size={18}
                                />
                              )}
                              {half && (
                                <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                                  <Star className="text-yellow fill-yellow" size={18} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span className="px-3 py-0.5 rounded-full bg-yellow/30 text-gray-600 font-medium text-sm">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    <button className="flex items-center gap-2 text-sm text-gray-500">
                      <Image
                        src={Search}
                        alt="search icon"
                        width={14}
                        height={14}
                        className="shrink-0"
                      />
                      <span>{t.reviewDetail}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ReviewDetailBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        reviewId={selectedReview?.reviewId ?? 0}
        reservationId={selectedReview?.reservationId ?? ''}
      />
    </div>
  );
}
