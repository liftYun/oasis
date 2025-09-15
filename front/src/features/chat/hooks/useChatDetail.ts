/* eslint-disable @typescript-eslint/consistent-type-definitions */
'use client';

import { useQuery } from '@tanstack/react-query';
import type { MessageItemModel } from '@/features/chat/components/MessageItem';

type StayInfo = {
  id: string;
  title: string;
  address: string;
};

export type ChatDetailData = {
  stay: StayInfo;
  messages: MessageItemModel[];
};

async function fetchChatDetail(chatId: string): Promise<ChatDetailData> {
  // TODO: 실제 API 연동
  await new Promise((r) => setTimeout(r, 200));
  return {
    stay: {
      id: 'stay-123',
      title: '광안 바이브',
      address: '부산 수영구 민락수변로 7 6층 601호',
    },
    messages: [
      {
        id: 'm1',
        content:
          '안녕하세요, 숙소 예약 관련해서 문의드려요. 이번 주말 토요일부터 일요일까지 1박 2일로 생각 중인데 혹시 아직 예약 가능할까요?',
        isMine: true,
        timestamp: '25.09.02 오전 10:00',
      },
      {
        id: 'm2',
        content:
          '안녕하세요 🙂 네, 이번 주말은 아직 예약 가능합니다. 체크인은 오후 3시 이후, 체크아웃은 오전 11시까지예요.',
        isMine: false,
        timestamp: '25.09.02 오전 10:00',
      },
      {
        id: 'm3',
        content:
          '혹시 반려동물 동반도 가능한가요? 강아지 한 마리와 함께 가려고 합니다.',
        isMine: true,
        timestamp: '25.09.02 오전 10:02',
      },
      {
        id: 'm4',
        content:
          '네, 반려동물 동반 가능합니다! 다만, 추가 청소비 2만원이 발생하는 점 참고 부탁드립니다.',
        isMine: false,
        timestamp: '25.09.02 오전 10:03',
      },
      {
        id: 'm5',
        content:
          '알겠습니다. 예약 진행은 어떻게 하면 될까요?',
        isMine: true,
        timestamp: '25.09.02 오전 10:04',
      },
    ],
  };
}

export function useChatDetail(chatId: string) {
  return useQuery({
    queryKey: ['chat', 'detail', chatId],
    queryFn: () => fetchChatDetail(chatId),
    enabled: !!chatId,
  });
}
