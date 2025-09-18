import { http } from '@/apis/httpClient';
import {
  MyProfile,
  UploadUrlResponse,
  FinalizeResponse,
  UserSearchResult,
  CancellationPolicyRequest,
  CancellationPolicyResponse,
} from './user.types';

// 내 프로필 조회
export const getMyProfile = () => http.get<{ result: MyProfile }>('/api/v1/user/mypage');

// 프로필 이미지 업로드 URL 발급
export const getPresignedUrl = (type: string, subtype: string) => {
  return http.post<UploadUrlResponse>(`/api/v1/user/profileImg/upload-url/${type}/${subtype}`);
};

// 프로필 이미지 업데이트 (S3 업로드 후 key 전달)
export const finalizeProfileImage = (file: string) => {
  return http.put<FinalizeResponse>('/api/v1/user/profileImg', null, {
    params: { file },
  });
};

// 닉네임 자동완성 검색
export const searchUserNicknames = (query: string) =>
  http.get<UserSearchResult[]>(`/api/v1/user/search?query=${encodeURIComponent(query)}`);

// 닉네임으로 사용자 단건 조회
export const getUserByNickname = (nickname: string) =>
  http.get<MyProfile>(`/api/v1/user/by-nickname/${encodeURIComponent(nickname)}`);

// 취소 정책 등록
export const registCancellationPolicy = (body: CancellationPolicyRequest) =>
  http.post<CancellationPolicyResponse>('/api/v1/user/regist/cancellationPolicy', body);

// 취소 정책 수정
export const updateCancellationPolicy = (body: CancellationPolicyRequest) =>
  http.put<CancellationPolicyResponse>('/api/v1/user/update/cancellationPolicy', body);

// 언어 변경
export const updateLanguage = (language: string) =>
  http.patch<void>(`/api/v1/user/updateLang/${language}`);
