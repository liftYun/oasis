'use client';

// 백엔드 응답 data 항목의 원소 타입
export interface ChatListItem {
  stayId: number;
  addr: string;
  thumbnail: string;
  title: string;
}
