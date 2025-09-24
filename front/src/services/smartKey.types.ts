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
