'use client';

import { useEffect, useState } from 'react';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Star } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { getMyReviewDetail } from '@/services/user.api';
import { fetchReservationDetail } from '@/services/reservation.api';
import Image from 'next/image';

type ReviewBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  reviewId: number;
};

type ReservationCard = {
  stayId: number;
  title: string;
  address?: string;
  checkIn: string;
  checkOut: string;
  thumbnail: string;
};

export function ReviewDetailBottomSheet({ open, onClose, reviewId }: ReviewBottomSheetProps) {
  const { lang } = useLanguage();
  const t = profileMessages[lang];

  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [reservation, setReservation] = useState<ReservationCard | null>(null);

  useEffect(() => {
    if (!reviewId) return;

    const fetchReviewDetail = async () => {
      try {
        const res = await getMyReviewDetail(reviewId);
        const detail = res.result;
        console.log('detail', detail);

        setRating(detail.rating);
        setText(detail.content);
        setCreatedAt(detail.createdAt);

        if (detail.reservationId) {
          const reservationRes = await fetchReservationDetail(detail.reservationId);
          const r = reservationRes.result;
          console.log(r);

          setReservation({
            stayId: r?.stay.stayId ?? 0,
            title: r?.stay.title ?? '',
            address: r?.stay.description ?? '',
            checkIn: r?.schedule.checkinDate ?? '',
            checkOut: r?.schedule.checkoutDate ?? '',
            thumbnail: r?.stay.photos?.[0] ?? '',
          });
        }
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err);
      }
    };

    fetchReviewDetail();
  }, [reviewId]);

  return (
    <BottomSheet open={open} onClose={onClose} title={t.reviewDetail}>
      {reservation && (
        <div className="flex items-center gap-4 rounded-md bg-gray-50 p-4 shadow-sm">
          <div className="w-28 h-28 shrink-0 overflow-hidden rounded-md">
            <Image
              src={reservation.thumbnail}
              alt={reservation.title}
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col flex-1">
            <h4 className="font-semibold text-gray-800">{reservation.title}</h4>
            <p className="mt-1 text-sm text-gray-500">{reservation.address || '-'}</p>
            <p className="mt-2 text-xs text-gray-400">
              {new Date(reservation.checkIn).toLocaleDateString()} ~{' '}
              {new Date(reservation.checkOut).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

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
            let fill = 'none';
            if (rating >= full) fill = '#FBE264';
            else if (rating >= half) fill = 'url(#half)';

            return (
              <Star
                key={i}
                size={20}
                strokeWidth={1.5}
                className="pointer-events-none"
                color="#FBE264"
                fill={fill}
              />
            );
          })}
        </div>

        <span className="ml-auto text-sm font-medium text-gray-600 bg-yellow/60 py-1 px-3 rounded-full">
          {rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-4 rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-700 whitespace-pre-line">
        {text || <span className="text-gray-400">{t.noReview}</span>}
      </div>

      <div className="mt-2 text-xs text-gray-400 text-right">
        {createdAt && new Date(createdAt).toLocaleString()}
      </div>
    </BottomSheet>
  );
}
