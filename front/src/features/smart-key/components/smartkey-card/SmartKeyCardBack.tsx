'use client';

import { useEffect, useState } from 'react';
import type { KeyResponseDto } from '@/services/smartKey.types';
import type { ReservationDetailApiResponse } from '@/services/reservation.types';
import { fetchReservationDetail } from '@/services/reservation.api';
import { SmartKeyCardInfo } from './SmartKeyCardInfo';

interface Props {
  keyData: KeyResponseDto;
  lang: 'kor' | 'eng';
}

export function SmartKeyCardBack({ keyData, lang }: Props) {
  const [reservationDetail, setReservationDetail] = useState<ReservationDetailApiResponse | null>(
    null
  );

  useEffect(() => {
    if (keyData.reservationId) {
      fetchReservationDetail(String(keyData.reservationId))
        .then((res) => {
          if (res.code === 200 && res.result) setReservationDetail(res.result);
        })
        .catch((err) => console.error('예약 상세 조회 실패:', err));
    }
  }, [keyData.reservationId]);

  return (
    <div
      className="absolute inset-0 rounded-xl bg-white border p-4 flex flex-col shadow-sm"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
      }}
    >
      <SmartKeyCardInfo keyData={keyData} reservationDetail={reservationDetail} lang={lang} />
    </div>
  );
}
