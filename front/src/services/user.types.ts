// 내 프로필 정보
export interface MyProfile {
  id: number;
  nickname: string;
  email: string;
  profileImageUrl?: string;
  role: 'guest' | 'host';
  language: string;
  createdAt: string;
}

// 프로필 이미지 업로드 URL 발급
export interface UploadUrlResponse {
  status: number;
  message: string;
  result: {
    uploadUrl: string;
    publicUrl: string;
    key: string;
  };
}

// 프로필 이미지 업데이트 요청
export interface FinalizeResponse {
  status: number;
  message: string;
  result: {
    profileImgUrl: string;
  };
}

// 닉네임 검색 결과
export interface UserSearchResult {
  id: number;
  nickname: string;
  profileImageUrl?: string;
}

// 취소 정책 등록/수정
export interface CancellationPolicyRequest {
  daysBefore: number;
  refundRate: number;
}

export interface CancellationPolicyResponse {
  id: number;
  daysBefore: number;
  refundRate: number;
  createdAt: string;
}
