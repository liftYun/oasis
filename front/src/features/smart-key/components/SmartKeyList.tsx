'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import type { KeyResponseDto } from '@/services/smartKey.types';
import { openSmartKey } from '@/services/smartKey.api';
import { fetchReservationDetail } from '@/services/reservation.api';
import type { ReservationDetailApiResponse } from '@/services/reservation.types';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/features/language';
import { messages } from '@/features/smart-key';
import Image from 'next/image';
import ZoomIn from '@/assets/icons/zoom-in.png';
import { useRouter } from 'next/navigation';
import type { HostInfoResponseDto } from '@/services/stay.types';
import { createChatRoom, findExistingChatRoom } from '@/features/chat/api/chat.firestore';
import { notifyFirebaseUnavailable } from '@/features/chat/api/toastHelpers';
import { useAuthStore } from '@/stores/useAuthStores';
import type { Route } from 'next';
import { Lottie } from '@/components/atoms/Lottie';

export type Lang = 'kor' | 'eng';

interface SmartKeyListProps {
  keys: KeyResponseDto[];
}

export function SmartKeyList({ keys }: SmartKeyListProps) {
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { lang } = useLanguage();
  const t = messages[lang] ?? messages.kor;

  const x = useMotionValue(0);
  const cardWidth = 350;
  const gap = 24;

  const router = useRouter();
  const [showText, setShowText] = useState(false);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    // 기준 거리 (카드 폭의 20% 정도)
    const threshold = cardWidth * 0.2;

    let newIndex = activeIndex;

    if (offsetX < -threshold || velocityX < -500) {
      // 왼쪽으로 크게 드래그 → 다음 카드
      newIndex = Math.min(activeIndex + 1, keys.length - 1);
    } else if (offsetX > threshold || velocityX > 500) {
      // 오른쪽으로 크게 드래그 → 이전 카드
      newIndex = Math.max(activeIndex - 1, 0);
    }

    setActiveIndex(newIndex);

    const targetX = -newIndex * (cardWidth + gap);
    x.stop();
    // x.animate?.({ to: targetX, duration: 0.3 }); // 부드럽게 스냅 이동
  };

  const handleOpenDoor = async (keyId: number) => {
    setStatus('loading'); // 로딩 시작
    try {
      const res = await openSmartKey(keyId);

      if (res.code === 200 && res.result) {
        setStatus('success');
      } else {
        setStatus('error');
        toast.error(res.message || t.card.doorOpenFailed);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setShowText(false);
      const textTimer = setTimeout(() => setShowText(true), 200);
      const resetTimer = setTimeout(() => {
        setStatus('idle');
        setShowText(false);
      }, 2000);

      return () => {
        clearTimeout(textTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [status]);
  return (
    <main className="flex flex-col w-full max-h-screen pt-10 pb-28">
      <div>
        <h1 className="text-2xl font-semibold mt-2">{t.title}</h1>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6 p-5 pt-8 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{
              left: -(keys.length - 1) * (cardWidth + gap),
              right: 0,
            }}
            style={{ x }}
            onDragEnd={handleDragEnd}
          >
            {keys.map((key) => {
              const isFlipped = openCard === key.keyId;
              return (
                <SmartKeyCard
                  key={key.keyId}
                  keyData={key}
                  isFlipped={isFlipped}
                  setOpenCard={setOpenCard}
                  handleOpenDoor={handleOpenDoor}
                  t={t}
                  router={router}
                  lang={lang}
                />
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-36 inset-x-0 flex justify-center gap-2">
        {keys.map((k, i) => (
          <div
            key={k.keyId}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-5 bg-gray-800' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
      {status !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative flex items-center justify-center w-64 h-64">
            {status === 'success' && (
              <>
                <Lottie src="/lotties/card-success.json" loop={false} autoplay />
                <p className="absolute bottom-1 text-white text-base font-medium">
                  {t.card.doorOpened}
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <Lottie src="/lotties/card-fail.json" loop={false} autoplay />
                <p className="absolute bottom-1 text-white text-base font-medium">
                  {t.card.doorOpenFailed}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

interface SmartKeyCardProps {
  keyData: KeyResponseDto;
  isFlipped: boolean;
  setOpenCard: (id: number | null) => void;
  handleOpenDoor: (keyId: number) => void;
  t: any;
  router: ReturnType<typeof useRouter>;
  lang: string;
}

function SmartKeyCard({
  keyData,
  isFlipped,
  setOpenCard,
  handleOpenDoor,
  t,
  router,
  lang,
}: SmartKeyCardProps) {
  const [reservationDetail, setReservationDetail] = useState<ReservationDetailApiResponse | null>(
    null
  );
  const { uuid: myUid, profileUrl: myProfileUrl, initialized } = useAuthStore();
  const [startingChat, setStartingChat] = useState(false);

  const handleChatStart = async (host?: HostInfoResponseDto) => {
    if (startingChat) return;

    if (!initialized) {
      toast(t.common.checkingLogin);
      return;
    }
    if (!myUid) {
      toast.error(t.common.loginRequired);
      router.push('/register');
      return;
    }
    if (!reservationDetail?.stay) {
      toast.error(t.common.stayLoadFailRetry);
      return;
    }
    if (!host?.uuid) {
      toast.error(t.common.invalidHostInfo);
      return;
    }

    setStartingChat(true);
    try {
      const stayId = reservationDetail.stay.stayId;
      const existingId = await findExistingChatRoom(myUid, host.uuid, stayId);

      const chatId = existingId
        ? existingId
        : await createChatRoom({
            myUid,
            myProfileUrl,
            hostUid: host.uuid,
            hostProfileUrl: host.url ?? '',
            stayId,
          });

      const title = reservationDetail.stay.title;
      const addr = `${reservationDetail.stay.addressLine}`;
      const thumb = reservationDetail.stay.photos?.[0] ?? '';
      const opp = host.url ?? '';

      await router.push(
        `/chat/${encodeURIComponent(chatId)}?title=${encodeURIComponent(title)}&addr=${encodeURIComponent(
          addr
        )}&thumb=${encodeURIComponent(thumb)}&opp=${encodeURIComponent(opp)}`
      );
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.error('채팅방 처리 실패:', e);
      notifyFirebaseUnavailable(lang as Lang);
      toast.error(t.common.chatEnterFailRetry);
    } finally {
      setStartingChat(false);
    }
  };

  useEffect(() => {
    if (isFlipped && keyData.reservationId) {
      fetchReservationDetail(String(keyData.reservationId))
        .then((res) => {
          if (res.code === 200 && res.result) {
            setReservationDetail(res.result);
          }
        })
        .catch((err) => console.error('예약 상세 조회 실패:', err));
    }
  }, [isFlipped, keyData.reservationId]);

  return (
    <motion.div className="relative flex-shrink-0 w-[350px] h-[430px]">
      <motion.div
        onClick={() => setOpenCard(isFlipped ? null : keyData.keyId)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-full rounded-xl [transform-style:preserve-3d]"
      >
        <div
          className="absolute inset-0 p-8 rounded-xl
            bg-gradient-to-br from-primary/40 to-green/40 
            text-gray-600 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)',
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{keyData.stayName}</h3>
              <p className="text-sm text-gray-600">{keyData.addressLine}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 text-gray-600 text-xs shadow-sm">
              {keyData.status}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDoor(keyData.keyId);
            }}
            className="w-40 h-40 mx-auto rounded-full bg-white/50 backdrop-blur-sm border border-white/40 
              text-gray-800 text-xl font-semibold flex items-center justify-center shadow-inner 
              hover:bg-white/70 hover:scale-105 transition"
          >
            {t.card.openDoor}
          </button>

          <p className="text-center text-xs text-gray-700 mt-4 whitespace-pre-line leading-relaxed">
            {t.card.description}
          </p>
        </div>

        <div
          className="absolute inset-0 rounded-xl bg-white border border-gray-100 p-4 flex flex-col shadow-sm"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
          }}
        >
          <div className="flex flex-col flex-1">
            <div className="flex bg-gray-100 rounded-md overflow-hidden">
              <div className="w-28 aspect-square">
                <img
                  src={keyData.thumbnailUrl ?? ''}
                  className="w-full h-full object-cover rounded-md"
                />
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
                <p className="font-semibold">
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
                <p className="font-semibold">
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
              style={{
                background: 'linear-gradient(to right, #dbeafe, #fef9c3)',
                opacity: startingChat ? 0.6 : 1,
              }}
            >
              {t.host.chatStart}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
