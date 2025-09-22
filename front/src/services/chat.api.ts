'use client';

import { http } from '@/apis/httpClient';
import { ChatListItem, type TranslateReq, type TranslateRes } from './chat.types';
import type { BaseResponse } from './stay.types';

// 채팅 리스트 화면 숙소 정보 호출 (POST, body: [{ stayId }])
export const getChatList = (stayIds: number[]) =>
  http.post<BaseResponse<ChatListItem[]>>(
    `/api/v1/stay/chatList`,
    stayIds.map((id) => ({ stayId: id }))
  );

// 메시지 단건 번역
export const translateMessage = (body: TranslateReq) =>
  http.post<TranslateRes>(`/api/v1/chat/translate`, body, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
