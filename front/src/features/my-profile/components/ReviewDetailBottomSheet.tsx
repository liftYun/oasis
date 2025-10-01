'use client';

import { useEffect, useState } from 'react';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Star } from 'lucide-react';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import { getMyReviewDetail } from '@/services/user.api';
import { fetchReservationDetail } from '@/services/reservation.api';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import Marker from '@/assets/icons/marker.png';
import Calender from '@/assets/icons/calender.png';

type ReviewBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  reviewId: number;
  reservationId?: string;
};

type ReservationCard = {
  stayId: number;
  title: string;
  address?: string;
  checkIn: string;
  checkOut: string;
  thumbnail: string;
  reservationId: string;
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

        setRating(detail.rating);
        setText(detail.content);
        setCreatedAt(detail.createdAt);

        if (detail.reservationId) {
          const reservationRes = await fetchReservationDetail(detail.reservationId);
          const r = reservationRes.result;

          setReservation({
            stayId: r?.stay.stayId ?? 0,
            title: lang === 'kor' ? (r?.stay.title ?? '') : (r?.stay.titleEng ?? ''),
            address: lang === 'kor' ? (r?.stay.addressLine ?? '') : (r?.stay.addressLineEng ?? ''),
            checkIn: r?.schedule.checkinDate ?? '',
            checkOut: r?.schedule.checkoutDate ?? '',
            thumbnail: r?.stay.photos?.[0] ?? '',
            reservationId: detail?.reservationId ?? '',
          });
        }
      } catch (err) {
        console.error(t.loadingError, err);
      }
    };

    fetchReviewDetail();
  }, [reviewId, lang, t.loadingError]);

  return (
    <BottomSheet open={open} onClose={onClose} title={t.reviewDetail}>
      {reservation && (
        <div className="flex bg-gray-100 rounded-md">
          <div className="relative w-36 h-36 flex-shrink-0">
            <Image
              src={reservation.thumbnail}
              alt={reservation.title}
              fill
              className="object-cover rounded-md"
            />
          </div>

          <Link
            href={`/reservation-detail/${reservation.reservationId}` as Route}
            className="flex flex-col justify-center px-5 py-3 flex-1 gap-2 cursor-pointer"
          >
            <div className="flex justify-between">
              <h2 className="font-semibold text-gray-600">{reservation.title}</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Image src={Marker} alt="marker" width={14} height={14} className="shrink-0" />
              <span className="truncate">
                {reservation.address && reservation.address.length > 12
                  ? `${reservation.address.slice(0, 12)}...`
                  : reservation.address}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Image src={Calender} alt="calender" width={14} height={14} className="shrink-0" />
              <span>{new Date(reservation.checkIn).toLocaleDateString()}</span>
              <span>~</span>
              <span>{new Date(reservation.checkOut).toLocaleDateString()}</span>
            </div>
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between rounded-md mt-5 bg-gray-100 p-4">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const full = i + 1 <= Math.floor(rating);
            const half = i + 1 === Math.ceil(rating) && rating % 1 >= 0.5;

            return (
              <div key={i} className="relative w-4 h-4">
                <Star className="text-white fill-white" size={18} />
                {full && (
                  <Star className="absolute top-0 left-0 text-yellow fill-yellow" size={18} />
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
        <span className="px-3 py-0.5 rounded-full bg-yellow/30 text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-5 rounded-md border border-gray-200 bg-white p-4 text-base text-gray-600 whitespace-pre-line leading-relaxed">
        {text || <span className="text-gray-400">{t.noReview}</span>}
      </div>

      <div className="mt-2 pb-10 text-xs text-gray-400 text-right">
        {createdAt && new Date(createdAt).toLocaleString(lang)}
      </div>
    </BottomSheet>
  );
}
