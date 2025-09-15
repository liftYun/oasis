'use client';

import { useQuery } from '@tanstack/react-query';
import type { ChatListResponse } from '@/features/chat';

const DUMMY_CHATS: ChatListResponse = Array.from({ length: 5 }).map((_, i) => ({
  id: String(1000 + i),
  title: '광안 바이브',
  location: '부산광역시 수영구',
  thumbnailUrl: '/images/stay_example.png',
  lastDate: '25.09.02',
}));

async function fetchChatList(): Promise<ChatListResponse> {
  // TODO: 실제 API 연동 시 교체
  await new Promise((r) => setTimeout(r, 200));
  return DUMMY_CHATS;
}

export function useChatList() {
  return useQuery({
    queryKey: ['chat', 'list'],
    queryFn: fetchChatList,
  });
}
