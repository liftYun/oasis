'use client';

// 백엔드 응답 data 항목의 원소 타입
export interface ChatListItem {
  stayId: number;
  addr: string;
  thumbnail: string;
  title: string;
}

// 채팅 번역 API
export interface TranslateReq {
  text: string;
  // target은 백엔드 명세상 'ko' | 'en'
  target: 'ko' | 'en';
  // source는 명세상 'ko' | 'en' (선택)
  source?: 'ko' | 'en';
}

export interface TranslateRes {
  text: string; // 번역된 결과 텍스트
  target: 'ko' | 'en';
  engine: string;
}
