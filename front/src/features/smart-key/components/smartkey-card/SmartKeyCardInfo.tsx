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

  const stayName = lang === 'kor' ? keyData.stayName : keyData.stayNameEng || keyData.stayName;
  const stayAddressRaw =
    lang === 'kor' ? keyData.addressLine : keyData.addressLineEng || keyData.addressLine;

  const stayAddress =
    stayAddressRaw && stayAddressRaw.length > 20
      ? stayAddressRaw.slice(0, 25) + '...'
      : stayAddressRaw;
  const locale = lang === 'kor' ? 'ko-KR' : 'en-US';

  const formatDate = (isoDate?: string | null) => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    return date.toLocaleDateString(locale, {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
  };

  const formatTime = (isoDate?: string | null) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleChatStart = async (host?: HostInfoResponseDto) => {
    if (startingChat) return;
    if (!initialized) {
      toast(t.toast.checkingLogin);
      return;
    }
    if (!myUid) {
      toast.error(t.toast.needLogin);
      router.push('/register');
      return;
    }
    if (!reservationDetail?.stay) {
      toast.error(t.toast.noStay);
      return;
    }
    if (!host?.uuid) {
      toast.error(t.toast.invalidHost);
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
      toast.error(t.toast.chatEnterFailed);
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
          <h3 className="font-semibold text-gray-600">{stayName}</h3>
          <p className="text-xs text-gray-600">{stayAddress}</p>
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
          <p className="font-semibold mb-1">{formatDate(keyData.activationTime)}</p>
          <p className="text-xs text-gray-400">{formatTime(keyData.activationTime)}</p>
        </div>

        <div className="w-px bg-gray-200"></div>

        <div className="text-right flex-1">
          <p className="text-gray-600 mb-1 font-semibold text-xs">{t.card.expirationTime}</p>
          <p className="font-semibold mb-1">{formatDate(keyData.expirationTime)}</p>
          <p className="text-xs text-gray-400">{formatTime(keyData.expirationTime)}</p>
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
