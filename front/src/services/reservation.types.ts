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
  isCancled: boolean; // 취소 여부 (오탈자 포함)
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
