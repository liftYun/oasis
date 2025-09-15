export type UserRole = 'ROLE_GUEST' | 'ROLE_HOST';
export type UserLanguage = 'kor' | 'eng';

// 닉네임 중복 확인
export interface NicknameValidationPayload {
  nickname: string;
}

export interface NicknameValidationResponse {
  exist: boolean;
}

// 첫 로그인 후 추가 정보 등록
export interface AddInformationsRequest {
  nickname: string;
  role: UserRole;
  language: UserLanguage;
  profileImageUrl?: string;
  marketingAgree?: boolean;
}

export interface AddInformationsResponse {
  id: number;
  nickname: string;
  profileImageUrl?: string;
  role: 'guest' | 'host';
}

// 토큰 갱신 응답
export interface RefreshTokenResponse {
  accessToken: string;
}

// 로그인 이후 세션 유저 정보
export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  role: 'guest' | 'host';
}
