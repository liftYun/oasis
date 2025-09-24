'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { useEffect, useState } from 'react';
import { Star, ClipboardList } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BackHeader from '@/components/molecules/BackHeader';
import { useLanguage } from '@/features/language';
import { profileMessages } from '@/features/my-profile';
import Marker from '@/assets/icons/marker.png';
import Calender from '@/assets/icons/calender.png';
import { ReviewBottomSheet } from '@/features/my-profile';
import { fetchReservations } from '@/services/reservation.api';
import { ReservationResponseDto } from '@/services/reservation.types';
import { Lottie } from '@/components/atoms/Lottie';

export function Reservations() {
  const { lang } = useLanguage();
  const t = profileMessages[lang];
  const locale = lang === 'kor' ? 'ko-KR' : 'en-US';

  const [reservations, setReservations] = useState<ReservationResponseDto[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [selectedStayId, setSelectedStayId] = useState<number | null>(null);
  const [selectedStayTitle, setSelectedStayTitle] = useState<string | null>(null);
  const [selectedAddressLine, setSelectedAddressLine] = useState<string | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const res = await fetchReservations();
        setReservations(res.result?.reservations ?? []);
      } catch (err) {
        console.error('예약 내역 조회 실패', err);
        toast.error(t.loadReservationsFail);
      }
    };
    loadReservations();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <BackHeader title={t.reservationHistory} />

      {reservations.length === 0 ? (
        <div className="flex flex-col flex-1 min-h-screen items-center justify-center p-4 pb-56">
          <Lottie src="/lotties/empty.json" className="w-100 h-40" />
          <p className="mt-4 text-center text-gray-500">{t.noReservation}</p>
        </div>
      ) : (
        <div className="space-y-8 pt-16 pb-10">
          {reservations.map((item) => (
            <div
              key={item.reservationId}
              className={`relative rounded-md overflow-hidden shadow-sm bg-gray-100
    ${!item.isSettlemented ? 'hover:scale-105 transition-transform duration-300 ease-in-out' : ''}`}
            >
              <div className="flex">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <Image
                    src={item.thumbnail}
                    alt={item.stayTitle}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <Link
                  href={`/reservation-detail/${item.reservationId}` as Route}
                  className="flex flex-col justify-center px-5 py-3 flex-1 gap-2 cursor-pointer"
                >
                  <div className="flex justify-between">
                    <h2 className="font-semibold text-gray-600">{item.stayTitle}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Image src={Marker} alt="marker" width={14} height={14} className="shrink-0" />
                    <span className="truncate">{item.addressLine}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Image
                      src={Calender}
                      alt="calender"
                      width={14}
                      height={14}
                      className="shrink-0"
                    />
                    <span>{new Date(item.checkinDate).toLocaleDateString(locale)}</span>
                    <span>~</span>
                    <span>{new Date(item.checkoutDate).toLocaleDateString(locale)}</span>
                  </div>
                </Link>
              </div>

              {item.isSettlemented && (
                <div className="absolute inset-0 bg-black/60 rounded-md flex flex-col items-center justify-center text-white">
                  <p className="mb-2">{t.usedStay}</p>
                  <div className="flex space-x-4">
                    {!item.isReviewed && (
                      <button
                        onClick={() => {
                          setSelectedReservationId(item.reservationId);
                          setSelectedStayId(item.stayId);
                          setSelectedStayTitle(item.stayTitle);
                          setSelectedAddressLine(item.addressLine);
                          setSelectedThumbnail(item.thumbnail);
                          setOpen(true);
                        }}
                        className="flex items-center space-x-1 text-sm"
                      >
                        <Star size={16} />
                        <span>{t.writeReview}</span>
                      </button>
                    )}
                    <Link
                      href={`/reservation-detail/${item.reservationId}` as Route}
                      className="flex items-center space-x-1 text-sm"
                    >
                      <ClipboardList size={16} />
                      <span>{t.viewDetails}</span>
                    </Link>
                  </div>
                </div>
              )}

              {item.isCanceled && (
                <div className="absolute inset-0 bg-black/60 rounded-md flex flex-col items-center justify-center text-white">
                  <p className="mb-2">취소된 예약입니다.</p>
                  <div className="flex space-x-4">
                    <Link
                      href={`/reservation-detail/${item.reservationId}` as Route}
                      className="flex items-center space-x-1 text-sm"
                    >
                      <ClipboardList size={16} />
                      <span>내역 확인하기</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ReviewBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        reservationId={selectedReservationId ?? ''}
        stayId={selectedStayId ?? 0}
        stayTitle={selectedStayTitle ?? ''}
        addressLine={selectedAddressLine ?? ''}
        thumbnail={selectedThumbnail}
      />
    </div>
  );
}
