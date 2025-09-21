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
  profileUrl?: string | null;
}

export interface UserSearchResultResponseVo {
  users: UserSearchItem[];
  page: number;
  size: number;
  total: number;
}

export interface BaseResponse<T> {
  status: number;
  message: string;
  result: T | null;
}
