'use client';

import { http } from '@/apis';

/*
 * 프로필 조회
 */
export const getMyProfile = () => http.get('/api/v1/user/mypage');

/*
 * 프로필 이미지 업로드 URL 발급
 */
export const getProfileImageUploadUrl = () =>
  http.get<{ uploadUrl: string; key: string }>('/api/v1/user/profileImg/upload-url');

/*
 * 프로필 이미지 업로드 (S3 업로드 후 URL key 전달)
 */
export const updateProfileImage = (body: { key: string }) =>
  http.put('/api/v1/user/profileImg', body);

/*
 * 사용자 닉네임 조회 (오토컴플리트)
 */
export const searchUserNicknames = (query: string) =>
  http.get<string[]>(`/api/v1/user/search?query=${encodeURIComponent(query)}`);

/*
 * 사용자 닉네임 조회 (정확히 일치)
 */
export const getUserByNickname = (nickname: string) =>
  http.get(`/api/v1/user/by-nickname/${encodeURIComponent(nickname)}`);

/*
 * 취소 정책 등록
 */
export const registCancellationPolicy = (body: any) =>
  http.post('/api/v1/user/regist/cancellationPolicy', body);

/*
 * 취소 정책 수정
 */
export const updateCancellationPolicy = (body: any) =>
  http.put('/api/v1/user/update/cancellationPolicy', body);

/*
 * 언어 변경
 */
export const updateLanguage = (language: string) =>
  http.patch(`/api/v1/user/updateLang/${language}`);
