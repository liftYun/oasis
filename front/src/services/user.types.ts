// 내 프로필 정보
export interface MyProfile {
  id: number;
  nickname: string;
  email: string;
  profileUrl: string;
  role: 'ROLE_GUEST' | 'ROLE_HOST';
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
  policy1: number; // 1~2일 전
  policy2: number; // 3~5일 전
  policy3: number; // 5~6일 전
  policy4: number; // 7일 전
}

export interface CancellationPolicyResponse {
  id: number;
  daysBefore: number;
  refundRate: number;
  createdAt: string;
}

// 내 숙소 카드 뷰 타입
export interface StayCardView {
  stayId: number;
  title: string;
  thumbnail: string;
  rating: number;
  price: number;
}

export interface MyStayListResponse {
  status: number;
  success: boolean;
  message: string;
  code: string;
  result: StayCardView[];
}

export interface ReviewResponseVo {
  reviewId: number;
  reservationId?: string;
  rating: number;
  createdAt: string;
  thumbnail: string;
}

export interface ReviewDetailResponseVo {
  reviewId: number;
  reservationId?: string;
  rating: number;
  createdAt: string;
  content: string;
}

export interface BaseResponse<T> {
  status: number;
  success: boolean;
  message: string;
  code: string;
  result: T;
}
