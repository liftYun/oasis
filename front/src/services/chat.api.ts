'use client';

import { http } from '@/apis/httpClient';
import { ChatListItem } from './chat.types';
import type { BaseResponse } from './stay.types';

// 채팅 리스트 화면 숙소 정보 호출 (POST, body: [{ stayId }])
export const getChatList = (stayIds: number[]) =>
  http.post<BaseResponse<ChatListItem[]>>(
    `/api/v1/stays/chatList`,
    stayIds.map((id) => ({ stayId: id }))
  );
