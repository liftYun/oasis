'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import Image from 'next/image';
import ZoomIn from '@/assets/icons/zoom-in.png';
import type { KeyResponseDto } from '@/services/smartKey.types';
import type { ReservationDetailApiResponse } from '@/services/reservation.types';
import type { HostInfoResponseDto } from '@/services/stay.types';
import { createChatRoom, findExistingChatRoom } from '@/features/chat/api/chat.firestore';
import { notifyFirebaseUnavailable } from '@/features/chat/api/toastHelpers';
import { useAuthStore } from '@/stores/useAuthStores';
import { toast } from 'react-hot-toast';
import { messages } from '@/features/smart-key/locale';

interface Props {
  keyData: KeyResponseDto;
  reservationDetail: ReservationDetailApiResponse | null;
  lang: 'kor' | 'eng';
}

export function SmartKeyCardInfo({ keyData, reservationDetail, lang }: Props) {
  const router = useRouter();
  const { uuid: myUid, profileUrl: myProfileUrl, initialized } = useAuthStore();
  const [startingChat, setStartingChat] = useState(false);
  const t = messages[lang] ?? messages.kor;

  const handleChatStart = async (host?: HostInfoResponseDto) => {
    if (startingChat) return;
    if (!initialized) {
      toast('로그인을 확인 중입니다.');
      return;
    }
    if (!myUid) {
      toast.error('로그인이 필요합니다.');
      router.push('/register');
      return;
    }
    if (!reservationDetail?.stay) {
      toast.error('숙소 정보를 불러오지 못했습니다.');
      return;
    }
    if (!host?.uuid) {
      toast.error('유효하지 않은 호스트 정보입니다.');
      return;
    }

    setStartingChat(true);
    try {
      const stayId = reservationDetail.stay.stayId;
      const existingId = await findExistingChatRoom(myUid, host.uuid, stayId);
      const chatId =
        existingId ||
        (await createChatRoom({
          myUid,
          myProfileUrl,
          hostUid: host.uuid,
          hostProfileUrl: host.url ?? '',
          stayId,
        }));

      await router.push(`/chat/${encodeURIComponent(chatId)}` as unknown as Route);
    } catch (e) {
      console.error('채팅방 처리 실패:', e);
      notifyFirebaseUnavailable(lang as any);
      toast.error('채팅방 입장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setStartingChat(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex bg-gray-100 rounded-md overflow-hidden">
        <div className="w-28 aspect-square">
          <img src={keyData.thumbnailUrl ?? ''} className="w-full h-full object-cover rounded-md" />
        </div>
        <div className="flex-1 p-5 flex flex-col justify-center gap-2">
          <h3 className="font-semibold text-gray-600">{keyData.stayName}</h3>
          <p className="text-xs text-gray-600">{keyData.addressLine}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/reservation-detail/${keyData.reservationId}` as unknown as Route);
            }}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            <Image src={ZoomIn} alt="zoom" width={12} height={12} />
            {t.card.seeMore}
          </button>
        </div>
      </div>

      <div className="flex justify-between mt-4 text-sm bg-gray-100 rounded-md p-6">
        <div className="text-left flex-1">
          <p className="text-gray-600 mb-1 font-semibold text-xs">{t.card.activationTime}</p>
          <p className="font-semibold mb-1">
            {keyData.activationTime
              ? new Date(keyData.activationTime).toLocaleDateString('ko-KR', {
                  year: '2-digit',
                  month: '2-digit',
                  day: '2-digit',
                  weekday: 'short',
                })
              : '-'}
          </p>
          <p className="text-xs text-gray-400">
            {keyData.activationTime
              ? new Date(keyData.activationTime).toLocaleTimeString('ko-KR', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
              : ''}
          </p>
        </div>

        <div className="w-px bg-gray-200"></div>

        <div className="text-right flex-1">
          <p className="text-gray-600 mb-1 font-semibold text-xs">{t.card.expirationTime}</p>
          <p className="font-semibold mb-1">
            {keyData.expirationTime
              ? new Date(keyData.expirationTime).toLocaleDateString('ko-KR', {
                  year: '2-digit',
                  month: '2-digit',
                  day: '2-digit',
                  weekday: 'short',
                })
              : '-'}
          </p>
          <p className="text-xs text-gray-400">
            {keyData.expirationTime
              ? new Date(keyData.expirationTime).toLocaleTimeString('ko-KR', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
              : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 bg-gray-100 rounded-md p-4">
        {reservationDetail?.host?.profileImageUrl ? (
          <img
            src={reservationDetail.host.profileImageUrl}
            alt={reservationDetail.host.nickname}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-200" />
        )}
        <div>
          <p className="text-xs text-primary rounded-full px-2 py-0.5 bg-primary/10 mb-1">
            {t.card.host}
          </p>
          <p className="text-sm font-medium text-gray-600 text-center">
            {reservationDetail?.host?.nickname ?? '-'}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleChatStart(reservationDetail?.host);
        }}
        disabled={startingChat}
        className="mt-4 w-full rounded-md py-3 text-sm font-medium text-gray-600 transition"
        style={{ background: 'linear-gradient(to right, #dbeafe, #fef9c3)' }}
      >
        {t.host.chatStart}
      </button>
    </div>
  );
}
