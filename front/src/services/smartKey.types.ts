// 스마트키 발급 요청 파라미터
export interface IssueSmartKeyRequest {
  reservationId: string | undefined;
  userNicknames: string[];
}

// 스마트키 발급 응답
export interface IssueSmartKeyResponse {
  code: number;
  message: string;
  result: number | null;
}

// 디지털 키 단건
export interface KeyResponseDto {
  keyId: number;
  deviceId: number;
  stayId: number;
  reservationId: string | null;
  stayName: string;
  stayNameEng: string;
  thumbnailUrl?: string | null;
  activationTime: string; // ISO-8601
  expirationTime?: string | null; // ISO-8601
  status: 'UPCOMING' | 'ACTIVE' | 'EXPIRED';
  checkinDate?: string | null; // ISO-8601
  checkoutDate?: string | null; // ISO-8601
}

// 리스트 응답 VO
export interface ListOfKeyResponseVO {
  listOfKeys: KeyResponseDto[];
}

// 공통 응답 wrapper
export interface BaseResponse<T> {
  code: number;
  message: string;
  result: T | null;
}

// 디지털 키 OPEN 요청 응답 타입
export interface OpenKeyResponse {
  code: number; // HTTP 상태 코드
  message: string; // 응답 메시지
  result: {
    commandId: string; // MQTT 발행 토픽 (예: device/{deviceId}/open)
  } | null;
}
