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
export const translateMessage = async (body: TranslateReq) => {
  const res = await http.post<BaseResponse<TranslateRes>>(`/api/v1/chat/translate`, body, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  // 새로운 응답 스키마(BaseResponse)에 맞춰 result만 반환
  return res.result;
};
