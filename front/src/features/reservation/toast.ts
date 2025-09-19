'use client';

import { toast } from 'react-hot-toast';

type ToastOptions = {
  message?: string;
};

/**
 * 예약 도메인 전용 토스트 유틸리티
 * 공용 AppToaster는 그대로 두고, 여기서 성공/실패 프리셋만 정의한다.
 */
export const toastSmartKeySuccess = ({ message }: ToastOptions = {}) =>
  toast.success(message ?? '스마트 키 등록이 완료되었습니다.');

export const toastSmartKeyError = ({ message }: ToastOptions = {}) =>
  toast.error(message ?? '닉네임을 찾을 수 없습니다.');
