'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation';
import { fetchStayDetail } from '@/services/stay.api';
import { StayReadResponseDto, HostInfoResponseDto } from '@/services/stay.types';
import { useLanguage } from '@/features/language';
import { stayDetailLocale } from '@/features/stays/locale';
import {
  StayBookingBar,
  StayImageSlider,
  StayMap,
  StayFacilities,
  StayDescription,
  StayReview,
  StayHostBar,
  StayHost,
  StayHeader,
} from '@/features/stays';
import { useAuthStore } from '@/stores/useAuthStores';
import { createChatRoom, findExistingChatRoom } from '@/features/chat/api/chat.firestore';
import { notifyFirebaseUnavailable } from '@/features/chat/api/toastHelpers';
import { toast } from 'react-hot-toast';
import { Lottie } from '@/components/atoms/Lottie';

export function StayDetail() {
  const { lang } = useLanguage();
  const t = stayDetailLocale[lang];
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [stay, setStay] = useState<StayReadResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  const { uuid: myUid, profileUrl: myProfileUrl, initialized } = useAuthStore();
  const [startingChat, setStartingChat] = useState(false);

  const handleChatStart = async (host: HostInfoResponseDto) => {
    if (startingChat) return;

    // 0) 사전 가드
    if (!initialized) {
      toast(t.common.checkingLogin);
      return;
    }
    if (!myUid) {
      toast.error(t.common.loginRequired);
      router.push('/register');
      return;
    }
    if (!stay) {
      toast.error(t.common.stayLoadFailRetry);
      return;
    }
    if (!host?.uuid) {
      toast.error(t.common.invalidHostInfo);
      return;
    }

    setStartingChat(true);
    try {
      // 1) 기존 방 조회 (게스트+호스트+숙소)
      const existingId = await findExistingChatRoom(myUid, host.uuid, stay.stayId);
      const chatId = existingId
        ? existingId
        : await createChatRoom({
            myUid,
            myProfileUrl,
            hostUid: host.uuid,
            hostProfileUrl: host.url,
            stayId: stay.stayId,
          });

      // 2) 숙소 정보와 상대 프로필을 쿼리로 전달 (리스트와 동일 패턴)
      const title = stay.title;
      const addr = `${stay.region} · ${stay.subRegion}`;
      const thumb = stay.photos?.[0]?.url ?? '';
      const opp = host.url ?? '';

      await router.push(
        `/chat/${encodeURIComponent(chatId)}?title=${encodeURIComponent(title)}&addr=${encodeURIComponent(
          addr
        )}&thumb=${encodeURIComponent(thumb)}&opp=${encodeURIComponent(opp)}`
      );
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.error('채팅방 처리 실패:', e);
      notifyFirebaseUnavailable(lang);
      toast.error(t.common.chatEnterFailRetry);
    } finally {
      setStartingChat(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetchStayDetail(Number(id));
        setStay(res.result);
      } catch (e) {
        console.error('숙소 조회 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4 pb-56">
        <Lottie src="/lotties/spinner.json" className="w-20 h-20" />
        <p className="mt-2 text-center text-gray-500">{t.common.loading}</p>
      </div>
    );
  }
  if (!stay) return <div className="p-6">{t.common.loadError}</div>;

  const isManageMode = pathname.startsWith('/manage') || searchParams.get('from') === 'manage';

  return (
    <section className="overflow-y-auto scrollbar-hide flex flex-1 flex-col relative">
      <StayHeader title={stay.title} />
      <StayImageSlider photos={stay.photos} title={stay.title} />

      <main className="relative w-full mx-auto px-6 pb-24">
        <div className="relative text-center justify-between">
          <h1 className="text-2xl font-bold mt-4">{stay.title}</h1>
          <p className="text-gray-400 mt-1">
            {stay.region} · {stay.subRegion}
          </p>
        </div>

        <StayFacilities facilities={stay.facilities} />
        <StayDescription description={stay.description} maxGuests={stay.maxGuest} />
        <StayMap postalCode={stay.postalCode} />
        <StayReview
          rating={stay.review.rating}
          highReviews={stay.review.highRateSummary}
          lowReviews={stay.review.lowRateSummary}
          stayId={stay.stayId}
        />

        <div className="-mx-6 w-screen h-3 bg-gray-100 my-12" />

        <StayHost host={stay.host} onChatStart={handleChatStart} />
      </main>

      {isManageMode ? <StayHostBar stay={stay} /> : <StayBookingBar stay={stay} />}
    </section>
  );
}
