import { http } from '@/apis';
import {
  NicknameValidationPayload,
  NicknameValidationResponse,
  AddInformationsRequest,
  AddInformationsResponse,
} from './auth.types';

export const validateNickname = ({ nickname }: NicknameValidationPayload) =>
  http.get<NicknameValidationResponse>(
    `/api/v1/auth/existByNickname/${encodeURIComponent(nickname)}`
  );

export const addInformations = (body: AddInformationsRequest) =>
  http.put<AddInformationsResponse>('/api/v1/user/addInformations', body);
