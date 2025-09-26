// 예약 생성 요청 타입
export interface CreateReservationRequest {
  reservationId?: string;
  stayId?: number;
  checkinDate?: string; // ISO-8601 date-time
  checkoutDate?: string; // ISO-8601 date-time
  reservationDate?: string; // ISO-8601 date-time
  payment?: number;
  stayTitle?: string;
  stayTitleEng?: string;
  reviewed?: boolean;
  cancled?: boolean;
  settlemented?: boolean;
  night?: number;
}

// 예약 생성 응답 타입
export interface CreateReservationResponse {
  httpStatus: any;
  isSuccess: boolean;
  message: string;
  code: number;
  result: {
    reservationId: string;
    stayId: number;
    checkinDate: string;
    checkoutDate: string;
    reservationDate: string;
    payment: number;
    stayTitle: string;
    stayTitleEng: string;
    reviewed: boolean;
    cancled: boolean;
    settlemented: boolean;
    thumbnail?: string;
    addressLine?: string;
    addressLineEng?: string;
    isReviewed?: boolean;
    isCancled?: boolean;
    isSettlemented?: boolean;
  } | null;
}

// 예약 생성 응답 타입 (approve, lock)
export interface BlockChainReservationResponse {
  httpStatus: any;
  isSuccess: boolean;
  message: string;
  code: number;
  result: {
    challengeId: string;
    userToken: string;
    encryptionKey: string;
  };
}

// 예약 상세 조회 응답 타입
// 서버 원본 응답
export interface ReservationDetailApiResponse {
  reservationId: string;
  reservationDate: string;
  payment: number;
  reviewed: boolean;
  canceled: boolean;
  settlemented: boolean;
  schedule: {
    checkinDate: string;
    checkoutDate: string;
  };
  participants: {
    count: number;
    members: any[];
  };
  stay: {
    addrDetail: string;
    addrDetailEng: string;
    addressLine: string;
    addressLineEng: string;
    stayId: number;
    title: string;
    titleEng: string;
    description: string;
    descriptionEng?: string;
    photos?: string[];
  };
  host: {
    nickname: string;
    uuid: string;
    profileImageUrl?: string;
  };
}

// 프론트에서 쓰는 DTO
export interface ReservationDetailResponseDto {
  reservationId: string;
  stayId: number;
  checkinDate: string;
  checkoutDate: string;
  reservationDate: string;
  guestCount: number;
  totalPrice: number;
  isReviewed: boolean;
  isCancled: boolean;
  isSettlemented: boolean;
}

export interface UserSearchItem {
  id: number;
  nickname: string;
  profileImageUrl?: string | null;
}

export interface UserSearchResultResponseVo {
  content: UserSearchItem[];
  page: number;
  size: number;
  total: number;
}

export interface BaseResponse<T> {
  code: number;
  message: string;
  result: T | null;
}

export interface ReservationResponseDto {
  reservationId: string;
  stayId: number;
  checkinDate: string; // ISO-8601
  checkoutDate: string; // ISO-8601
  reservationDate: string; // ISO-8601
  stayTitle: string;
  stayTitleEng: string;
  thumbnail: string;
  addressLine: string;
  addressLineEng: string;
  isSettlemented: boolean; // 정산 완료 여부
  isReviewed: boolean; // 리뷰 작성 여부
  isCanceled: boolean; // 취소 여부
}

// 리뷰 작성 요청
export interface RegistReviewRequestVo {
  reservationId: string;
  rating: number;
  originalContent?: string;
}

// 숙소 리뷰 응답 (StayReviewResponseVo)
export interface StayReviewResponseVo {
  reviewId: number;
  reservationId?: string;
  rating: number;
  createdAt: string; // ISO-8601
  content: string;
  nickname: string;
}

// 리뷰 상세 응답 (ReviewDetailResponseVo)
export interface ReviewDetailResponseVo {
  reviewId: number;
  reservationId?: string;
  rating: number;
  createdAt: string;
  content: string; // 원문 기준
}

// 내가 작성한 리뷰 리스트 (ReviewResponseVo)
export interface ReviewResponseVo {
  reviewId: number;
  reservationId?: string;
  rating: number;
  createdAt: string;
  thumbnail: string;
}

// 취소 정책 조회
export interface CancellationPolicyResponseVo {
  id: number;
  policy1: number;
  policy2: number;
  policy3: number;
  policy4: number;
}
