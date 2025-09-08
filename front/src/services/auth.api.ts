import { http } from '@/apis';

export type NicknameValidationPayload = { nickname: string };
export type NicknameValidationResponse = { success: boolean; message?: string };
export type SaveProfilePayload = { profileImage: Blob; nickname: string; email?: string | null };
export type SaveProfileResponse = { success: boolean; userId?: string; message?: string };

export const validateNickname = ({ nickname }: NicknameValidationPayload) =>
  http.get<NicknameValidationResponse>(
    `/api/v1/auth/existByNickname/${encodeURIComponent(nickname)}`
  );

export const saveProfile = (payload: SaveProfilePayload) =>
  http.post<SaveProfileResponse>('/auth/addInformations', payload);
