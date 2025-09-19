'use client';

import { useQuery } from '@tanstack/react-query';
import type { ChatListResponse } from '@/features/chat';

const TEST_CHAT_LIST: ChatListResponse = [
  {
    id: 'test', // Firebase 테스트 방으로 연결
    title: '광안 바이브',
    location: '부산광역시 수영구',
    thumbnailUrl: '/images/stay_example.png',
    lastDate: '25.09.02',
  },
];

async function fetchChatList(): Promise<ChatListResponse> {
  return TEST_CHAT_LIST;
}

export function useChatList() {
  return useQuery({
    queryKey: ['chat', 'list'],
    queryFn: fetchChatList,
  });
}
