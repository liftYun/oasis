export type NicknameValidationPayload = { nickname: string };
export type NicknameValidationResponse = { success: boolean; message?: string };

export type UserRole = 'ROLE_GUEST' | 'ROLE_HOST';
export type UserLanguage = 'kor' | 'eng';

export type AddInformationsRequest = {
  nickname: string;
  role: UserRole;
  language: UserLanguage;
  profileImage?: string | null;
};

export type AddInformationsResponse = {
  success: boolean;
  accessToken?: string;
  message?: string;
};
