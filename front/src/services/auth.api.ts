'use client';

import axios from 'axios';
import { http } from '@/apis';
import {
  NicknameValidationPayload,
  NicknameValidationResponse,
  AddInformationsRequest,
  AddInformationsResponse,
} from './auth.types';

/*
 * 구글 로그인 시작 (리다이렉트)
 */
export const startGoogleLogin = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`;
};

/*
 * 로그인 콜백 처리 (accessToken/needProfileUpdate 수신)
 */
export const handleLoginCallback = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/login/oauth2/code/google`, {
    withCredentials: true,
  });

  const accessToken = res.headers['authorization']?.split(' ')[1] ?? null;
  const needProfileUpdate = res.data?.needProfileUpdate ?? false;

  return { accessToken, needProfileUpdate };
};

/*
 * 토큰 갱신
 */
export const refreshToken = () => http.post<{ accessToken: string }>('/api/v1/auth/refresh');

/*
 * 로그아웃
 */
export const logout = () => http.post<void>('/api/v1/auth/logout');

/*
 * 닉네임 중복 확인
 */
export const validateNickname = ({ nickname }: NicknameValidationPayload) =>
  http.get<NicknameValidationResponse>(
    `/api/v1/auth/existByNickname/${encodeURIComponent(nickname)}`
  );

/*
 * 첫 로그인 후 추가 정보 등록
 */
export const addInformations = (body: AddInformationsRequest) =>
  http.put<AddInformationsResponse>('/api/v1/user/addInformations', body);
